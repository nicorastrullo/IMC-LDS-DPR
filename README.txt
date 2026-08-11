DPR Philippines Performance Dashboard — visualization upgrade

Files
-----
index.html
styles.css
data.js
app.js

New high-quality visualizations
-------------------------------
- Overall direct reach doughnut chart
- Activity completion horizontal bar chart
- Activity 4 assistance reach bar chart
- Reach vs target grouped chart
- Remaining gap by activity chart
- Medical mission patients trend chart
- Medical mission sex and age doughnut charts
- Generator deployment doughnut chart
- Facility support snapshot chart
- Distribution households and people charts

Notes
-----
- Charts use Chart.js via CDN.
- Keep all files in one folder and open index.html.
- If the browser has no internet connection, the dashboard still loads core content, but the charts will not render because Chart.js is loaded from jsDelivr.
- All underlying totals still come from data.js and are validated in app.js.

Executive Overview update
-------------------------
- The standalone Management Actions navigation tab has been removed.
- The action tracker is now incorporated into Executive Overview as “Recommended Management Actions.”
- The table remains dynamically populated from data.js via app.js.
