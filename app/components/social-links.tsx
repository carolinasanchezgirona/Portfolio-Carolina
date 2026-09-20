type SocialLinksProps = {
  className?: string;
  compact?: boolean;
};

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true,
  focusable: false,
} as const;

const InstagramIcon = () => (
  <svg {...iconProps} className="social-link-icon">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="4.25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg {...iconProps} className="social-link-icon">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="9" r="1.2" fill="currentColor" stroke="none" />
    <path
      d="M7 11.2v6M11 17.2v-6h3.1c2 0 3.4 1.2 3.4 3.8v2.2M11 13.8c.7-1.7 1.8-2.6 3.3-2.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
