import { useState, useCallback } from 'react';

export function useAppState() {
  const [wishlisted, setWishlisted] = useState(new Set());
  const [following, setFollowing] = useState(new Set(['maroon']));
  const [tiktokSync, setTiktokSync] = useState(new Set(['toneff', 'maroon']));
  const [stamps, setStamps] = useState([true, true, true, false, false, false, false, false, false, false]);
  const [toast, setToast] = useState(null);

  const toggleWishlist = useCallback((id) => {
    setWishlisted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleFollow = useCallback((id) => {
    setFollowing(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleTiktokSync = useCallback((brandId, handle) => {
    setTiktokSync(prev => {
      const next = new Set(prev);
      const wasEnabled = next.has(brandId);
      if (wasEnabled) {
        next.delete(brandId);
      } else {
        next.add(brandId);
        showToast(`TikTok content from ${handle} will now appear in your feed`);
      }
      return next;
    });
  }, []);

  const toggleStamp = useCallback((index) => {
    setStamps(prev => {
      const next = [...prev];
      if (!next[index]) next[index] = true;
      return next;
    });
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return {
    wishlisted, toggleWishlist,
    following, toggleFollow,
    tiktokSync, toggleTiktokSync,
    stamps, toggleStamp,
    toast, showToast,
  };
}
