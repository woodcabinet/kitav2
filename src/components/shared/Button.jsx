// Shared button — Material Design 3 pill style, KitaKakis palette.
//
// Shape: rounded-full on every variant so text always sits centred with
// generous breathing room. Fixed min-height per size means the button
// never shrinks around its label — no more text kissing the edge.
//
// Variants:
//   filled   — accent bg, white text. The primary CTA.
//   tonal    — soft accent tint bg, accent text. Secondary CTA (M3 tonal).
//   outline  — transparent bg, accent border + text. Tertiary action.
//   ghost    — no bg/border, muted ink. For low-priority inline actions.
//   elevated — paper-card bg + shadow. Floating surface buttons.
//   danger   — red, for destructive actions only.
//
// Sizes produce a stable height so icon-only and text buttons align in rows.

import { cn } from '../../lib/utils'

const VARIANTS = {
  filled:   'bg-accent hover:bg-accent-dark text-white shadow-warm',
  tonal:    'bg-accent/12 hover:bg-accent/20 text-accent',
  outline:  'border-2 border-accent text-accent bg-transparent hover:bg-accent/8',
  ghost:    'text-[#6B5744] hover:bg-[#F0E7D5] hover:text-ink',
  elevated: 'bg-white text-ink border border-[#E8DDC8] shadow-warm hover:shadow-warm-lg hover:bg-[#FAF6EE]',
  danger:   'bg-red-500 hover:bg-red-600 text-white shadow-warm',
}

// px is wide so text never touches the pill edge.
// py + min-h together lock the height independent of content.
const SIZES = {
  xs: 'h-7  px-4   text-[11px] font-semibold gap-1   [&_svg]:w-3   [&_svg]:h-3',
  sm: 'h-9  px-5   text-xs     font-semibold gap-1.5 [&_svg]:w-3.5 [&_svg]:h-3.5',
  md: 'h-10 px-6   text-[13px] font-semibold gap-1.5 [&_svg]:w-4   [&_svg]:h-4',
  lg: 'h-11 px-7   text-sm     font-semibold gap-2   [&_svg]:w-4   [&_svg]:h-4',
  xl: 'h-12 px-8   text-[15px] font-semibold gap-2   [&_svg]:w-5   [&_svg]:h-5',
}

export function Button({
  children,
  variant = 'filled',
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
        // Pill shape — the core of the M3 feel
        'inline-flex items-center justify-center rounded-full',
        // Interaction
        'transition-all duration-150 ease-out',
        'active:scale-[0.96] hover:-translate-y-px',
        // Disabled
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'disabled:hover:translate-y-0 disabled:active:scale-100',
        // Focus ring
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-accent/40 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[#FAF6EE]',
        VARIANTS[variant] ?? VARIANTS.filled,
        SIZES[size] ?? SIZES.md,
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : Icon ? (
        <Icon strokeWidth={2} />
      ) : null}
      {children}
      {!loading && IconRight ? <IconRight strokeWidth={2} /> : null}
    </button>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
