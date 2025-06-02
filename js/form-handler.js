// form-handler.js

/**
 * @file form-handler.js
 * @description
 * Manages the multi-step form logic, including navigation between steps,
 * validation of required fields, and initial population of the department dropdown.
 * The form submission itself is handled externally in submit-data.js.
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
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("solarForm");
  const steps = Array.from(document.querySelectorAll(".form-step"));
  const nextBtns = document.querySelectorAll(".next-btn");
  const prevBtns = document.querySelectorAll(".prev-btn");
  const resultsSection = document.getElementById("resultsSection");
  const departmentDropdown = document.getElementById("departmentDropdown");

  let currentStep = 0;

  /**
   * @function showStep
   * @description
   * Shows the specified step in the multi-step form and hides others.
   *
   * @param {number} stepIndex - The index of the step to show.
   */
  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.style.display = index === stepIndex ? "flex" : "none";
    });
  }

  showStep(currentStep); // Show initial step

  // STEP: Next button click handler
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  // STEP: Previous button click handler
  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      currentStep--;
      showStep(currentStep);
    });
  });

  // STEP: Form submission handler
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateStep(currentStep)) {
      handleSubmit();
    }
  });

  /**
   * @function validateStep
   * @description
   * Validates required fields in the current step.
   * Highlights empty fields with a red border.
   *
   * @param {number} stepIndex - The index of the step to validate.
   *
   * @returns {boolean} Whether the step is valid.
   */
  function validateStep(stepIndex) {
    const inputs = steps[stepIndex].querySelectorAll("input, select");
    for (let input of inputs) {
      if (!input.value.trim()) {
        input.style.borderColor = "red";
        input.focus();
        return false;
      } else {
        input.style.borderColor = "#ccc";
      }
    }
    return true;
  }

  /**
   * @function handleSubmit
   * @description
   * Placeholder function that will be overwritten by submit-data.js.
   */
  function handleSubmit() {
    console.log("Handled in submit-data.js");
  }

  /**
   * @function populateDepartmentDropdown
   * @description
   * Populates the department dropdown with data from the irradiance.json file.
   * Handles asynchronous fetch and dynamic option population.
   */
  async function populateDepartmentDropdown() {
    try {
      const response = await fetch("data/irradiance.json");
      const data = await response.json();
      Object.keys(data).forEach(dept => {
        const option = document.createElement("option");
        option.value = dept;
        option.textContent = dept;
        departmentDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  }

  // STEP: Load departments dropdown on initial load
  populateDepartmentDropdown();
});
