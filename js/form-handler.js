// form-handler.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("solarForm");
  const steps = Array.from(document.querySelectorAll(".form-step"));
  const nextBtns = document.querySelectorAll(".next-btn");
  const prevBtns = document.querySelectorAll(".prev-btn");
  const resultsSection = document.getElementById("resultsSection");
  const departmentDropdown = document.getElementById("departmentDropdown");

  let currentStep = 0;

  // Show only the current step
  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.style.display = index === stepIndex ? "flex" : "none";
    });
  }

  showStep(currentStep); // Initial step

  // Next button click
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  // Previous button click
  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      currentStep--;
      showStep(currentStep);
    });
  });

  // Form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateStep(currentStep)) {
      handleSubmit();
    }
  });

  // Validate required fields in current step
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

  // This will be overwritten by submit-data.js
  function handleSubmit() {
    console.log("Handled in submit-data.js");
  }

  // Load departments into dropdown
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

  populateDepartmentDropdown();
});
