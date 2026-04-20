import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, isPast, isFuture } from 'date-fns'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDate(date, fmt = 'MMM d, yyyy') {
  return format(new Date(date), fmt)
}

export function formatCountdown(targetDate) {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target - now

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, live: true }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, live: false }
}

export function formatCurrency(amount, currency = 'SGD') {
  return new Intl.NumberFormat('en-SG', { style: 'currency', currency }).format(amount)
}

export function formatNumber(n) {
  // Honesty principle: null/undefined means "not verified yet" — show an
  // em-dash rather than fabricating a zero. Callers that want to hide the
  // stat entirely should check `n == null` first.
  if (n == null) return '—'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const CATEGORY_LABELS = {
  fashion: 'Fashion',
  food_beverage: 'Food & Drink',
  beauty: 'Beauty',
  lifestyle: 'Lifestyle',
  arts_crafts: 'Arts & Crafts',
  wellness: 'Wellness',
  home_decor: 'Home',
  tech: 'Tech',
  sports: 'Sports',
  entertainment: 'Entertainment',
  other: 'Other',
}

export const CATEGORY_COLORS = {
  fashion: 'bg-pink-100 text-pink-700',
  food_beverage: 'bg-orange-100 text-orange-700',
  beauty: 'bg-purple-100 text-purple-700',
  lifestyle: 'bg-teal-100 text-teal-700',
  arts_crafts: 'bg-yellow-100 text-yellow-700',
  wellness: 'bg-green-100 text-green-700',
  home_decor: 'bg-blue-100 text-blue-700',
  tech: 'bg-indigo-100 text-indigo-700',
  sports: 'bg-red-100 text-red-700',
  entertainment: 'bg-rose-100 text-rose-700',
  other: 'bg-gray-100 text-gray-700',
}

export const PLATFORM_COLORS = {
  instagram: 'from-purple-500 to-pink-500',
  tiktok: 'from-black to-gray-800',
  website: 'from-blue-500 to-blue-700',
  shopee: 'from-orange-500 to-red-500',
  lazada: 'from-blue-400 to-purple-500',
}

// Brand colors — use in all components
export const COLORS = {
  dark: '#1A1513',      // text, headers
  accent: '#D94545',    // buttons, highlights, live events
  tan: '#C4B49A',       // backgrounds, subtle accents
  white: '#FFFFFF',
  gray: '#F5F5F5',      // surfaces
}

export const FIGMA_TOKENS = {
  'color/dark': '#1A1513',
  'color/accent': '#D94545',
  'color/tan': '#C4B49A',
  'color/text-primary': '#1A1513',
  'color/text-secondary': '#666666',
  'color/bg-primary': '#FFFFFF',
  'color/bg-secondary': '#C4B49A',
  'color/border': '#E0E0E0',
  'spacing/xs': '4px',
  'spacing/sm': '8px',
  'spacing/md': '16px',
  'spacing/lg': '24px',
  'spacing/xl': '32px',
}
