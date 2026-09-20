type SocialLinksProps = {
  className?: string;
  compact?: boolean;
};

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.25" />
    <circle cx="17.4" cy="6.7" r="1" className="social-icon-dot" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <circle cx="8" cy="9" r="1.2" className="social-icon-fill" />
    <path d="M7 11.2v6M11 17.2v-6h3.1c2 0 3.4 1.2 3.4 3.8v2.2M11 13.8c.7-1.7 1.8-2.6 3.3-2.6" />
  </svg>
);

export default function SocialLinks({ className = "", compact = false }: SocialLinksProps) {
  const classes = ["social-links", compact ? "social-links-compact" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} aria-label="Redes profesionales">
      <a
        href="https://www.instagram.com/carolinasanchez.psicologia/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram de Carolina Sánchez | Psicóloga"
      >
        <InstagramIcon />
        <span>Instagram</span>
      </a>
      <a
        href="https://www.linkedin.com/in/carolina-s%C3%A1nchez-girona-43b3b94a/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn de Carolina Sánchez Girona"
      >
        <LinkedInIcon />
        <span>LinkedIn</span>
      </a>
    </div>
  );
}
