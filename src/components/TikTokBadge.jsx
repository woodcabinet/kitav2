export default function TikTokBadge({ small }) {
  return (
    <span className={`inline-flex items-center gap-1 bg-tiktok/15 border border-tiktok/30 text-tiktok rounded-full font-semibold ${
      small ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
    }`}>
      <svg width={small ? 10 : 12} height={small ? 10 : 12} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52V6.95a4.85 4.85 0 01-1-.26z"/>
      </svg>
      TikTok
    </span>
  );
}
