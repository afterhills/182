import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="scanlines flicker min-h-screen flex items-center justify-center cursor-pointer select-none"
      onClick={() => navigate("/home")}
    >
      <div className="text-center">
        <p className="text-primary text-2xl md:text-4xl tracking-widest blink-cursor glitch">
          CLICK TO ENTER
        </p>
        <p className="text-muted-foreground text-xs mt-4 tracking-wider">
          {">"} initializing system_
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
