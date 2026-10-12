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
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const status = document.getElementById('contact-status');
      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (!(submitButton instanceof HTMLButtonElement)) {
        throw new Error('Contact form submit button was not found.');
      }

      if (window.location.protocol === 'file:') {
        if (status) {
          status.textContent = 'This form cannot send from a local HTML file. Open the published website or serve this page over HTTP and try again.';
        }
        return;
      }

      submitButton.disabled = true;
      if (status) {
        status.textContent = 'Sending your message…';
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://formsubmit.co/ajax/ratnanibayla@gmail.com', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData.entries())),
        });
        const result = await response.json();

        if (!response.ok || (result.success !== true && result.success !== 'true')) {
          throw new Error(result.message || 'The form service could not send your message.');
        }

        if (status) {
          status.textContent = 'Your message has been sent. Thank you for getting in touch!';
        }
        contactForm.reset();
      } catch (error) {
        console.error('Contact form submission failed:', error);
        if (status) {
          status.textContent = error instanceof Error
            ? `Unable to send your message: ${error.message}`
            : 'Unable to send your message. Please try again later.';
        }
      } finally {
        submitButton.disabled = false;
      }
    });
  }
});
