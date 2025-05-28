// chart-switcher.js

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".chart-tab-button");

  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const chartId = btn.dataset.chart;

      // 1. Switch active button
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // 2. Hide all chart boxes
      document.querySelectorAll(".chart-box").forEach(box => {
        box.style.display = "none";
      });

      // 3. Show the selected chart box
      const targetId = chartId + "Box";
      const target = document.getElementById(targetId);
      if (target) {
        target.style.display = "flex";
      }

      // 4. Render the chart if function exists
      if (typeof window[`render${chartId.charAt(0).toUpperCase() + chartId.slice(1)}`] === "function") {
        await window[`render${chartId.charAt(0).toUpperCase() + chartId.slice(1)}`]();
      }
    });
  });
});
