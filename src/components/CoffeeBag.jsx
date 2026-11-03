export function CoffeeBag({ product, compact = false }) {
  return (
    <div
      className={`coffee-bag coffee-bag--${product.tone}${compact ? " coffee-bag--compact" : ""}`}
      role="img"
      aria-label={`${product.name}, ${product.packageLabel} of whole-bean Burundian coffee`}
    >
      <span className="coffee-bag__seal">Freshly roasted · Burundi</span>
      <div className="coffee-bag__label">
        <span className="coffee-bag__brand">
          muco<span>•</span>
        </span>
        <span className="coffee-bag__rule" />
        <span className="coffee-bag__origin">
          BURUNDI · {product.region.split("·")[0].trim()}
        </span>
        <strong>{product.name}</strong>
        <span className="coffee-bag__coffee-type">
          SPECIALTY WHOLE BEAN COFFEE
        </span>
        <span className="coffee-bag__notes">{product.tastingNotes}</span>
        <span className="coffee-bag__weight">{product.packageLabel}</span>
      </div>
      <span className="coffee-bag__valve" aria-hidden="true" />
      <span className="coffee-bag__bottom-seam" aria-hidden="true" />
    </div>
  );
}
