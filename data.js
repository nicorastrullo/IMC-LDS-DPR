window.DPR_DATA = {
  project: {
    title: "Disaster Preparedness and Response (DPR) Project in the Philippines",
    implementer: "International Medical Corps Philippine Mission",
    funder: "Latter-day Saint Charities Australia",
    reportingDate: "2026-08-11",
    endDate: "2026-12-31",
    overallDirectTarget: 16750
  },

  activities: [
    {
      id: "1.1",
      label: "Activity 1.1",
      name: "Deployment of Mobile Medical Teams (MMTs)",
      target: 4000,
      reach: 649,
      unit: "individuals",
      targetType: "fixed",
      statusOverride: null,
      description: "Primary health care consultations and medicines delivered through medical missions in Bulacan and Sarangani."
    },
    {
      id: "1.2",
      label: "Activity 1.2",
      name: "Integrated health and nutrition surge support",
      target: 600,
      reach: 126,
      unit: "individuals",
      targetType: "fixed",
      statusOverride: null,
      description: "96 children reached under the combined nutritionally-at-risk / MAM / SAM category, plus 30 pregnant and lactating women."
    },
    {
      id: "1.3",
      label: "Activity 1.3",
      name: "MHPSS training for frontline social and health workers",
      target: 450,
      reach: 0,
      unit: "frontline workers",
      targetType: "fixed",
      statusOverride: null,
      description: "Coordination and procurement are ongoing. No trained reach has been recorded yet."
    },
    {
      id: "2",
      label: "Activity 2",
      name: "Critical medicines, equipment, and supplies",
      target: null,
      reach: 8,
      unit: "health facilities",
      targetType: "needs_based",
      statusOverride: "Needs-based",
      description: "No numerical target is defined. Quantities and commodities depend on assessed needs for each deployment."
    },
    {
      id: "3A",
      label: "Activity 3",
      name: "Generator distribution",
      target: 25,
      reach: 8,
      unit: "generator sets",
      targetType: "fixed",
      statusOverride: null,
      description: "Eight generators distributed with a verified total of 1,800 liters of fuel."
    },
    {
      id: "3B",
      label: "Activity 3-B",
      name: "Medical rescue boat distribution",
      target: 1,
      reach: 1,
      unit: "medical rescue boat",
      targetType: "fixed",
      statusOverride: "Completed",
      description: "One medical rescue boat donated in Hagonoy, Bulacan in July 2026."
    },
    {
      id: "4",
      label: "Activity 4",
      name: "MPCA and non-food item assistance",
      target: 11700,
      reach: 3956,
      unit: "individuals",
      targetType: "fixed",
      statusOverride: null,
      description: "1,681 people reached through hygiene kits, 1,599 through household kits, and 676 through MPCA. No duplication across these recipients is confirmed."
    }
  ],

  nutrition: {
    childrenCombined: 96,
    childTarget: 100,
    childCategory: "Nutritionally-at-risk / MAM / SAM",
    pregnantAndLactatingWomen: 30,
    plwTarget: 500
  },

  medicalMissions: [
    { date: "2026-06-18", location: "Calumpit, Bulacan", total: 111, female: 83, male: 28, noSexData: 0, child: 27, adult: 82, noAgeData: 2 },
    { date: "2026-06-22", location: "Hagonoy, Bulacan", total: 95, female: 71, male: 22, noSexData: 2, child: 27, adult: 65, noAgeData: 3 },
    { date: "2026-07-13 to 2026-07-14", location: "Calumpit, Bulacan", total: 173, female: 98, male: 63, noSexData: 12, child: 106, adult: 59, noAgeData: 8 },
    { date: "2026-07-16", location: "Sitio Kapya, Brgy. Sapu Masla, Malapatan, Sarangani", total: 130, female: 50, male: 80, noSexData: 0, child: 66, adult: 64, noAgeData: 0 },
    { date: "2026-07-17", location: "Sitio Kyopa, Brgy. Sapu Masla, Malapatan, Sarangani", total: 140, female: 82, male: 58, noSexData: 0, child: 44, adult: 76, noAgeData: 20 }
  ],

  facilities: {
    totalSupported: 8,
    rhus: 7,
    provincialHospitals: 1,
    estimatedCatchmentPopulation: 862290,
    generatorsDistributed: 8,
    fuelLiters: 1800
  },

  distributions: [
    { modality: "Hygiene Kit", date: "2026-06-19", location: "Lumasal, Maasim, Sarangani", households: 200, people: 820 },
    { modality: "Hygiene Kit", date: "2026-07-03", location: "Quirangay, Camalig, Albay", households: 83, people: 340 },
    { modality: "Hygiene Kit", date: "2026-07-03", location: "Anoling, Camalig, Albay", households: 127, people: 521 },

    { modality: "Household Kit", date: "2026-07-18", location: "Brgy. Tucal, Sarangani, Davao Occidental", households: 87, people: 357 },
    { modality: "Household Kit", date: "2026-07-19", location: "Brgy. Gomtago, Sarangani, Davao Occidental", households: 24, people: 98 },
    { modality: "Household Kit", date: "2026-07-19", location: "Brgy. Lipol, Sarangani, Davao Occidental", households: 182, people: 746 },
    { modality: "Household Kit", date: "2026-07-19", location: "Brgy. Tagen, Sarangani, Davao Occidental", households: 97, people: 398 },

    { modality: "MPCA", date: "2026-07-01 to 2026-07-03", location: "Brgy. Traversia, Guinobatan, Albay", households: 89, people: 404 },
    { modality: "MPCA", date: "2026-07-01 to 2026-07-03", location: "Brgy. San Francisco, Guinobatan, Albay", households: 63, people: 272 }
  ],

  mpca: {
    applications: 308,
    approvedHouseholds: 152,
    individualsReached: 676,
    amountPerHouseholdPhp: 5000,
    totalDisbursedPhp: 760000,
    womenPercent: 82,
    menPercent: 18
  },

  rescueBoat: {
    target: 1,
    reach: 1,
    location: "Hagonoy, Bulacan",
    donationMonth: "July 2026"
  },

  dataQuality: [
    {
      severity: "High",
      issue: "Medical mission source value “17331”",
      resolution: "Use 173. The sex-disaggregated values 98 + 63 + 12 reconcile to 173."
    },
    {
      severity: "High",
      issue: "Medical mission aggregate source value “649507”",
      resolution: "Use 649. Female 384 + male 251 + no SDD 14 reconcile to 649."
    },
    {
      severity: "Medium",
      issue: "Hygiene-kit source values “837” and “1278”",
      resolution: "Use 83 and 127 respectively. Together with Lumasal's 200 households, the total is 410."
    },
    {
      severity: "Low",
      issue: "Date label “Julyne”",
      resolution: "Use July dates reflected in the detailed distribution records."
    },
    {
      severity: "Low",
      issue: "Location spelling “Guinubatan”",
      resolution: "Use Guinobatan, Albay."
    }
  ],

  managementActions: [
    {
      action: "Accelerate medical consultation reach under Activity 1.1",
      owner: "Program / MMT",
      dueDate: "2026-08-31",
      priority: "High",
      status: "Open"
    },
    {
      action: "Finalize MHPSS training schedule and participant pipeline",
      owner: "Program / MHPSS",
      dueDate: "2026-08-31",
      priority: "High",
      status: "Open"
    },
    {
      action: "Plan remaining generator allocations based on facility needs",
      owner: "Program / Logistics",
      dueDate: "2026-09-15",
      priority: "High",
      status: "Open"
    }
  ]
};
