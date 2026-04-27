import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown } from "lucide-react";

const members: { name: string; count: number }[] = [
  { name: "6SHJI", count: 4 },
  { name: "CULT", count: 4 },
  { name: "ALIAS", count: 0 },
  { name: "F9PO", count: 3 },
  { name: "ZAID", count: 1 },
  { name: "Y7JH", count: 1 },
  { name: "YASI", count: 3 },
  { name: "S6YJ", count: 2 },
  { name: "K6SHH", count: 4 },
];

const MembersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="scanlines flicker min-h-screen flex flex-col items-center p-8">
      <button onClick={() => navigate("/home")} className="self-start text-muted-foreground hover:text-primary transition-colors mb-8 flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={16} /> BACK
      </button>
      <h1 className="text-primary text-3xl md:text-5xl tracking-widest mb-12"
        style={{ textShadow: "0 0 15px hsl(0 100% 50% / 0.5)" }}>
        182 MEMBERS
      </h1>
      <div className="flex flex-col gap-3 w-full max-w-md">
        {members.map((m, i) => (
          <div
            key={m.name}
            className={`red-box px-6 py-4 text-center text-lg tracking-widest rainbow-glow flex items-center justify-center gap-3 ${i === 0 ? "text-xl font-bold border-2" : ""}`}
            style={i === 0 ? { animationDelay: "0s" } : { animationDelay: `${i * 0.3}s` }}
          >
            {i === 0 && (
              <Crown
                size={24}
                className="crown-glow"
                style={{
                  color: "#FFD700",
                  filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))",
                }}
              />
            )}
            <span>{m.name}</span>
            <span className="text-primary font-bold ml-2">{m.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
