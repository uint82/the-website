import Image from "next/image";
import { useRouter } from "next/router";

export default function AnimeCTAButton() {
  const router = useRouter();
  return (
    <div className="relative flex justify-center items-center py-28">
      <div className="relative w-fit">
        {/* GLOBAL KEYFRAMES (SSR SAFE) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
      @keyframes arrowPulse {
        0% {
          transform: scale(1);
          filter: drop-shadow(0 0 6px rgb(255, 0, 150));
        }
        33% {
          transform: scale(1.35);
          filter: drop-shadow(0 0 10px rgb(120, 0, 255));
        }
        66% {
          transform: scale(1.15);
          filter: drop-shadow(0 0 10px rgb(0, 200, 255));
        }
        100% {
          transform: scale(1);
          filter: drop-shadow(0 0 6px rgb(255, 0, 150));
        }
      }
    `,
          }}
        />

        {/* ================= ARROWS ================= */}

        {/* TOP */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-4">
          {[...Array(3)].map((_, i) => (
            <Arrow key={`top-${i}`} direction="down" delay={i * 0.15} />
          ))}
        </div>

        {/* BOTTOM */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-4">
          {[...Array(3)].map((_, i) => (
            <Arrow key={`bottom-${i}`} direction="up" delay={i * 0.15} />
          ))}
        </div>

        {/* LEFT */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2">
          <Arrow direction="right" />
        </div>

        {/* RIGHT */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2">
          <Arrow direction="left" />
        </div>

        {/* ================= BUTTON ================= */}
        <button
          className="
          relative flex items-center
          w-[420px] h-[120px]
          rounded-2xl
          bg-gradient-to-r from-pink-500 to-purple-600
          animate-pulseGlow
          overflow-visible
          transition-transform duration-200
          hover:scale-[1.1]
          active:scale-95
        "
          onClick={() => router.push("/ayuAtama/rent-femboy")}
        >
          {/* IMAGE (overflowing, not cut, not full) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[60%] h-[160%] pointer-events-none">
            <Image
              src="/ayuAtama/pengering.png"
              alt="anime girl"
              fill
              priority
              className="
              object-contain
              scale-125
              -translate-x-10
            "
            />
          </div>

          {/* TEXT */}
          <div className="relative ml-[55%] px-6 text-left text-white">
            <div className="text-sm opacity-80">Click me, senpai~</div>
            <div className="text-2xl font-bold tracking-wide">FEMBOY HERE!</div>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ================= ARROW ================= */

function Arrow({ direction, delay = 0 }) {
  const rotate = {
    down: "rotate-90",
    up: "-rotate-90",
    left: "rotate-180",
    right: "rotate-0",
  };

  return (
    <div
      className="text-7xl font-bold"
      style={{
        animation: `arrowPulse 1.6s ease-in-out ${delay}s infinite`,
      }}
    >
      <span className={`inline-block ${rotate[direction]}`}>➤</span>
    </div>
  );
}
