export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div className="px-5 py-3 rounded-2xl text-sm font-medium max-w-[340px] text-center shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(30,53,32,0.95) 0%, rgba(20,38,24,0.95) 100%)',
        border: '1px solid rgba(212,168,67,0.2)',
        color: '#D4A843',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 16px rgba(212,168,67,0.06)',
        backdropFilter: 'blur(16px)',
      }}>
        {message}
      </div>
    </div>
  );
}
