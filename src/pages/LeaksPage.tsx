import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LeaksPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "90") {
      navigate("/leaks/dashboard", { state: { role: "viewer" } });
    } else if (code === "1822503") {
      navigate("/leaks/dashboard", { state: { role: "owner" } });
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="scanlines flicker min-h-screen flex flex-col items-center p-8 pt-24">
      <button onClick={() => navigate("/home")} className="absolute top-8 left-8 text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 cursor-pointer z-10">
        <ArrowLeft size={16} /> BACK
      </button>

      <img
        src={leaksBanner}
        alt="182 remember your true god banner"
        className="w-full max-w-4xl mx-auto mb-12 select-none pointer-events-none"
        style={{ filter: "drop-shadow(0 0 20px hsl(0 100% 50% / 0.4))" }}
      />

      <form onSubmit={handleSubmit} className="red-box p-8 flex flex-col items-center gap-6 w-full max-w-sm">
        <p className="text-primary text-lg tracking-wider">{">"} ENTER PASSCODE_</p>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-background border border-border text-foreground text-center text-2xl tracking-[0.5em] py-3 px-4 focus:outline-none focus:border-primary transition-colors"
          autoFocus
          placeholder="****"
        />
        {error && <p className="text-destructive text-sm tracking-wider">ACCESS DENIED</p>}
        <button type="submit" className="red-box px-8 py-3 text-foreground hover:text-primary tracking-wider transition-colors cursor-pointer">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default LeaksPage;
