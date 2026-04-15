import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header';
import FilterPills from '../components/FilterPills';
import Stories from '../components/Stories';
import { TikTokCard, BrandStoryCard, EventCard, DropPreviewCard, CommunityCard, ThreadCard } from '../components/FeedCards';
import { feedPosts } from '../data/feed';

const BATCH_SIZE = 8;

export default function HomePage({ appState, onBrandClick, onCartAdd, onShopClick }) {
  const [filter, setFilter] = useState('All');
  const { wishlisted, toggleWishlist } = appState;
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const loaderRef = useRef(null);

  const toggleLike = (id) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = feedPosts.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Threads') return p.type === 'thread';
    if (filter === 'TikTok') return p.type === 'tiktok';
    if (filter === 'Drops') return p.type === 'drop-preview';
    if (filter === 'Events') return p.type === 'event';
    if (filter === 'Fashion') return p.type === 'brand-story' || p.type === 'tiktok';
    return true;
  });

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filter]);

  // Infinite scroll — IntersectionObserver on sentinel
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + BATCH_SIZE, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const sentinel = loaderRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen pb-24 bg-offblack">
      <Header onBrandClick={onBrandClick} />
      <Stories onBrandClick={onBrandClick} />
      <FilterPills
        active={filter}
        onChange={setFilter}
        pills={['All', 'Threads', 'TikTok', 'Drops', 'Events', 'Fashion']}
      />

      {/* Feed — infinite scroll */}
      <div className="divide-y divide-white/[0.04]">
        {visible.map((post) => {
          switch (post.type) {
            case 'thread':
              return <div key={post.id} className="!border-none"><ThreadCard post={post} /></div>;
            case 'tiktok':
              return <TikTokCard key={post.id} post={post} liked={likedPosts.has(post.id)} onLike={toggleLike} onBrandClick={onBrandClick} />;
            case 'brand-story':
              return <div key={post.id} className="px-0"><BrandStoryCard post={post} liked={likedPosts.has(post.id)} onLike={toggleLike} onBrandClick={onBrandClick} /></div>;
            case 'event':
              return <div key={post.id} className="px-3 py-2"><EventCard post={post} /></div>;
            case 'drop-preview':
              return <div key={post.id} className="px-3 py-2"><DropPreviewCard post={post} wishlisted={wishlisted} onWishlist={toggleWishlist} onShopClick={onShopClick} /></div>;
            case 'community':
              return <div key={post.id} className="px-0"><CommunityCard post={post} liked={likedPosts.has(post.id)} onLike={toggleLike} /></div>;
            default:
              return null;
          }
        })}
      </div>

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={loaderRef} className="py-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            <span className="text-[11px] text-warm/35">Loading more…</span>
          </div>
        </div>
      )}

      {/* End of feed */}
      {!hasMore && visible.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-[11px] text-warm/25">You're all caught up</p>
        </div>
      )}
    </div>
  );
}
