import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";

const ToolsPage = () => {
  const navigate = useNavigate();
  const eyeRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.ownerSVGElement?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dy, dx);
      const maxR = 18;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.1, maxR);
      eyeRef.current.setAttribute("cx", String(100 + Math.cos(angle) * dist));
      eyeRef.current.setAttribute("cy", String(80 + Math.sin(angle) * dist));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="scanlines flicker min-h-screen flex flex-col items-center p-8 relative overflow-hidden">
      {/* Eye background */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 200 160">
        <ellipse cx="100" cy="80" rx="80" ry="50" fill="none" stroke="hsl(0,100%,50%)" strokeWidth="1" />
        <circle cx="100" cy="80" r="30" fill="none" stroke="hsl(0,100%,50%)" strokeWidth="0.5" />
        <circle ref={eyeRef} cx="100" cy="80" r="12" fill="hsl(0,100%,50%)" opacity="0.6" />
      </svg>

      <button onClick={() => navigate("/home")} className="self-start text-muted-foreground hover:text-primary transition-colors mb-8 flex items-center gap-2 z-10 cursor-pointer">
        <ArrowLeft size={16} /> BACK
      </button>

      <div className="flex flex-col items-center gap-8 z-10 mt-20">
        <div className="red-box px-10 py-8 text-center">
          <p className="text-foreground text-xl tracking-wider">DM 6SHJI FOR TOOLS :)</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Discord icon */}
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-primary">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" fill="currentColor"/>
          </svg>
          <div className="flex gap-6">
            <span className="text-primary text-sm tracking-wider">cultrot</span>
            <span className="text-primary text-sm tracking-wider">6shji</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
