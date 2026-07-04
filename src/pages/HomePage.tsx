import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Active Members", path: "/members" },
  { label: "Tools", path: "/tools" },
  { label: "Leaks", path: "/leaks" },
  { label: "Modules", path: "/modules" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="scanlines flicker min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <svg
        viewBox="-100 -100 200 200"
        className="w-64 h-64 md:w-80 md:h-80 text-primary animate-pulse"
        style={{ filter: "drop-shadow(0 0 12px hsl(0 100% 50% / 0.9)) drop-shadow(0 0 24px hsl(0 100% 50% / 0.5))" }}
        aria-label="pentagram sigil"
      >
        <circle cx="0" cy="0" r="50" fill="none" stroke="currentColor" strokeWidth="3" />
        {/* Inverted pentagram (point down) */}
        <polygon
          points="0,47.5 -45.19,-14.7 27.94,38.44 -27.94,38.44 45.19,-14.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="miter"
        />
        {/* 8 crosses + 8 '182' labels alternating around, total 16 positions */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 16 - Math.PI / 2;
          const isCross = i % 2 === 0;
          const r = isCross ? 72 : 78;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          const rot = (angle * 180) / Math.PI + 90;
          if (isCross) {
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
                <line x1="0" y1="-11" x2="0" y2="11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="butt" />
                <line x1="-5" y1="-3" x2="5" y2="-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="butt" />
              </g>
            );
          }
          return (
            <text
              key={i}
              x={x}
              y={y}
              fill="currentColor"
              fontSize="9"
              fontWeight="bold"
              fontFamily="Georgia, serif"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rot} ${x} ${y})`}
            >
              182
            </text>
          );
        })}
      </svg>
      <h1 className="text-primary text-6xl md:text-8xl font-bold tracking-widest"
        style={{ textShadow: "0 0 20px hsl(0 100% 50% / 0.6)" }}>
        182
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="red-box px-10 py-6 text-foreground text-lg tracking-wider uppercase hover:text-primary transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="text-muted-foreground text-xs tracking-wider">
        {">"} select_module_
      </p>
    </div>
  );
};

export default HomePage;
