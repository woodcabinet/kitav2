// Drop-in image picker for onboarding / dashboard.
//
// Behaviour:
//   • Signed-in user → uploads to Supabase Storage `brand-assets`,
//     returns the public URL via `onChange`.
//   • Anon / Supabase unconfigured → falls back to a URL input so
//     demo mode still works.
//   • Accepts drag-drop, click-to-pick, or paste-URL.
//
// Props:
//   value     – current image URL (string)
//   onChange  – called with the new URL
//   folder    – e.g. "logos", "banners", `products/${id}`
//   aspect    – 'square' | 'banner' | 'auto' (visual only)
//   label     – header label
//   size      – 'sm' | 'md' | 'lg'

import { useState, useRef } from 'react'
import { Upload, X, Link as LinkIcon, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { supabase, hasSupabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const MAX_BYTES = 10 * 1024 * 1024 // 10MB
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif'

export function ImageUploader({
  value,
  onChange,
  folder = 'misc',
  aspect = 'square',
  label,
  size = 'md',
  className = '',
}) {
  const { user } = useAuth()
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [showUrl, setShowUrl] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const canUpload = hasSupabase && !!user

  async function handleFile(file) {
    setError(null)
    if (!file) return
    if (!ACCEPT.includes(file.type)) {
      setError(`Unsupported file type. Use JPG, PNG, WebP, or GIF.`)
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`File too big — max 10MB.`)
      return
    }
    if (!canUpload) {
      setError(`Sign in to upload images — or paste a URL instead.`)
      setShowUrl(true)
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `${user.id}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('brand-assets')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('brand-assets').getPublicUrl(path)
      onChange?.(data.publicUrl)
    } catch (e) {
      setError(e.message ?? 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const aspectClass = {
    square: 'aspect-square',
    banner: 'aspect-[3/1]',
    auto: 'min-h-24',
  }[aspect] ?? 'aspect-square'

  const sizeClass = {
    sm: 'w-20',
    md: 'w-full',
    lg: 'w-full',
  }[size] ?? 'w-full'

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowUrl(u => !u)}
              className="text-[10px] text-gray-400 hover:text-[#D94545] flex items-center gap-0.5"
            >
              <LinkIcon size={10} /> URL
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange?.('')}
                className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"
              >
                <X size={10} /> Clear
              </button>
            )}
          </div>
        </div>
      )}

      <div
        onClick={() => !uploading && fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`${sizeClass} ${aspectClass} relative rounded-2xl border-2 ${dragOver ? 'border-[#D94545] bg-[#D94545]/5' : 'border-dashed border-[#E8DDCB] bg-white hover:border-[#D94545]/50'} cursor-pointer overflow-hidden transition-colors flex items-center justify-center`}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/90 rounded-full px-3 py-1.5 text-xs font-semibold text-[#1A1513] flex items-center gap-1.5">
                <Upload size={12} /> Replace
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-3 pointer-events-none">
            {uploading ? (
              <RefreshCw size={20} className="animate-spin text-[#D94545] mx-auto mb-1" />
            ) : (
              <ImageIcon size={20} className="text-gray-400 mx-auto mb-1" />
            )}
            <p className="text-[11px] text-gray-500">
              {uploading ? 'Uploading…' : canUpload ? 'Click or drop an image' : 'Sign in to upload'}
            </p>
          </div>
        )}
      </div>

      {showUrl && (
        <input
          type="url"
          value={value ?? ''}
          onChange={e => onChange?.(e.target.value)}
          placeholder="https://…"
          className="w-full mt-1.5 px-2.5 py-1.5 text-xs bg-white border border-[#E8DDCB] rounded-lg outline-none focus:border-[#D94545]"
        />
      )}

      {error && (
        <p className="text-[11px] text-red-500 mt-1">{error}</p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        onChange={e => handleFile(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  )
}
