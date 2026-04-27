// Shared button — designed to feel hand-crafted: warm shadow on primary,
// gentle press scale, optional leading icon. Variants share the same
// rounded-2xl shape so a row of mixed buttons reads as one family.
//
// Variants:
//   primary  — accent red, warm shadow, white text. The "go" button.
//   secondary— ink, white text. Used for "less hot" CTAs.
//   outline  — accent border, hover-fills accent. Soft secondary action.
//   ghost    — invisible at rest, paper-cream on hover. For inline links.
//   white    — paper card on tan border, for floating-on-banner placements.
//   danger   — red red, for destructive actions only.
//
// Sizes follow Tailwind's vertical rhythm so they slot beside inputs cleanly.
//
// Pass `icon` to render a Lucide icon at the start (sized to match label).
// `loading` swaps in a spinner and disables the button.

import { cn } from '../../lib/utils'

const VARIANTS = {
  primary:   'bg-accent hover:bg-accent-dark text-white shadow-warm',
  secondary: 'bg-ink hover:bg-[#2a1f1c] text-white shadow-warm',
  outline:   'border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white',
  ghost:     'text-[#6B5744] hover:bg-[#F0E7D5]',
  white:     'bg-white text-ink border border-[#E8DDC8] hover:bg-[#FAF6EE] shadow-sm',
  danger:    'bg-red-500 hover:bg-red-600 text-white shadow-warm',
}

const SIZES = {
  xs: 'px-2.5 py-1   text-xs   gap-1     [&_svg]:w-3   [&_svg]:h-3',
  sm: 'px-3   py-1.5 text-sm   gap-1.5   [&_svg]:w-3.5 [&_svg]:h-3.5',
  md: 'px-4   py-2.5 text-sm   gap-1.5   [&_svg]:w-4   [&_svg]:h-4',
  lg: 'px-6   py-3   text-base gap-2     [&_svg]:w-5   [&_svg]:h-5',
  xl: 'px-7   py-3.5 text-base gap-2     [&_svg]:w-5   [&_svg]:h-5',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className,
  disabled,
  loading,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl font-semibold',
        'transition-all duration-150 ease-out',
        'active:scale-[0.97] hover:-translate-y-px',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6EE]',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : Icon ? (
        <Icon strokeWidth={2.2} />
      ) : null}
      {children}
      {!loading && IconRight ? <IconRight strokeWidth={2.2} /> : null}
    </button>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
