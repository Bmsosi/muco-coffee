import { useState } from "react";

const contactEmail = "hello@muco.coffee";

export function ContactForm() {
  const [notice, setNotice] = useState("");

  function submitContact(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").toString().trim();
    const email = formData.get("email").toString().trim();
    const orderNumber = formData.get("order-number").toString().trim();
    const message = formData.get("message").toString().trim();
    const subject = orderNumber
      ? `Muco Coffee question — order ${orderNumber}`
      : "A note for Muco Coffee";
    const body = [
      `Name: ${name}`,
      `Reply to: ${email}`,
      orderNumber ? `Order number: ${orderNumber}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    setNotice("Your email app should open with your message ready to send.");
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section className="contact-section section-wrap" id="contact">
      <div className="contact-copy">
        <p className="eyebrow">We’re happy to help</p>
        <h2>
          Let’s have a <em>little chat.</em>
        </h2>
        <p>
          Questions about your coffee or an order? Send us a note and we’ll get
          back to you soon.
        </p>
        <a href={`mailto:${contactEmail}`} className="contact-email">
          {contactEmail}
        </a>
      </div>
      <form className="contact-form" onSubmit={submitContact}>
        <div className="contact-form__row">
          <label>
            Name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
        </div>
        <label>
          Order number <span>(optional)</span>
          <input name="order-number" maxLength={80} />
        </label>
        <label>
          How can we help?
          <textarea name="message" rows="4" required maxLength={3000} />
        </label>
        <div className="contact-form__footer">
          <button className="button button--dark" type="submit">
            Prepare your message <span aria-hidden="true">↗</span>
          </button>
          <p>Opens your email app so you can send it.</p>
        </div>
        {notice && (
          <p className="contact-form__notice" role="status">
            {notice}
          </p>
        )}
      </form>
    </section>
  );
}
