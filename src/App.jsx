import { useEffect, useMemo, useState } from "react";
import { products } from "./data/products";
import { AnnouncementBar, Header, Footer } from "./components/StoreChrome";
import { ProductCard } from "./components/ProductCard";
import { CartDrawer } from "./components/CartDrawer";
import { ContactForm } from "./components/ContactForm";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutNotice, setCheckoutNotice] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("checkout");
    if (result === "cancel") {
      return {
        type: "cancelled",
        message:
          "Your checkout was cancelled. Your coffee is still here when you’re ready.",
      };
    }
    if (result === "success") {
      return params.has("session_id")
        ? { type: "checking", message: "Confirming your payment…" }
        : {
            type: "error",
            message:
              "We couldn’t verify the checkout. If your card was charged, please contact us.",
          };
    }
    return null;
  });
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    const result = url.searchParams.get("checkout");
    if (result === "cancel") {
      url.searchParams.delete("checkout");
      window.history.replaceState({}, "", url);
      return;
    }
    if (result !== "success") return;

    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) return;

    let active = true;
    fetch(`/api/checkout-session/${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Payment verification failed.");
        return data;
      })
      .then((session) => {
        if (!active) return;
        if (
          session.paymentStatus === "paid" ||
          session.paymentStatus === "no_payment_required"
        ) {
          setCheckoutNotice({
            type: "success",
            message:
              "Thank you! Your payment is confirmed. We’re getting your coffee ready.",
          });
          setCart([]);
          setCheckoutError("");
        } else {
          setCheckoutNotice({
            type: "error",
            message:
              "The checkout is not marked as paid yet. If you completed payment, please contact us.",
          });
        }
      })
      .catch((error) => {
        if (active)
          setCheckoutNotice({ type: "error", message: error.message });
      })
      .finally(() => {
        if (!active) return;
        url.searchParams.delete("checkout");
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", url);
      });

    return () => {
      active = false;
    };
  }, []);

  function addToCart(product) {
    setCheckoutError("");
    setCart((items) => {
      const current = items.find((item) => item.id === product.id);
      return current
        ? items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...items, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(productId, amount) {
    setCart((items) =>
      items
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(10, item.quantity + amount) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  async function checkout() {
    setCheckoutError("");
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ id, quantity }) => ({ id, quantity })),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Checkout could not be started.");
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(
        error.message || "Checkout could not be started. Please try again.",
      );
    }
  }

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      {checkoutNotice && (
        <div
          className={`checkout-notice checkout-notice--${checkoutNotice.type}`}
          role={checkoutNotice.type === "error" ? "alert" : "status"}
        >
          <span>{checkoutNotice.message}</span>
          {checkoutNotice.type !== "checking" && (
            <button
              type="button"
              onClick={() => setCheckoutNotice(null)}
              aria-label="Dismiss checkout message"
            >
              ×
            </button>
          )}
        </div>
      )}
      <main>
        <section className="hero" id="home">
          <div className="hero__content">
            <p className="eyebrow eyebrow--light">A little taste of Burundi</p>
            <h1>
              Good mornings
              <br />
              start <em>somewhere</em>.
            </h1>
            <p className="hero__copy">
              Meet the bright, beautiful coffees grown high in the hills of
              Burundi. Naturally sweet, always full of life.
            </p>
            <a className="button button--cream" href="#shop">
              Shop the harvest <span aria-hidden="true">↗</span>
            </a>
            <div className="hero__note">
              <span className="hero__note-mark">✳</span>
              <span>
                Grown with care
                <br />
                shared with joy
              </span>
            </div>
          </div>
          <div className="hero__caption">
            <span>02° 54' S — 29° 52' E</span>
            <span>Kayanza, Burundi</span>
          </div>
        </section>
        <section className="intro section-wrap">
          <p className="eyebrow">A brighter kind of coffee</p>
          <h2>
            From the hills of Burundi
            <br />
            to your <em>happy place.</em>
          </h2>
          <p className="intro__copy">
            We work with smallholder farmers in Burundi’s northern highlands to
            bring you thoughtfully sourced coffee with a story worth sharing.
          </p>
          <div className="intro__facts">
            <div>
              <strong>1,700m+</strong>
              <span>High altitude grown</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Specialty arabica</span>
            </div>
            <div>
              <strong>One good cup</strong>
              <span>At a time</span>
            </div>
          </div>
        </section>
        <section className="shop section-wrap" id="shop">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The good stuff</p>
              <h2>
                Find your <em>favorite.</em>
              </h2>
            </div>
            <p>
              Whole-bean coffee in sealed 250g bags, plus a three-bag tasting
              set for exploring Burundi’s different origins.
            </p>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </div>
        </section>
        <section className="story" id="story">
          <div
            className="story__image"
            role="img"
            aria-label="Coffee cherries growing on a coffee tree"
          />
          <div className="story__content">
            <p className="eyebrow eyebrow--light">Rooted in good things</p>
            <h2>
              Better coffee.
              <br />
              <em>Brighter futures.</em>
            </h2>
            <p>
              Burundi’s coffee is grown by people who know every hillside, every
              harvest, and every cherry. We’re here to make sure that care
              reaches your cup—and comes back around to the communities that
              make it possible.
            </p>
            <a className="text-link text-link--light" href="#shop">
              Meet your next favorite <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
        <section className="newsletter section-wrap">
          <div>
            <p className="eyebrow">A note from the hills</p>
            <h2>
              Good things, <em>occasionally.</em>
            </h2>
          </div>
          <p>
            Stories, brewing tips, and first dibs on the freshest roasts. No
            noise, just the good stuff.
          </p>
          <a
            className="button button--dark"
            href="mailto:hello@muco.coffee?subject=Keep%20me%20in%20the%20loop"
          >
            Keep me in the loop <span aria-hidden="true">↗</span>
          </a>
        </section>
        <ContactForm />
      </main>
      <Footer />
      <CartDrawer
        cart={cart}
        open={cartOpen}
        subtotal={subtotal}
        checkoutError={checkoutError}
        onClose={() => setCartOpen(false)}
        onChangeQuantity={changeQuantity}
        onCheckout={checkout}
      />
    </>
  );
}

export default App;
