// chart-switcher.js

/**
 * @file chart-switcher.js
 * @description
 * Adds click event listeners to the chart tab buttons to switch between charts dynamically.
 * It toggles the active chart by showing/hiding the appropriate chart container box
 * and invokes the corresponding render function dynamically.
 *
 * @author
 * Cristobal Serra
 *
 * @company
 * Siempre Energy
 *
 * @version
 * 1.0.0
 */
document.addEventListener("DOMContentLoaded", () => {
  // STEP 1: Select all chart tab buttons
  const buttons = document.querySelectorAll(".chart-tab-button");

  // STEP 2: Add click event listener to each button
  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const chartId = btn.dataset.chart;

      // STEP 3: Switch active button styling
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // STEP 4: Hide all chart boxes
      document.querySelectorAll(".chart-box").forEach(box => {
        box.style.display = "none";
      });

      // STEP 5: Show the selected chart box
      const targetId = chartId + "Box";
      const target = document.getElementById(targetId);
      if (target) {
        target.style.display = "flex";
      }

      // STEP 6: Dynamically render the selected chart if function exists
      const renderFunctionName = `render${chartId.charAt(0).toUpperCase() + chartId.slice(1)}`;
      if (typeof window[renderFunctionName] === "function") {
        await window[renderFunctionName]();
      }
    });
  });
});
