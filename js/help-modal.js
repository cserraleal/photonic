/**
 * @file help-modal.js
 * @description
 * Handles the opening and closing of the help modal when users click on the question mark icons.
 * Loads the correct example invoice image for each step.
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
  const helpButtons = document.querySelectorAll(".help-icon");
  const helpModal = document.getElementById("helpModal");
  const helpModalImage = document.getElementById("helpModalImage");
  const helpModalClose = document.querySelector(".help-modal-close");

  // Map steps to images (update paths as needed)
  const helpImages = {
    1: "../images/factura.jpg",
    2: "../images/factura.jpg",
    3: "../images/factura.jpg"
  };

  // Open modal on icon click
  helpButtons.forEach(button => {
    button.addEventListener("click", () => {
      const step = button.getAttribute("data-step");
      if (helpImages[step]) {
        helpModalImage.src = helpImages[step];
        helpModal.style.display = "block";
      } else {
        console.warn("No image found for step:", step);
      }
    });
  });

  // Close modal on close button click
  helpModalClose.addEventListener("click", () => {
    helpModal.style.display = "none";
  });

  // Optional: Close modal when clicking outside the content box
  window.addEventListener("click", (event) => {
    if (event.target === helpModal) {
      helpModal.style.display = "none";
    }
  });
});
