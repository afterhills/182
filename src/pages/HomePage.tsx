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
        className="w-56 h-56 md:w-72 md:h-72 text-primary animate-pulse"
        style={{ filter: "drop-shadow(0 0 12px hsl(0 100% 50% / 0.9)) drop-shadow(0 0 24px hsl(0 100% 50% / 0.5))" }}
        aria-label="pentagram sigil"
      >
        <circle cx="0" cy="0" r="46" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Inverted pentagram (point down) */}
        <polygon
          points="0,42 -39.94,-13.0 24.69,33.99 -24.69,33.99 39.94,-13.0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="miter"
        />
        {/* 8 crosses + '182' labels around the circle */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
          const cr = 72;
          const cx = Math.cos(angle) * cr;
          const cy = Math.sin(angle) * cr;
          const tr = 88;
          const tx = Math.cos(angle + Math.PI / 8) * tr;
          const ty = Math.sin(angle + Math.PI / 8) * tr;
          return (
            <g key={i}>
              <g transform={`translate(${cx} ${cy}) rotate(${(angle * 180) / Math.PI + 90})`}>
                <line x1="0" y1="-7" x2="0" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="-3.5" y1="-2" x2="3.5" y2="-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <text
                x={tx}
                y={ty}
                fill="currentColor"
                fontSize="7"
                fontFamily="monospace"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${(angle * 180) / Math.PI + 90 + 22.5} ${tx} ${ty})`}
              >
                182
              </text>
            </g>
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
