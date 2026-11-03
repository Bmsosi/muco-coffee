import { SocialLinks } from "./SocialLinks";

const currentYear = new Date().getFullYear();

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export function AnnouncementBar() {
  return (
    <div className="announcement">
      A little sunshine, delivered <span aria-hidden="true">✳</span>
      International shipping available
    </div>
  );
}

export function Header({ cartCount, onCartClick }) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Muco Coffee home">
        muco<span>•</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#shop">Shop coffee</a>
        <a href="#story">Our story</a>
        <a href="#contact">Say hello</a>
      </nav>
      <button
        className="cart-trigger"
        type="button"
        onClick={onCartClick}
        aria-label={`Open shopping bag, ${cartCount} items`}
      >
        <BagIcon />
        <span>Bag</span>
        <span className="cart-count">{cartCount}</span>
      </button>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <a className="wordmark wordmark--footer" href="#home">
        muco<span>•</span>
      </a>
      <p>Good coffee, from Local Burundian Farmers with love.</p>
      <SocialLinks />
      <div className="footer-links">
        <a href="#shop">Shop</a>
        <a href="#contact">Contact</a>
        <span>© {currentYear} Muco Coffee</span>
      </div>
    </footer>
  );
}
