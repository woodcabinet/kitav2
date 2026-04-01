import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Send } from 'lucide-react';

export default function StoryViewer({ stories, currentIndex, onClose, onNext, onPrev, onBrandClick }) {
  const story = stories[currentIndex];
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [paused, setPaused] = useState(false);
  const shouldAdvance = useRef(false);

  const item = story.items[itemIndex];
  const DURATION = 5000;
  const TICK = 50;
  const INCREMENT = 100 / (DURATION / TICK);

  // Reset when story changes
  useEffect(() => {
    setItemIndex(0);
    setProgress(0);
    setLiked(false);
    shouldAdvance.current = false;
  }, [currentIndex]);

  // Reset progress when item changes
  useEffect(() => {
    setProgress(0);
    shouldAdvance.current = false;
  }, [itemIndex]);

  // Auto-advance timer
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + INCREMENT;
        if (next >= 100) {
          shouldAdvance.current = true;
          return 100;
        }
        return next;
      });
    }, TICK);

    return () => clearInterval(interval);
  }, [paused, INCREMENT]);

  // Handle advancement separately
  useEffect(() => {
    if (!shouldAdvance.current || progress < 100) return;
    shouldAdvance.current = false;

    const timer = setTimeout(() => {
      if (itemIndex < story.items.length - 1) {
        setItemIndex(i => i + 1);
      } else {
        onNext();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [progress, itemIndex, story.items.length, onNext]);

  const handleTap = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.3) {
      if (itemIndex > 0) {
        setItemIndex(i => i - 1);
      } else {
        onPrev();
      }
    } else {
      if (itemIndex < story.items.length - 1) {
        setItemIndex(i => i + 1);
      } else {
        onNext();
      }
    }
  }, [itemIndex, story.items.length, onNext, onPrev]);

  const viewer = (
    <div className="fixed inset-0 bg-black" style={{ zIndex: 9999 }}>
      {/* Story Content */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: item.gradient }}
        onClick={handleTap}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
        <div className="text-8xl opacity-20 select-none">{story.avatar}</div>
      </div>

      {/* Top section */}
      <div className="absolute top-0 left-0 right-0" style={{ zIndex: 10000 }}>
        <div className="pt-3">
          {/* Progress bars */}
          <div className="flex gap-1 px-3 mb-3">
            {story.items.map((_, i) => (
              <div key={i} className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{
                    width: i < itemIndex ? '100%' : i === itemIndex ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4">
            <button
              onClick={(e) => { e.stopPropagation(); onBrandClick?.(story.brandId); onClose(); }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center text-sm border border-white/20">
                {story.avatar}
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">{story.brandName}</p>
                <p className="text-white/50 text-[10px]">{item.timestamp}</p>
              </div>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-8 h-8 flex items-center justify-center"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 pb-6" style={{ zIndex: 10000 }} onClick={e => e.stopPropagation()}>
        <div className="px-4 mb-4">
          <p className="text-white text-sm leading-relaxed drop-shadow-lg">{item.caption}</p>
        </div>

        <div className="flex items-center gap-3 px-4">
          <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2.5">
            <p className="text-white/40 text-sm">Reply to {story.brandName}...</p>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Heart
              size={24}
              className={`transition-all ${liked ? 'fill-rust text-rust scale-110' : 'text-white'}`}
            />
          </button>
          <button className="w-10 h-10 flex items-center justify-center">
            <Send size={22} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(viewer, document.body);
}
