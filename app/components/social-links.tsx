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
    <div className={classes} aria-label="Redes y contacto profesional">
      <a
        href="https://www.instagram.com/carolina_tupsicologa/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram de Carolina Sánchez | Psicóloga"
      >
        <InstagramIcon />
        <span>Instagram</span>
      </a>
      <a
        href="https://wa.me/34604974857?text=Hola%2C%20quisiera%20consultar%20disponibilidad%20para%20una%20cita."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp, abre una aplicación externa"
      >
        <svg {...iconProps} className="social-link-icon" aria-hidden="true">
          <path d="M20.3 11.5a8.3 8.3 0 0 1-12.2 7.3L3.5 20l1.3-4.4A8.3 8.3 0 1 1 20.3 11.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M8.7 8.3c.3-.3.6-.2.8.1l.8 1.2c.2.3.2.5 0 .8l-.5.6a6 6 0 0 0 2.9 2.8l.6-.5c.3-.2.5-.2.8 0l1.2.8c.3.2.4.6.1.9-.5.7-1.4 1.1-2.2.9a8.8 8.8 0 0 1-5.3-5.3c-.2-.9.1-1.8.8-2.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
        <span>WhatsApp</span>
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
