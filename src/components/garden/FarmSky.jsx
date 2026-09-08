export function FarmSky({ children }) {
  return (
    <div className="relative w-full min-h-[120px] overflow-hidden rounded-2xl bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100">
      <style>{`
        @keyframes sky-drift {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(calc(100vw + 120%)); }
        }
        @keyframes sky-sway {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .sky-cloud {
          position: absolute;
          top: var(--cy, 10%);
          width: 110px;
          height: 38px;
          background: white;
          border-radius: 50px;
          opacity: 0.85;
          animation: sky-drift var(--dur, 60s) linear var(--delay, 0s) infinite;
          filter: blur(0.5px);
        }
        .sky-cloud::before {
          content: '';
          position: absolute;
          width: 50px;
          height: 40px;
          background: white;
          border-radius: 50%;
          top: -18px;
          left: 22px;
        }
        .sky-cloud::after {
          content: '';
          position: absolute;
          width: 36px;
          height: 30px;
          background: white;
          border-radius: 50%;
          top: -10px;
          left: 56px;
        }
      `}</style>

      {/* Sun */}
      <div className="absolute top-3 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 shadow-[0_0_30px_rgba(251,191,36,0.5)]" style={{ animation: 'sky-sway 4s ease-in-out infinite' }}>
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/50 to-transparent" />
      </div>

      {/* Clouds */}
      <div className="sky-cloud" style={{ '--cy': '10%', '--dur': '52s', '--delay': '0s' }} />
      <div className="sky-cloud" style={{ '--cy': '28%', '--dur': '70s', '--delay': '-20s' }} />
      <div className="sky-cloud" style={{ '--cy': '5%', '--dur': '60s', '--delay': '-40s' }} />
      <div className="sky-cloud" style={{ '--cy': '20%', '--dur': '80s', '--delay': '-10s', width: '80px', height: '28px' }} />

      {/* Grass strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-500 via-green-400 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-green-600 to-green-400" />

      {children}
    </div>
  );
}
