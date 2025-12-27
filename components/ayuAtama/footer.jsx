import { useState, useEffect } from "react";

const FOOTER_LINES = [
  "Still here? That probably means the interface did its job a little too well. Don’t worry, we designed it this way—purely for usability reasons, of course.",
  "You’re allowed to close the tab anytime. The fact that you haven’t is a strong indicator that the experience is functioning as intended.",
  "No animations are running right now, and yet your attention is still locked in. We’ll log that as a successful interaction.",
  "We optimized this page for speed, clarity, and comfort. Accidentally making it hard to leave was not in the spec, but here we are.",
  "Everything on this page is working exactly as expected. Including the part where you tell yourself ‘just one more second.’",
  "At this point, you’re no longer just browsing. You’re actively participating in the product design feedback loop.",
  "There’s nothing hidden below this footer. Still, something tells us you’re not quite ready to scroll away yet.",
];

function Footer() {
  const [footerIndex, setFooterIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setFooterIndex((prev) => (prev + 1) % FOOTER_LINES.length);
    }, 6000); // 6 seconds feels right for footer text

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-gradient-to-b from-[#1B004D] to-[#2E0A6F] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-6">
          {/* <img
            alt=""
            className="h-11"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiLogoSquareShape.svg"
          /> */}
          <p className="h-11 text-3xl font-bold">Femboy Rental!</p>
        </div>
        <footer className="mt-12 max-w-xl mx-auto text-center text-sm text-pink-500">
          {FOOTER_LINES[footerIndex]}
        </footer>
      </div>
      <div className="border-t border-[#3B1A7A]">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
          <a href="https://wahyupratama.web.id">femrent</a> ©2025. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
