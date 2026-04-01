import { useState } from 'react';
import { stories as storyData } from '../data/stories';
import StoryViewer from './StoryViewer';

function BrandAvatar({ logo, avatar, size = 'w-[52px] h-[52px]', textSize = 'text-base' }) {
  const [logoFailed, setLogoFailed] = useState(false);
  if (logo && !logoFailed) {
    return (
      <div className={`${size} rounded-full overflow-hidden flex items-center justify-center bg-offblack`}>
        <img src={logo} alt="" className="w-full h-full object-cover" onError={() => setLogoFailed(true)} />
      </div>
    );
  }
  return (
    <div className={`${size} rounded-full flex items-center justify-center ${textSize}`} style={{ background: '#1E3520' }}>
      {avatar}
    </div>
  );
}

export default function Stories({ onBrandClick }) {
  const [stories, setStories] = useState(storyData);
  const [activeStory, setActiveStory] = useState(null);

  const openStory = (index) => {
    setActiveStory(index);
    setStories(prev => prev.map((s, i) => i === index ? { ...s, seen: true } : s));
  };

  const closeStory = () => setActiveStory(null);

  const goNext = () => {
    if (activeStory < stories.length - 1) {
      setActiveStory(activeStory + 1);
      setStories(prev => prev.map((s, i) => i === activeStory + 1 ? { ...s, seen: true } : s));
    } else {
      closeStory();
    }
  };

  const goPrev = () => {
    if (activeStory > 0) setActiveStory(activeStory - 1);
  };

  return (
    <>
      <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar border-b border-white/[0.04]">
        {/* Your Story */}
        <button className="flex flex-col items-center gap-1 min-w-[64px]">
          <div className="relative">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg border border-dashed border-warm/15" style={{ background: '#161D14' }}>
              🧑
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-gold flex items-center justify-center">
              <span className="text-offblack text-[10px] font-bold leading-none">+</span>
            </div>
          </div>
          <span className="text-[10px] text-warm/40">You</span>
        </button>

        {stories.map((story, i) => (
          <button
            key={story.brandId}
            onClick={() => openStory(i)}
            className="flex flex-col items-center gap-1 min-w-[72px]"
          >
            <div className="p-[2px] rounded-full" style={!story.seen ? {
              background: 'linear-gradient(135deg, #D4A843, #C4622D)',
            } : {
              background: 'rgba(200,184,154,0.12)',
            }}>
              <div className="w-[56px] h-[56px] rounded-full bg-offblack p-[1.5px]">
                <BrandAvatar logo={story.logo} avatar={story.avatar} />
              </div>
            </div>
            <span className={`text-[10px] truncate max-w-[72px] text-center ${story.seen ? 'text-warm/30' : 'text-cream/70'}`}>
              {story.brandName}
            </span>
          </button>
        ))}
      </div>

      {activeStory !== null && (
        <StoryViewer
          stories={stories}
          currentIndex={activeStory}
          onClose={closeStory}
          onNext={goNext}
          onPrev={goPrev}
          onBrandClick={onBrandClick}
        />
      )}
    </>
  );
}
