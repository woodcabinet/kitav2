import { useState, useCallback, useEffect } from 'react';

function loadSet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set(fallback);
  } catch { return new Set(fallback); }
}

function loadArray(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function useAppState() {
  const [wishlisted, setWishlisted] = useState(() => loadSet('kk-wishlisted', []));
  const [following, setFollowing] = useState(() => loadSet('kk-following', ['maroon']));
  const [tiktokSync, setTiktokSync] = useState(() => loadSet('kk-tiktokSync', ['toneff', 'maroon']));
  const [stamps, setStamps] = useState(() => loadArray('kk-stamps', [true, true, true, false, false, false, false, false, false, false]));
  const [toast, setToast] = useState(null);

  useEffect(() => { localStorage.setItem('kk-wishlisted', JSON.stringify([...wishlisted])); }, [wishlisted]);
  useEffect(() => { localStorage.setItem('kk-following', JSON.stringify([...following])); }, [following]);
  useEffect(() => { localStorage.setItem('kk-tiktokSync', JSON.stringify([...tiktokSync])); }, [tiktokSync]);
  useEffect(() => { localStorage.setItem('kk-stamps', JSON.stringify(stamps)); }, [stamps]);

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
