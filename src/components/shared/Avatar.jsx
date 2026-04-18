import { cn } from '../../lib/utils'

export function Avatar({ src, name, size = 'md', className }) {
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl', xl: 'w-20 h-20 text-2xl' }
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '?'

  return (
    <div className={cn('rounded-full overflow-hidden flex items-center justify-center bg-[#D94545] text-white font-semibold flex-shrink-0', sizes[size], className)}>
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : <span>{initials}</span>
      }
    </div>
  )
}
