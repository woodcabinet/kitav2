import { cn, CATEGORY_LABELS, CATEGORY_COLORS } from '../../lib/utils'

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-[#D94545] text-white',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    outline: 'border border-gray-300 text-gray-600',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

export function CategoryBadge({ category, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', CATEGORY_COLORS[category], className)}>
      {CATEGORY_LABELS[category] ?? category}
    </span>
  )
}

export function PlatformBadge({ platform }) {
  const config = {
    instagram: { label: 'Instagram', bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-white' },
    tiktok: { label: 'TikTok', bg: 'bg-black', text: 'text-white' },
    website: { label: 'Website', bg: 'bg-blue-600', text: 'text-white' },
  }
  const c = config[platform] ?? { label: platform, bg: 'bg-gray-200', text: 'text-gray-700' }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', c.bg, c.text)}>
      {c.label}
    </span>
  )
}
