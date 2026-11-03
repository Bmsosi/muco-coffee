import { CoffeeBag } from "./CoffeeBag";

export function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div
        className={`product-card__image product-card__image--${product.tone}`}
      >
        <CoffeeBag product={product} />
        <span className="product-badge">{product.badge}</span>
        <button
          className="quick-add"
          type="button"
          onClick={() => onAdd(product)}
          aria-label={`Add ${product.name} to bag`}
        >
          +
        </button>
      </div>
      <div className="product-card__details">
        <div>
          <p className="product-region">{product.region}</p>
          <h3>{product.name}</h3>
        </div>
        <span className="product-price">${product.price}</span>
      </div>
      <div className="product-card__bottom">
        <p>{product.tastingNotes}</p>
        <span>
          {product.weight} bag{product.weight === "250g" ? "" : "s"}
        </span>
      </div>
    </article>
  );
}
