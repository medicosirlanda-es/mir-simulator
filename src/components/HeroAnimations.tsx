"use client";

/** Build a tiled ECG path with realistic P-QRS-T morphology */
function ecgPath(beats: number): { d: string; viewWidth: number } {
  const points: string[] = [];
  for (let i = 0; i < beats; i++) {
    const ox = i * 200;
    if (i === 0) points.push(`M${ox},50`);
    points.push(
      `L${ox + 30},50`,
      `Q${ox + 35},50 ${ox + 38},46`,
      `Q${ox + 42},40 ${ox + 45},50`,
      `L${ox + 55},50 L${ox + 58},50`,
      `L${ox + 62},20 L${ox + 66},80 L${ox + 70},10 L${ox + 74},60`,
      `L${ox + 78},50 L${ox + 100},50`,
      `Q${ox + 105},50 ${ox + 110},42`,
      `Q${ox + 118},30 ${ox + 125},50`,
      `L${ox + 160},50 L${ox + 200},50`
    );
  }
  return { d: points.join(" "), viewWidth: beats * 200 };
}

/** Single ECG trace line with draw animation + glow */
function EcgTrace({
  y, delay, duration, opacity, color, glowColor, strokeWidth,
}: {
  y: number; delay: number; duration: number; opacity: number;
  color: string; glowColor: string; strokeWidth: number;
}) {
  const { d, viewWidth } = ecgPath(10);

  return (
    <svg
      className="absolute left-0 w-full pointer-events-none"
      style={{ top: `${y}%`, opacity }}
      viewBox={`0 0 ${viewWidth} 100`}
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <filter id={`glow-${y}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Glow layer */}
      <path
        d={d}
        stroke={glowColor}
        strokeWidth={strokeWidth * 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${y})`}
        className="ecg-trace"
        style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
      />
      {/* Sharp line */}
      <path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ecg-trace"
        style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
      />
    </svg>
  );
}

/** Pulse ring that expands and fades from a point */
function PulseRing({
  cx, cy, delay, size, color,
}: {
  cx: number; cy: number; delay: number; size: number; color: string;
}) {
  return (
    <div
      className="absolute rounded-full animate-pulse-ring"
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        border: `2px solid ${color}`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/** Floating medical cross particle */
function FloatingParticle({
  x, y, delay, duration, size,
}: {
  x: number; y: number; delay: number; duration: number; size: number;
}) {
  return (
    <div
      className="absolute animate-float-particle"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-white/[0.08]">
        <rect x="9" y="2" width="6" height="20" rx="1" fill="currentColor" />
        <rect x="2" y="9" width="20" height="6" rx="1" fill="currentColor" />
      </svg>
    </div>
  );
}

export function HeroAnimations() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Gradient orbs — slow floating movement */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-hero-orb-1" />
      <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] bg-accent-green/15 rounded-full blur-[120px] animate-hero-orb-2" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-light/20 rounded-full blur-[100px] animate-hero-orb-3" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ECG traces — glowing heartbeat lines at different heights */}
      <EcgTrace y={20} delay={0} duration={6} opacity={0.18} color="#60A5FA" glowColor="#3B82F6" strokeWidth={1.5} />
      <EcgTrace y={48} delay={2} duration={8} opacity={0.10} color="#34D399" glowColor="#10B981" strokeWidth={1} />
      <EcgTrace y={72} delay={4} duration={7} opacity={0.12} color="#93C5FD" glowColor="#60A5FA" strokeWidth={1.2} />

      {/* Floating medical cross particles */}
      <FloatingParticle x={5} y={15} delay={0} duration={12} size={20} />
      <FloatingParticle x={22} y={65} delay={3} duration={15} size={16} />
      <FloatingParticle x={55} y={10} delay={6} duration={14} size={18} />
      <FloatingParticle x={82} y={40} delay={2} duration={11} size={14} />
      <FloatingParticle x={40} y={82} delay={5} duration={13} size={22} />
      <FloatingParticle x={68} y={70} delay={8} duration={16} size={12} />
      <FloatingParticle x={90} y={18} delay={1} duration={10} size={16} />
    </div>
  );
}
