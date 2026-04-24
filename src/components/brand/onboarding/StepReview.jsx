// Step 2 — post-scrape review. The scraper's results are loaded into the
// card verbatim; every field is editable so mistakes in the auto-fill
// don't block the user. ProductRow + StatPill are only used here, so
// they stay co-located.
//
// Note: ImageUploader (shared component) handles logo/banner/product
// image upload + drag-drop + URL paste — we never reach into the
// storage layer directly from this step.

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, RefreshCw, Package, Trash2, Plus, Edit2, AlertCircle } from 'lucide-react'
import { CATEGORY_LABELS } from '../../../lib/utils'
import { ImageUploader } from '../../shared/ImageUploader'

export function StepReview({ scraped, onField, onProduct, onRemoveProduct, onAddProduct, onBack, onLive, saving }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <CheckCircle size={22} className="text-green-600" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1A1513] leading-tight">Found your brand.</h2>
          <p className="font-hand text-lg text-[#D94545]">edit anything, nothing is locked</p>
        </div>
      </div>

      {/* Preview card */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#E8DDCB] mb-4 bg-white">
        {scraped.banner_url ? (
          <img src={scraped.banner_url} alt="" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-[#C4B49A] to-[#E8DDCB]" />
        )}
        <div className="p-4 flex items-center gap-3">
          {scraped.logo_url && (
            <img src={scraped.logo_url} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-warm -mt-12 bg-white" referrerPolicy="no-referrer" />
          )}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={scraped.name ?? ''}
              onChange={e => onField('name', e.target.value)}
              className="w-full font-display font-bold text-[#1A1513] text-lg outline-none border-b border-transparent hover:border-[#E8DDCB] focus:border-[#D94545] bg-transparent"
            />
            <input
              type="text"
              value={scraped.tagline ?? ''}
              onChange={e => onField('tagline', e.target.value)}
              placeholder="Add a tagline"
              className="w-full text-sm text-gray-500 outline-none border-b border-transparent hover:border-[#E8DDCB] focus:border-[#D94545] bg-transparent mt-1"
            />
          </div>
        </div>
      </div>

      {/* Image editors with upload + drag-drop + URL fallback */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="col-span-1">
          <ImageUploader
            value={scraped.logo_url}
            onChange={v => onField('logo_url', v)}
            folder="logos"
            aspect="square"
            label="Logo"
          />
        </div>
        <div className="col-span-2">
          <ImageUploader
            value={scraped.banner_url}
            onChange={v => onField('banner_url', v)}
            folder="banners"
            aspect="banner"
            label="Banner"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatPill value={scraped.products?.length ?? 0} label="Products" />
        <StatPill value={scraped.gallery?.length ?? 0} label="Images" />
      </div>

      {/* Products */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Package size={14} className="text-[#D94545]" />
            <p className="text-sm font-semibold text-[#1A1513]">Products</p>
            {scraped.product_strategy && scraped.product_strategy !== 'none' && (
              <span className="text-[10px] text-gray-400 ml-1 font-hand text-sm">via {scraped.product_strategy}</span>
            )}
          </div>
          <button onClick={onAddProduct} className="text-xs text-[#D94545] font-semibold flex items-center gap-1 hover:bg-[#D94545]/5 px-2 py-1 rounded-lg">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {(scraped.products ?? []).map((p, i) => (
            <ProductRow key={p.id ?? i} product={p} idx={i} onChange={onProduct} onRemove={onRemoveProduct} />
          ))}
          {!scraped.products?.length && (
            <div className="text-center py-6 bg-[#FAF6EE] rounded-2xl border border-[#E8DDCB]">
              <p className="font-hand text-lg text-gray-500">no products found — add after going live</p>
            </div>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="mb-4 p-3 bg-[#FAF6EE] border border-[#E8DDCB] rounded-2xl flex items-center justify-between">
        <span className="text-sm text-gray-600">Category</span>
        <select
          value={scraped.suggested_category ?? 'lifestyle'}
          onChange={e => onField('suggested_category', e.target.value)}
          className="text-sm font-semibold text-[#1A1513] bg-transparent outline-none cursor-pointer"
        >
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {scraped.warnings?.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-2xl space-y-1">
          {scraped.warnings.map(w => (
            <p key={w} className="text-xs text-yellow-700 flex items-start gap-1.5">
              <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />{w}
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onBack}
          disabled={saving}
          className="px-5 py-4 border-2 border-[#E8DDCB] text-gray-600 font-semibold rounded-2xl hover:bg-white disabled:opacity-50"
        >
          ← Back
        </button>
        <motion.button
          whileHover={{ scale: saving ? 1 : 1.01 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
          onClick={onLive}
          disabled={saving}
          className="flex-1 bg-[#D94545] hover:bg-[#a85225] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-warm transition-colors"
        >
          {saving ? (
            <><RefreshCw size={18} className="animate-spin" /> Saving your brand...</>
          ) : (
            <>Looks good, go live <ArrowRight size={18} /></>
          )}
        </motion.button>
      </div>
    </div>
  )
}

// Small numeric badge — also used by StepLive, so exported.
export function StatPill({ value, label }) {
  return (
    <div className="bg-[#FAF6EE] border border-[#E8DDCB] rounded-2xl p-3 text-center">
      <p className="font-display font-bold text-[#D94545] text-lg">{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
  )
}

// Collapsible per-product row. Click the pencil to expand into an
// image-uploader + description textarea; click trash to remove.
function ProductRow({ product, idx, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const primaryImage = product.images?.[0]

  function setPrimaryImage(url) {
    const rest = (product.images ?? []).slice(1)
    onChange(idx, 'images', url ? [url, ...rest] : rest)
  }

  return (
    <div className="border-2 border-[#E8DDCB] rounded-2xl overflow-hidden bg-white">
      <div className="flex items-center gap-2 p-2">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package size={16} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={product.name ?? ''}
            onChange={e => onChange(idx, 'name', e.target.value)}
            className="w-full text-sm font-semibold text-[#1A1513] bg-transparent outline-none truncate"
          />
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-gray-400">$</span>
            <input
              type="number"
              step="0.01"
              value={product.price ?? 0}
              onChange={e => onChange(idx, 'price', parseFloat(e.target.value) || 0)}
              className="w-16 text-xs text-gray-600 bg-transparent outline-none"
            />
            <span className="text-xs text-gray-300">·</span>
            <input
              type="number"
              value={product.stock ?? 0}
              onChange={e => onChange(idx, 'stock', parseInt(e.target.value) || 0)}
              className="w-12 text-xs text-gray-600 bg-transparent outline-none"
            />
            <span className="text-xs text-gray-400">stock</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${expanded ? 'bg-[#D94545]/10 text-[#D94545]' : 'hover:bg-gray-100 text-gray-400'}`}
          title="Edit details"
        >
          <Edit2 size={12} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500"
          title="Remove"
        >
          <Trash2 size={12} />
        </button>
      </div>
      {expanded && (
        <div className="border-t border-[#E8DDCB] p-3 space-y-2 bg-[#FAF6EE]">
          <div className="flex gap-2">
            <div className="w-20 flex-shrink-0">
              <ImageUploader
                value={primaryImage}
                onChange={setPrimaryImage}
                folder={`products/${product.id ?? idx}`}
                aspect="square"
                size="sm"
              />
            </div>
            <div className="flex-1">
              <textarea
                value={product.description ?? ''}
                onChange={e => onChange(idx, 'description', e.target.value)}
                placeholder="Description"
                rows={4}
                className="w-full h-full px-2 py-1.5 text-xs border border-[#E8DDCB] rounded-lg bg-white outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
