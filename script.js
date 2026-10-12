document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = document.getElementById('message');
      if (message) {
        message.textContent = 'Thank you for your interest! Email collection requires a connected newsletter service.';
      }
      form.reset();
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = document.getElementById('contact-status');
      if (status) {
        status.textContent = 'Thank you — we will be in touch soon.';
      }
      contactForm.reset();
    });
  }
});
