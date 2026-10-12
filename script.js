document.addEventListener('DOMContentLoaded', () => {
  const cartStorageKey = 'juju-jewls-cart';
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const getCart = () => {
    const savedCart = localStorage.getItem(cartStorageKey);
    if (savedCart === null) {
      return [];
    }

    const cart = JSON.parse(savedCart);
    if (!Array.isArray(cart) || cart.some((item) =>
      !item ||
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      !Number.isFinite(item.price) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    )) {
      throw new Error('Saved cart data is invalid.');
    }
    return cart;
  };

  const cartStatus = document.getElementById('cart-status');
  let cartStatusTimeout;
  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      try {
        const cart = getCart();
        const product = {
          id: button.dataset.productId,
          name: button.dataset.productName,
          price: Number(button.dataset.productPrice),
        };
        if (!product.id || !product.name || !Number.isFinite(product.price) || product.price < 0) {
          throw new Error('Product details are invalid.');
        }
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        if (cartStatus) {
          const statusMessage = `${product.name} added to your cart.`;
          cartStatus.textContent = statusMessage;
          clearTimeout(cartStatusTimeout);
          cartStatusTimeout = setTimeout(() => {
            if (cartStatus.textContent === statusMessage) {
              cartStatus.textContent = '';
            }
          }, 3000);
        }
      } catch (error) {
        console.error('Unable to update the cart.', error);
        if (cartStatus) {
          clearTimeout(cartStatusTimeout);
          cartStatusTimeout = undefined;
          cartStatus.textContent = 'Unable to update your cart. Please try again.';
        }
      }
    });
  });

  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartTotal = document.getElementById('cart-total');
  if (cartItems && cartEmpty && cartTotal) {
    const renderCart = () => {
      try {
        const cart = getCart();
        cartItems.replaceChildren();
        cartEmpty.hidden = cart.length > 0;

        let total = 0;
        cart.forEach((item) => {
          total += item.price * item.quantity;
          const row = document.createElement('article');
          row.className = 'cart-item';

          const details = document.createElement('div');
          const name = document.createElement('h2');
          name.textContent = item.name;
          const quantity = document.createElement('p');
          quantity.textContent = `Quantity: ${item.quantity}`;
          const price = document.createElement('p');
          price.textContent = `$${item.price.toFixed(2)} each`;
          details.append(name, quantity, price);

          const removeButton = document.createElement('button');
          removeButton.type = 'button';
          removeButton.className = 'remove-from-cart';
          removeButton.textContent = 'Remove';
          removeButton.addEventListener('click', () => {
            try {
              const updatedCart = getCart().filter((cartItem) => cartItem.id !== item.id);
              localStorage.setItem(cartStorageKey, JSON.stringify(updatedCart));
              renderCart();
            } catch (error) {
              console.error('Unable to remove item from cart.', error);
              cartStatus.textContent = 'Unable to update your cart. Please try again.';
            }
          });

          row.append(details, removeButton);
          cartItems.append(row);
        });
        cartTotal.textContent = cart.length > 0 ? `Total: $${total.toFixed(2)}` : '';
      } catch (error) {
        console.error('Unable to load the cart.', error);
        cartStatus.textContent = 'Unable to load your cart. Please try again later.';
      }
    };

    renderCart();
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
      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '');
      const email = String(formData.get('email') || '');
      const message = String(formData.get('message') || '');
      const composeUrl = new URL('https://mail.google.com/mail/');
      composeUrl.search = new URLSearchParams({
        view: 'cm',
        fs: '1',
        to: 'ratnanibayla@gmail.com',
        su: "New message from Juju's Jewls website",
        body: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }).toString();

      const gmailWindow = window.open(composeUrl.toString(), '_blank');
      if (gmailWindow) {
        gmailWindow.opener = null;
      }

      if (status) {
        const fallbackLink = document.createElement('a');
        fallbackLink.href = composeUrl.toString();
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener';
        fallbackLink.textContent = 'Open Gmail compose';
        status.replaceChildren(
          document.createTextNode('Review and send the pre-filled message in Gmail. Unsent messages are saved as drafts. '),
          fallbackLink,
        );
      }
    });
  }
});
