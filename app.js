(() => {
  "use strict";
  const data = window.DPR_DATA;
  if (!data) {
    document.body.innerHTML = "<p style='padding:24px'>Dashboard data failed to load.</p>";
    return;
  }

  const state = {
    section: "overview",
    reportingDate: data.project.reportingDate,
    activityFilter: "all",
    statusFilter: "all",
    search: ""
  };

  const charts = {};
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const fmt = (value) => Number(value).toLocaleString("en-PH");
  const pct = (reach, target) => target ? (reach / target) * 100 : null;

  const palette = {
    navy: '#123B66', blue: '#1769AA', interactiveBlue: '#2786D1', lightBlue: '#8EC5E8',
    green: '#27A678', lightGreen: '#A7E3C5', amber: '#F2B84B', red: '#D9534F', muted: '#B8C4CF'
  };

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
    plugins: {
      legend: { labels: { color: '#24313D', boxWidth: 12, font: { size: 11 } } },
      tooltip: {
        backgroundColor: 'rgba(18,59,102,0.95)',
        titleColor: '#fff', bodyColor: '#fff', padding: 10, displayColors: true
      }
    },
    scales: {
      x: { ticks: { color: '#667581', font: { size: 11 } }, grid: { color: 'rgba(18,59,102,0.08)' } },
      y: { ticks: { color: '#667581', font: { size: 11 } }, grid: { color: 'rgba(18,59,102,0.08)' } }
    }
  };

  function daysRemaining(reportingDate) {
    const start = new Date(`${reportingDate}T00:00:00+08:00`);
    const end = new Date(`${data.project.endDate}T23:59:59+08:00`);
    return Math.max(0, Math.ceil((end - start) / 86400000));
  }
  function monthsRemaining(reportingDate) { return daysRemaining(reportingDate) / 30.44; }
  function weeksRemaining(reportingDate) { return daysRemaining(reportingDate) / 7; }

  function statusFor(activity) {
    if (activity.statusOverride) return activity.statusOverride;
    if (activity.targetType === 'needs_based' || activity.target == null) return 'Needs-based';
    const completion = pct(activity.reach, activity.target);
    if (completion >= 100) return 'Completed';
    if (completion >= 75) return 'On track';
    if (completion >= 40) return 'At risk';
    return 'Critical';
  }
  function statusClass(status) {
    const map = {
      'Completed': 'status-completed', 'On track': 'status-track', 'At risk': 'status-risk',
      'Critical': 'status-critical', 'Needs-based': 'status-needs', 'Needs verification': 'status-verify'
    };
    return map[status] || 'status-neutral';
  }

  function overallDirectReach() {
    return data.activities.filter(a => ['1.1', '1.2', '1.3', '4'].includes(a.id)).reduce((sum, a) => sum + a.reach, 0);
  }
  function overallDirectTarget() {
    return data.activities.filter(a => ['1.1', '1.2', '1.3', '4'].includes(a.id)).reduce((sum, a) => sum + (a.target || 0), 0);
  }
  function distributionTotals(modality) {
    return data.distributions.filter(d => d.modality === modality).reduce((acc, d) => {
      acc.households += d.households; acc.people += d.people; return acc;
    }, { households: 0, people: 0 });
  }
  function missionTotals() {
    return data.medicalMissions.reduce((acc, m) => {
      for (const key of ['total', 'female', 'male', 'noSexData', 'child', 'adult', 'noAgeData']) acc[key] += m[key];
      return acc;
    }, { total: 0, female: 0, male: 0, noSexData: 0, child: 0, adult: 0, noAgeData: 0 });
  }
  function validateMission(mission) {
    return mission.female + mission.male + mission.noSexData === mission.total && mission.child + mission.adult + mission.noAgeData === mission.total;
  }
  function destroyChart(id) { if (charts[id]) { charts[id].destroy(); delete charts[id]; } }
  function createChart(id, config) {
    const el = qs(`#${id}`); if (!el || typeof Chart === 'undefined') return;
    destroyChart(id); charts[id] = new Chart(el, config);
  }

  function setSection(sectionId) {
    state.section = sectionId;
    qsa('.section').forEach(section => { section.hidden = section.id !== sectionId; });
    qsa('[data-section]').forEach(button => {
      const active = button.dataset.section === sectionId;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderHeader() {
    qs('#reportingDate').value = state.reportingDate;
    const days = daysRemaining(state.reportingDate);
    const months = monthsRemaining(state.reportingDate);
    qs('#daysRemaining').textContent = fmt(days);
    qs('#monthsRemaining').textContent = months.toFixed(1);
    qs('#remainingText').textContent = `${fmt(days)} days remaining`;
    qs('#timeRemainingBar').style.width = `${Math.min((days / 142) * 100, 100)}%`;
  }

  function renderOverview() {
    const directReach = overallDirectReach();
    const directTarget = overallDirectTarget();
    const overallPct = pct(directReach, directTarget);
    qs('#directReachValue').textContent = `${fmt(directReach)} / ${fmt(directTarget)}`;
    qs('#directReachNote').textContent = `${overallPct.toFixed(1)}% of the overall direct-reach target achieved.`;
    qs('#consultationReach').textContent = fmt(data.activities.find(a => a.id === '1.1').reach);
    qs('#nutritionReach').textContent = fmt(data.activities.find(a => a.id === '1.2').reach);
    qs('#trainingReach').textContent = fmt(data.activities.find(a => a.id === '1.3').reach);
    qs('#facilityReach').textContent = fmt(data.facilities.totalSupported);
    qs('#catchmentReach').textContent = fmt(data.facilities.estimatedCatchmentPopulation);
    qs('#generatorReach').textContent = `${fmt(data.facilities.generatorsDistributed)} / 25`;
    qs('#fuelReach').textContent = `${fmt(data.facilities.fuelLiters)} L`;
    qs('#boatReach').textContent = `${data.rescueBoat.reach} / ${data.rescueBoat.target}`;

    const hygiene = distributionTotals('Hygiene Kit');
    const household = distributionTotals('Household Kit');
    const mpca = distributionTotals('MPCA');
    qs('#hygieneHouseholds').textContent = fmt(hygiene.households);
    qs('#householdHouseholds').textContent = fmt(household.households);
    qs('#mpcaHouseholds').textContent = fmt(mpca.households);
    qs('#activity4People').textContent = fmt(hygiene.people + household.people + mpca.people);

    const statuses = data.activities.map(statusFor);
    const critical = statuses.filter(s => s === 'Critical').length;
    const completed = statuses.filter(s => s === 'Completed').length;
    const onTrack = statuses.filter(s => s === 'On track').length;
    const needsBased = statuses.filter(s => s === 'Needs-based').length;
    qs('#healthSummary').textContent = `${critical} critical · ${onTrack} on track · ${completed} completed · ${needsBased} needs-based`;
  }

  function renderPerformance() {
    const activitySelect = qs('#activityFilter');
    if (!activitySelect.dataset.ready) {
      data.activities.forEach(activity => {
        const option = document.createElement('option');
        option.value = activity.id; option.textContent = `${activity.label} — ${activity.name}`; activitySelect.appendChild(option);
      });
      activitySelect.dataset.ready = 'true';
    }

    const months = Math.max(monthsRemaining(state.reportingDate), 0.1);
    const weeks = Math.max(weeksRemaining(state.reportingDate), 0.1);
    const filtered = data.activities.filter(activity => {
      const status = statusFor(activity);
      const matchesActivity = state.activityFilter === 'all' || activity.id === state.activityFilter;
      const matchesStatus = state.statusFilter === 'all' || status === state.statusFilter;
      const haystack = `${activity.label} ${activity.name} ${activity.description}`.toLowerCase();
      const matchesSearch = !state.search || haystack.includes(state.search.toLowerCase());
      return matchesActivity && matchesStatus && matchesSearch;
    });

    qs('#performanceList').innerHTML = filtered.map(activity => {
      const status = statusFor(activity);
      if (activity.target == null) {
        return `<article class="performance-card"><div><div class="eyebrow">${activity.label}</div><h3>${activity.name}</h3><p>${activity.description}</p></div><div class="performance-side"><span class="status ${statusClass(status)}">${status}</span><div class="performance-number">${fmt(activity.reach)}</div><div class="muted">${activity.unit} supported</div><div class="muted">No numerical target; delivery is driven by assessed deployment needs.</div></div></article>`;
      }
      const completion = pct(activity.reach, activity.target);
      const gap = Math.max(activity.target - activity.reach, 0);
      const monthly = gap / months;
      const weekly = gap / weeks;
      return `<article class="performance-card"><div><div class="eyebrow">${activity.label}</div><h3>${activity.name}</h3><p>${activity.description}</p><div class="progress-row"><span>${fmt(activity.reach)} / ${fmt(activity.target)} ${activity.unit}</span><strong>${completion.toFixed(1)}%</strong></div><div class="progress"><span style="width:${Math.min(completion, 100)}%"></span></div></div><div class="performance-side"><span class="status ${statusClass(status)}">${status}</span><div class="mini-grid"><div><span class="muted">Gap</span><strong>${fmt(gap)}</strong></div><div><span class="muted">Per month</span><strong>${monthly.toFixed(1)}</strong></div><div><span class="muted">Per week</span><strong>${weekly.toFixed(1)}</strong></div></div></div></article>`;
    }).join('') || `<div class="empty">No activities match the selected filters.</div>`;
  }

  function renderMissions() {
    const totals = missionTotals();
    qs('#missionTotal').textContent = fmt(totals.total);
    qs('#missionFemale').textContent = fmt(totals.female);
    qs('#missionMale').textContent = fmt(totals.male);
    qs('#missionNoSex').textContent = fmt(totals.noSexData);
    qs('#missionsBody').innerHTML = data.medicalMissions.map(m => `<tr><td>${m.date}</td><td>${m.location}</td><td>${fmt(m.total)}</td><td>${fmt(m.female)}</td><td>${fmt(m.male)}</td><td>${fmt(m.noSexData)}</td><td>${fmt(m.child)}</td><td>${fmt(m.adult)}</td><td>${fmt(m.noAgeData)}</td><td><span class="status ${validateMission(m) ? 'status-completed' : 'status-critical'}">${validateMission(m) ? 'Reconciled' : 'Mismatch'}</span></td></tr>`).join('');
  }

  function renderDistributions() {
    const hygiene = distributionTotals('Hygiene Kit');
    const household = distributionTotals('Household Kit');
    const mpca = distributionTotals('MPCA');
    qs('#distHygiene').textContent = `${fmt(hygiene.households)} HH / ${fmt(hygiene.people)} people`;
    qs('#distHousehold').textContent = `${fmt(household.households)} HH / ${fmt(household.people)} people`;
    qs('#distMpca').textContent = `${fmt(mpca.households)} HH / ${fmt(mpca.people)} people`;
    qs('#distTotalPeople').textContent = fmt(hygiene.people + household.people + mpca.people);
    qs('#distributionBody').innerHTML = data.distributions.map(d => `<tr><td>${d.modality}</td><td>${d.date}</td><td>${d.location}</td><td>${fmt(d.households)}</td><td>${fmt(d.people)}</td></tr>`).join('');
  }

  function renderFacilities() {
    qs('#facilitiesSupported').textContent = fmt(data.facilities.totalSupported);
    qs('#rhuCount').textContent = fmt(data.facilities.rhus);
    qs('#hospitalCount').textContent = fmt(data.facilities.provincialHospitals);
    qs('#facilityCatchment').textContent = fmt(data.facilities.estimatedCatchmentPopulation);
    qs('#facilityGenerators').textContent = fmt(data.facilities.generatorsDistributed);
    qs('#facilityFuel').textContent = `${fmt(data.facilities.fuelLiters)} L`;
    qs('#boatLocation').textContent = data.rescueBoat.location;
    qs('#boatMonth').textContent = data.rescueBoat.donationMonth;
  }

  function renderQuality() {
    qs('#qualityCount').textContent = fmt(data.dataQuality.length);
    qs('#qualityList').innerHTML = data.dataQuality.map(item => `<article class="quality-item"><div class="quality-top"><span class="severity severity-${item.severity.toLowerCase()}">${item.severity}</span><h3>${item.issue}</h3></div><p>${item.resolution}</p></article>`).join('');
  }

  function renderActions() {
    const today = new Date(`${state.reportingDate}T23:59:59+08:00`);
    qs('#actionsBody').innerHTML = data.managementActions.map(item => {
      const due = new Date(`${item.dueDate}T23:59:59+08:00`);
      const overdue = item.status !== 'Closed' && due < today;
      return `<tr><td>${item.action}</td><td>${item.owner}</td><td>${item.dueDate}</td><td>${item.priority}</td><td><span class="status ${overdue ? 'status-critical' : 'status-verify'}">${overdue ? 'Overdue' : item.status}</span></td></tr>`;
    }).join('');
  }

  function renderCharts() {
    const directReach = overallDirectReach();
    const directTarget = overallDirectTarget();
    const remainingDirect = Math.max(directTarget - directReach, 0);
    const fixedActivities = data.activities.filter(a => a.target != null);
    const completionLabels = fixedActivities.map(a => a.label);
    const completionValues = fixedActivities.map(a => Number(pct(a.reach, a.target).toFixed(1)));
    const gapValues = fixedActivities.map(a => Math.max(a.target - a.reach, 0));

    const hygiene = distributionTotals('Hygiene Kit');
    const household = distributionTotals('Household Kit');
    const mpca = distributionTotals('MPCA');
    const missions = missionTotals();

    createChart('directReachChart', {
      type: 'doughnut',
      data: {
        labels: ['Reached', 'Remaining'],
        datasets: [{ data: [directReach, remainingDirect], backgroundColor: [palette.blue, '#DDE5EC'], borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        ...chartDefaults,
        cutout: '72%',
        plugins: { ...chartDefaults.plugins, legend: { position: 'bottom', labels: { color: '#24313D', font: { size: 11 } } } }
      }
    });

    createChart('activityCompletionChart', {
      type: 'bar',
      data: {
        labels: completionLabels,
        datasets: [{ label: 'Completion %', data: completionValues, backgroundColor: [palette.blue, palette.green, palette.red, palette.amber, palette.green, palette.interactiveBlue], borderRadius: 8, maxBarThickness: 34 }]
      },
      options: {
        ...chartDefaults,
        indexAxis: 'y',
        plugins: { ...chartDefaults.plugins, legend: { display: false } },
        scales: { x: { beginAtZero: true, max: 100, ticks: { color: '#667581', callback: value => value + '%' }, grid: { color: 'rgba(18,59,102,0.08)' } }, y: { ticks: { color: '#667581' }, grid: { display: false } } }
      }
    });

    createChart('activity4ModalityChart', {
      type: 'bar',
      data: {
        labels: ['Hygiene Kit', 'Household Kit', 'MPCA'],
        datasets: [{ label: 'People reached', data: [hygiene.people, household.people, mpca.people], backgroundColor: [palette.blue, palette.green, palette.amber], borderRadius: 8 }]
      },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }
    });

    createChart('targetVsReachChart', {
      type: 'bar',
      data: {
        labels: fixedActivities.map(a => a.label),
        datasets: [
          { label: 'Target', data: fixedActivities.map(a => a.target), backgroundColor: '#DDE5EC', borderRadius: 8 },
          { label: 'Reach', data: fixedActivities.map(a => a.reach), backgroundColor: palette.blue, borderRadius: 8 }
        ]
      },
      options: { ...chartDefaults }
    });

    createChart('activityGapChart', {
      type: 'bar',
      data: {
        labels: fixedActivities.map(a => a.label),
        datasets: [{ label: 'Remaining gap', data: gapValues, backgroundColor: palette.red, borderRadius: 8 }]
      },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }
    });

    createChart('missionPatientsChart', {
      type: 'line',
      data: {
        labels: data.medicalMissions.map(m => m.date.split(' to ')[0]),
        datasets: [{ label: 'Patients', data: data.medicalMissions.map(m => m.total), borderColor: palette.blue, backgroundColor: 'rgba(23,105,170,0.12)', fill: true, tension: 0.35, pointBackgroundColor: palette.blue, pointRadius: 4 }]
      },
      options: { ...chartDefaults }
    });

    createChart('missionSexChart', {
      type: 'doughnut',
      data: {
        labels: ['Female', 'Male', 'No sex data'],
        datasets: [{ data: [missions.female, missions.male, missions.noSexData], backgroundColor: [palette.blue, palette.green, palette.amber], borderWidth: 0 }]
      },
      options: { ...chartDefaults, cutout: '64%', plugins: { ...chartDefaults.plugins, legend: { position: 'bottom' } }, scales: {} }
    });

    createChart('missionAgeChart', {
      type: 'doughnut',
      data: {
        labels: ['Child', 'Adult', 'No age data'],
        datasets: [{ data: [missions.child, missions.adult, missions.noAgeData], backgroundColor: [palette.interactiveBlue, palette.green, palette.amber], borderWidth: 0 }]
      },
      options: { ...chartDefaults, cutout: '64%', plugins: { ...chartDefaults.plugins, legend: { position: 'bottom' } }, scales: {} }
    });

    createChart('generatorChart', {
      type: 'doughnut',
      data: {
        labels: ['Distributed', 'Remaining'],
        datasets: [{ data: [data.facilities.generatorsDistributed, 25 - data.facilities.generatorsDistributed], backgroundColor: [palette.green, '#DDE5EC'], borderWidth: 0 }]
      },
      options: { ...chartDefaults, cutout: '70%', plugins: { ...chartDefaults.plugins, legend: { position: 'bottom' } }, scales: {} }
    });

    createChart('facilitySupportChart', {
      type: 'bar',
      data: {
        labels: ['Facilities', 'Generators', 'Fuel (x100 L)', 'Catchment (x10k)'],
        datasets: [{ label: 'Support scale', data: [data.facilities.totalSupported, data.facilities.generatorsDistributed, data.facilities.fuelLiters / 100, data.facilities.estimatedCatchmentPopulation / 10000], backgroundColor: [palette.blue, palette.green, palette.amber, palette.interactiveBlue], borderRadius: 8 }]
      },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }
    });

    createChart('distributionHouseholdsChart', {
      type: 'bar',
      data: {
        labels: ['Hygiene Kit', 'Household Kit', 'MPCA'],
        datasets: [{ label: 'Households', data: [hygiene.households, household.households, mpca.households], backgroundColor: [palette.blue, palette.green, palette.amber], borderRadius: 8 }]
      },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }
    });

    createChart('distributionPeopleChart', {
      type: 'pie',
      data: {
        labels: ['Hygiene Kit', 'Household Kit', 'MPCA'],
        datasets: [{ data: [hygiene.people, household.people, mpca.people], backgroundColor: [palette.blue, palette.green, palette.amber], borderWidth: 0 }]
      },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { position: 'bottom' } }, scales: {} }
    });
  }

  function exportPerformanceCsv() {
    const rows = [['Activity','Name','Target','Reach','Unit','Status','Description'], ...data.activities.map(a => [a.label,a.name,a.target == null ? '' : a.target,a.reach,a.unit,statusFor(a),a.description])];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'DPR_activity_performance.csv'; anchor.click(); URL.revokeObjectURL(url);
  }

  function bindEvents() {
    qsa('[data-section]').forEach(button => button.addEventListener('click', () => setSection(button.dataset.section)));
    qs('#reportingDate').addEventListener('change', event => { state.reportingDate = event.target.value; renderHeader(); renderPerformance(); renderActions(); renderCharts(); });
    qs('#activityFilter').addEventListener('change', event => { state.activityFilter = event.target.value; renderPerformance(); });
    qs('#statusFilter').addEventListener('change', event => { state.statusFilter = event.target.value; renderPerformance(); });
    qs('#searchFilter').addEventListener('input', event => { state.search = event.target.value; renderPerformance(); });
    qs('#printButton').addEventListener('click', () => window.print());
    qs('#exportCsvButton').addEventListener('click', exportPerformanceCsv);
  }

  function runConsistencyChecks() {
    const errors = [];
    const directReach = overallDirectReach(); const directTarget = overallDirectTarget();
    if (directReach !== 4731) errors.push(`Direct reach expected 4,731 but calculated ${directReach}.`);
    if (directTarget !== 16750) errors.push(`Direct target expected 16,750 but calculated ${directTarget}.`);
    const hygiene = distributionTotals('Hygiene Kit'); const household = distributionTotals('Household Kit'); const mpca = distributionTotals('MPCA');
    if (hygiene.households !== 410 || hygiene.people !== 1681) errors.push('Hygiene-kit totals do not reconcile.');
    if (household.households !== 390 || household.people !== 1599) errors.push('Household-kit totals do not reconcile.');
    if (mpca.households !== 152 || mpca.people !== 676) errors.push('MPCA totals do not reconcile.');
    if (hygiene.people + household.people + mpca.people !== 3956) errors.push('Activity 4 people reach does not reconcile to 3,956.');
    const missions = missionTotals();
    if (missions.total !== 649) errors.push('Medical mission total does not reconcile to 649.');
    if (missions.female !== 384 || missions.male !== 251 || missions.noSexData !== 14) errors.push('Medical mission sex totals do not reconcile.');
    if (missions.child !== 270 || missions.adult !== 346 || missions.noAgeData !== 33) errors.push('Medical mission age totals do not reconcile.');
    if (data.facilities.fuelLiters !== 1800) errors.push('Fuel total must be 1,800 L.');
    if (data.rescueBoat.reach !== 1 || data.rescueBoat.target !== 1) errors.push('Medical rescue boat must be 1 of 1 completed.');
    const activity2 = data.activities.find(a => a.id === '2');
    if (activity2.target !== null || activity2.targetType !== 'needs_based') errors.push('Activity 2 must have no fixed numerical target.');
    const check = qs('#consistencyCheck');
    if (errors.length === 0) { check.textContent = 'All programmed consistency checks passed.'; check.className = 'check check-pass'; }
    else { check.innerHTML = `<strong>Consistency check failed:</strong><ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>`; check.className = 'check check-fail'; console.error('DPR dashboard consistency errors:', errors); }
  }

  function init() {
    bindEvents();
    renderHeader(); renderOverview(); renderPerformance(); renderMissions(); renderDistributions(); renderFacilities(); renderQuality(); renderActions(); renderCharts(); runConsistencyChecks(); setSection('overview');
  }
  document.addEventListener('DOMContentLoaded', init);
})();
