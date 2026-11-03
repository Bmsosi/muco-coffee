const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/",
    icon: (
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V10H6.7v3h2.9v8h3.9Z" />
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6.5" r=".8" className="social-icon__fill" />
      </>
    ),
  },
  {
    name: "X",
    url: "https://x.com/",
    icon: (
      <path d="M18.9 3H22l-6.8 7.8L23.2 21h-6.3L12 14.7 6.5 21H3.4l7.3-8.4L2.8 3h6.5l4.5 5.9L18.9 3Zm-1.1 16h1.7L8.3 4.9H6.5L17.8 19Z" />
    ),
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/",
    icon: (
      <path d="M19.6 7.1a6.1 6.1 0 0 1-3.8-1.3v8.4a6.2 6.2 0 1 1-5.3-6.1v3.3a3 3 0 1 0 2.2 2.9V2.8h3.1c.2 2 1.7 3.8 3.8 4.1v.2Z" />
    ),
  },
];

export function SocialLinks() {
  return (
    <nav
      className="social-links"
      aria-label="Follow Muco Coffee on social media"
    >
      <span className="social-links__label">Follow along</span>
      <div className="social-links__icons">
        {socialLinks.map(({ name, url, icon }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Muco Coffee on ${name}`}
            title={name}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {icon}
            </svg>
          </a>
        ))}
      </div>
    </nav>
  );
}
