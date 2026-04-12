import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const members = ["6SHJI", "CULT", "ALIAS", "F9PO", "ZAID", "Y7JH", "YASI", "S6YJ", "K6SHH"];

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
        {members.map((name, i) => (
          <div
            key={name}
            className={`red-box px-6 py-4 text-center text-lg tracking-widest rainbow-glow ${i === 0 ? "text-xl font-bold border-2" : ""}`}
            style={i === 0 ? { animationDelay: "0s" } : { animationDelay: `${i * 0.3}s` }}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
