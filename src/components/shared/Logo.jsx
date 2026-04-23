// Kita wordmark + monogram.
//
// Replaces the old coffee-cup icon. The mark is two concentric arches inspired
// by Peranakan tile motifs and Singapore's shophouse five-foot-way arcades —
// a quiet nod to local craft without the literal shophouse cliché. Sits inside
// a warm-terracotta rounded square so it reads well next to avatars at
// small sizes.
//
// Usage:
//   <Logo />                      // icon + wordmark, default sm
//   <Logo variant="mark" />       // just the mark
//   <Logo variant="wordmark" />   // just the text
//   <Logo size="lg" />            // bigger
//
// Colours are Tailwind tokens via className so it theme-switches cleanly.

export function LogoMark({ className = '', size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Kita"
    >
      {/* Warm terracotta square backdrop */}
      <rect width="40" height="40" rx="11" fill="#C15E2E" />
      {/* Outer arch — echoes shophouse arcade */}
      <path
        d="M10 29V19a10 10 0 0 1 20 0v10"
        stroke="#FAF6EE"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Inner arch — smaller, nested */}
      <path
        d="M15.5 29v-7a4.5 4.5 0 0 1 9 0v7"
        stroke="#FAF6EE"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Keystone dot */}
      <circle cx="20" cy="13.5" r="1.6" fill="#FAF6EE" />
    </svg>
  )
}

export function Logo({ variant = 'full', size = 'sm', className = '' }) {
  const markSize = size === 'lg' ? 48 : size === 'md' ? 40 : 36
  const textSize =
    size === 'lg' ? 'text-2xl' :
    size === 'md' ? 'text-xl' :
    'text-lg'

  if (variant === 'mark') return <LogoMark size={markSize} className={className} />
  if (variant === 'wordmark')
    return (
      <span className={`font-display font-semibold tracking-tight text-ink ${textSize} ${className}`}>
        kita<span className="text-accent">kakis</span>
      </span>
    )

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={markSize} />
      <span className={`font-display font-semibold tracking-tight text-ink hidden sm:inline ${textSize}`}>
        kita<span className="text-accent">kakis</span>
      </span>
    </span>
  )
}
