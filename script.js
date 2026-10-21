
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

// Responsive navigation
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";

  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation"
  );

  navLinks.classList.toggle("open", !isOpen);
});

// Close the mobile menu after choosing a section
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  });
});

// Reveal elements as they enter the viewport
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observerInstance.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Automatic footer year
document.querySelector("#year").textContent =
  new Date().getFullYear();


const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector("#visitor-name").value.trim();
  const email = document.querySelector("#visitor-email").value.trim();
  const message = document.querySelector("#visitor-message").value.trim();

  const submitButton = contactForm.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  formStatus.textContent = "Sending your enquiry...";

  try {
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to send enquiry.");
    }

    formStatus.textContent = result.message;
    contactForm.reset();
  } catch (error) {
    formStatus.textContent =
      "Could not send your enquiry. Please check the server and try again.";
    console.error(error);
  } finally {
    submitButton.disabled = false;
  }
});
