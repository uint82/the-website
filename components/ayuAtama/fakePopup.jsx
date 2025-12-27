import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function FakeFemboyPopup() {
  const [open, setOpen] = useState(false);
  const [closeCount, setCloseCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  /* CLOSE BUTTON: grow + shake, close after 5 clicks */
  const handleClose = () => {
    setCloseCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setOpen(false);
      }
      return next;
    });
  };

  /* SCALE (valid Tailwind arbitrary values) */
  const scaleMap = [
    "scale-[1]",
    "scale-[1.05]",
    "scale-[1.1]",
    "scale-[1.15]",
    "scale-[1.25]",
  ];

  /* SHAKE intensity */
  const shakeMap = [
    "",
    "animate-[shakeSoft_0.3s]",
    "animate-[shakeSoft_0.3s]",
    "animate-[shakeHard_0.35s]",
    "animate-[shakeInsane_0.4s]",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />

      {/* SHAKE LAYER */}
      <div
        className={`
          relative z-10
          ${shakeMap[Math.min(closeCount, shakeMap.length - 1)]}
        `}
      >
        {/* SCALE LAYER */}
        <div
          className={`
            w-[92%] max-w-sm
            rounded-2xl bg-white
            pt-20 p-6
            shadow-2xl
            transition-transform duration-300 ease-out
            ${scaleMap[Math.min(closeCount, scaleMap.length - 1)]}
          `}
        >
          {/* ANIME GIRL */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-40">
            <Image
              src="/ayuAtama/pengering2.png"
              alt="anime girl"
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>

          {/* CHECKMARK = IMMEDIATE REDIRECT */}
          <button
            onClick={() => router.push("/ayuAtama/rent-femboy")}
            className="absolute right-3 top-3 text-green-500 text-2xl font-bold transition-transform hover:scale-110"
            aria-label="confirm"
          >
            ✓
          </button>

          {/* CONTENT */}
          <div className="text-center">
            <div className="text-2xl font-extrabold text-pink-600">
              Your femboy in your area 😳
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Some femboy nearby wants to meet you right now.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {/* EVIL CLOSE BUTTON (5 clicks to close) */}
              <button
                onClick={handleClose}
                className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 font-semibold text-white transition-transform hover:scale-105 active:scale-95"
              >
                Close
              </button>

              {/* YES THANKS = IMMEDIATE REDIRECT */}
              <button
                onClick={() => router.push("/ayuAtama/rent-femboy")}
                className="text-sm text-gray-400 hover:underline"
              >
                Yes, Thanks
              </button>

              {/* PRESSURE TEXT */}
              <div className="text-xs text-gray-400">
                {closeCount > 0 && closeCount < 5
                  ? `Almost closed… ${5 - closeCount} more click${
                      5 - closeCount > 1 ? "s" : ""
                    }`
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KEYFRAMES (SSR SAFE) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shakeSoft {
              0% { transform: translateX(0); }
              25% { transform: translateX(-2px); }
              50% { transform: translateX(2px); }
              75% { transform: translateX(-2px); }
              100% { transform: translateX(0); }
            }

            @keyframes shakeHard {
              0% { transform: translateX(0); }
              20% { transform: translateX(-6px); }
              40% { transform: translateX(6px); }
              60% { transform: translateX(-6px); }
              80% { transform: translateX(6px); }
              100% { transform: translateX(0); }
            }

            @keyframes shakeInsane {
              0% { transform: translate(0, 0); }
              20% { transform: translate(-8px, 4px); }
              40% { transform: translate(8px, -4px); }
              60% { transform: translate(-8px, -4px); }
              80% { transform: translate(8px, 4px); }
              100% { transform: translate(0, 0); }
            }
          `,
        }}
      />
    </div>
  );
}
