import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Active Members", path: "/members" },
  { label: "Tools", path: "/tools" },
  { label: "Leaks", path: "/leaks" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="scanlines flicker min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <svg
        viewBox="0 0 100 100"
        className="w-32 h-32 md:w-40 md:h-40 text-primary animate-pulse"
        style={{ filter: "drop-shadow(0 0 12px hsl(0 100% 50% / 0.9)) drop-shadow(0 0 24px hsl(0 100% 50% / 0.5))" }}
        aria-label="pentagram"
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Inverted pentagram: single point down */}
        <polygon
          points="50,95 14.7,30.9 90.5,69.1 9.5,69.1 85.3,30.9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="miter"
        />
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
