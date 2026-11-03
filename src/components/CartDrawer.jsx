import { CoffeeBag } from "./CoffeeBag";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CartDrawer({
  cart,
  open,
  subtotal,
  checkoutError,
  onClose,
  onChangeQuantity,
  onCheckout,
}) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div
      className={`cart-layer${open ? " cart-layer--open" : ""}`}
      aria-hidden={!open}
    >
      <button
        className="cart-backdrop"
        type="button"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        aria-label="Close shopping bag"
      />
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="cart-drawer__head">
          <div>
            <p className="eyebrow">Your good things</p>
            <h2>
              Your bag <span>({count})</span>
            </h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close bag"
          >
            <CloseIcon />
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <span aria-hidden="true">☕</span>
            <h3>Nothing brewing yet.</h3>
            <p>Your next favorite cup is just a little scroll away.</p>
            <button
              className="button button--dark"
              type="button"
              onClick={onClose}
            >
              Explore the coffee
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <CoffeeBag product={item} compact />
                  <div className="cart-item__info">
                    <p className="product-region">{item.region}</p>
                    <h3>{item.name}</h3>
                    <p>
                      ${item.price} · {item.weight}
                    </p>
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => onChangeQuantity(item.id, -1)}
                        aria-label={`Remove one ${item.name}`}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onChangeQuantity(item.id, 1)}
                        aria-label={`Add one ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <strong>${item.price * item.quantity}</strong>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <p>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </p>
              <span className="cart-shipping-note">
                Shipping and taxes calculated at checkout.
              </span>
              {checkoutError && (
                <p className="checkout-error" role="alert">
                  {checkoutError}
                </p>
              )}
              <button
                className="button button--dark checkout-button"
                type="button"
                onClick={onCheckout}
              >
                Continue to secure checkout <span aria-hidden="true">↗</span>
              </button>
              <p className="secure-note">Secure checkout powered by Stripe</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
