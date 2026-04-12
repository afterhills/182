import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";

const ToolsPage = () => {
  const navigate = useNavigate();
  const pupilRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!pupilRef.current) return;
      const svg = pupilRef.current.ownerSVGElement;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dy, dx);
      const maxR = 12;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.05, maxR);
      pupilRef.current.setAttribute("cx", String(200 + Math.cos(angle) * dist));
      pupilRef.current.setAttribute("cy", String(100 + Math.sin(angle) * dist));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="scanlines flicker min-h-screen flex flex-col items-center p-8 relative overflow-hidden">
      {/* Realistic eye background */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200">
        {/* Outer eye shape */}
        <path
          d="M60 100 Q200 20 340 100 Q200 180 60 100Z"
          fill="none"
          stroke="hsl(0,100%,50%)"
          strokeWidth="2"
        />
        {/* Inner eye shape */}
        <path
          d="M90 100 Q200 45 310 100 Q200 155 90 100Z"
          fill="none"
          stroke="hsl(0,100%,50%)"
          strokeWidth="0.8"
          opacity="0.5"
        />
        {/* Iris outer */}
        <circle cx="200" cy="100" r="38" fill="none" stroke="hsl(0,100%,50%)" strokeWidth="1.5" />
        {/* Iris detail rings */}
        <circle cx="200" cy="100" r="32" fill="none" stroke="hsl(0,100%,50%)" strokeWidth="0.5" opacity="0.6" />
        <circle cx="200" cy="100" r="26" fill="none" stroke="hsl(0,100%,50%)" strokeWidth="0.3" opacity="0.4" />
        {/* Iris fill */}
        <circle cx="200" cy="100" r="38" fill="hsl(0,100%,50%)" opacity="0.08" />
        {/* Pupil */}
        <circle ref={pupilRef} cx="200" cy="100" r="16" fill="hsl(0,100%,50%)" opacity="0.7" />
        {/* Pupil highlight */}
        <circle cx="208" cy="92" r="5" fill="hsl(0,0%,100%)" opacity="0.15" />
        {/* Eyelid lines */}
        <path
          d="M60 100 Q200 20 340 100"
          fill="none"
          stroke="hsl(0,100%,50%)"
          strokeWidth="0.5"
          opacity="0.3"
          transform="translate(0, -8)"
        />
        <path
          d="M60 100 Q200 180 340 100"
          fill="none"
          stroke="hsl(0,100%,50%)"
          strokeWidth="0.5"
          opacity="0.3"
          transform="translate(0, 8)"
        />
      </svg>

      <button onClick={() => navigate("/home")} className="self-start text-muted-foreground hover:text-primary transition-colors mb-8 flex items-center gap-2 z-10 cursor-pointer">
        <ArrowLeft size={16} /> BACK
      </button>

      <div className="flex flex-col items-center gap-8 z-10 mt-20">
        <div className="red-box px-10 py-8 text-center">
          <p className="text-foreground text-xl tracking-wider">DM 6SHJI FOR TOOLS AND REQUIREMENTS</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Discord section */}
          <div className="flex flex-col items-center gap-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" fill="currentColor"/>
            </svg>
            <div className="flex gap-6">
              <span className="text-primary text-sm tracking-wider">cultrot</span>
              <span className="text-primary text-sm tracking-wider">6shji</span>
            </div>
          </div>

          {/* Telegram section */}
          <div className="flex flex-col items-center gap-3 mt-2">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="currentColor"/>
            </svg>
            <a
              href="https://t.me/cultrot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm tracking-wider hover:underline transition-colors"
              style={{ textShadow: "0 0 8px hsl(0 100% 50% / 0.4)" }}
            >
              t.me/cultrot
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
