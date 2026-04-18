import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Zap } from 'lucide-react'
import { cn, formatCurrency, formatCountdown } from '../../lib/utils'
import { Avatar } from '../shared/Avatar'

export function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false)
  const isDropItem = !!product.drop_at
  const isOutOfStock = product.stock === 0 && !product.unlimited_stock && !isDropItem

  return (
    <div className="paper-card rounded-2xl overflow-hidden hover:shadow-warm-lg transition-shadow group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={40} />
            </div>
        }
        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(w => !w)}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-[#8B7355]'} />
        </button>
        {/* Drop badge */}
        {isDropItem && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-accent text-white rounded-full px-2 py-0.5">
            <Zap size={10} />
            <span className="text-[10px] font-bold">DROP</span>
          </div>
        )}
        {/* Out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 bg-white rounded-full px-3 py-1 shadow">Sold Out</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <Link to={`/brand/${product.brand?.slug}`} className="flex items-center gap-1.5 mb-1.5">
          <Avatar src={product.brand?.logo_url} name={product.brand?.name} size="xs" />
          <span className="text-xs text-[#8B7355]">{product.brand?.name}</span>
        </Link>

        <p className="font-semibold text-sm text-ink line-clamp-2 mb-2">{product.name}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-ink">{formatCurrency(product.price)}</span>
            {product.compare_price && (
              <span className="text-xs text-[#8B7355] line-through">{formatCurrency(product.compare_price)}</span>
            )}
          </div>
          {!isOutOfStock && (
            <button className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center hover:bg-[#a85225] transition-colors">
              <ShoppingBag size={14} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
