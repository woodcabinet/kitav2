import { useState } from 'react';
import Header from '../components/Header';
import FilterPills from '../components/FilterPills';
import Stories from '../components/Stories';
import { TikTokCard, BrandStoryCard, EventCard, DropPreviewCard, CommunityCard } from '../components/FeedCards';
import { feedPosts } from '../data/feed';

export default function HomePage({ appState, onBrandClick }) {
  const [filter, setFilter] = useState('All');
  const { wishlisted, toggleWishlist } = appState;
  const [likedPosts, setLikedPosts] = useState(new Set());

  const toggleLike = (id) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = feedPosts.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'TikTok') return p.type === 'tiktok';
    if (filter === 'Drops') return p.type === 'drop-preview';
    if (filter === 'Events') return p.type === 'event';
    if (filter === 'Fashion') return p.type === 'brand-story' || p.type === 'tiktok';
    return true;
  });

  return (
    <div className="min-h-screen pb-24 bg-offblack">
      <Header />
      <Stories onBrandClick={onBrandClick} />
      <FilterPills active={filter} onChange={setFilter} />

      {/* Feed */}
      <div className="divide-y divide-white/[0.04]">
        {filtered.map((post) => {
          switch (post.type) {
            case 'tiktok':
              return <TikTokCard key={post.id} post={post} liked={likedPosts.has(post.id)} onLike={toggleLike} onBrandClick={onBrandClick} />;
            case 'brand-story':
              return <div key={post.id} className="px-0"><BrandStoryCard post={post} liked={likedPosts.has(post.id)} onLike={toggleLike} onBrandClick={onBrandClick} /></div>;
            case 'event':
              return <div key={post.id} className="px-3 py-2"><EventCard post={post} /></div>;
            case 'drop-preview':
              return <div key={post.id} className="px-3 py-2"><DropPreviewCard post={post} wishlisted={wishlisted} onWishlist={toggleWishlist} /></div>;
            case 'community':
              return <div key={post.id} className="px-0"><CommunityCard post={post} liked={likedPosts.has(post.id)} onLike={toggleLike} /></div>;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
