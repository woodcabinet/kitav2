import { useState, useEffect } from 'react';

function getNextFirstSaturday() {
  const now = new Date();
  // Work in SGT (UTC+8)
  const sgtOffset = 8 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const sgt = new Date(utc + sgtOffset * 60000);

  let year = sgt.getFullYear();
  let month = sgt.getMonth();

  // Find first Saturday of current month
  let firstDay = new Date(year, month, 1);
  let dayOfWeek = firstDay.getDay();
  let firstSaturday = dayOfWeek === 6 ? 1 : (6 - dayOfWeek + 1);
  let dropDate = new Date(year, month, firstSaturday, 10, 0, 0);

  // Convert drop date to UTC for comparison
  let dropUTC = dropDate.getTime() - sgtOffset * 60000;

  if (dropUTC <= now.getTime()) {
    // Move to next month
    month += 1;
    if (month > 11) { month = 0; year += 1; }
    firstDay = new Date(year, month, 1);
    dayOfWeek = firstDay.getDay();
    firstSaturday = dayOfWeek === 6 ? 1 : (6 - dayOfWeek + 1);
    dropDate = new Date(year, month, firstSaturday, 10, 0, 0);
    dropUTC = dropDate.getTime() - sgtOffset * 60000;
  }

  return { targetUTC: dropUTC, dropDate };
}

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [dropInfo, setDropInfo] = useState({ month: '', day: 0 });

  useEffect(() => {
    const { targetUTC, dropDate } = getNextFirstSaturday();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    setDropInfo({ month: months[dropDate.getMonth()], day: dropDate.getDate() });

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, targetUTC - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return { timeLeft, dropInfo };
}
