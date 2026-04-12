import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Active Members", path: "/members" },
  { label: "Tools", path: "/tools" },
  { label: "Leaks", path: "/leaks" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="scanlines flicker min-h-screen flex flex-col items-center justify-center gap-12 p-8">
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
