import { useEffect, useState } from "react";

const LoadingSplash = ({ visible }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => setShow(false), 380);
      return () => clearTimeout(timeout);
    }

    setShow(true);
    return undefined;
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-[#120f0d] transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center justify-center px-6 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.8rem] border border-[#f0a75a]/30 bg-[#1d1714] shadow-[0_26px_70px_-30px_rgba(0,0,0,0.9)]">
          <img src="/Gapshap-logo.png" alt="Gapshup Cafe" className="h-16 w-16 rounded-2xl object-cover" />
          <div className="absolute -inset-3 rounded-[2.1rem] border border-[#f0a75a]/20" />
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f0c28c]">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#f0a75a]" />
          Loading menu
        </div>

        <h1 className="mt-3 font-display text-3xl leading-tight text-[#fff8f0] sm:text-4xl">
          Welcome to <span className="text-[#f0a75a]">Gapshup</span>'s digital menu
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-[#d7bba3]">
          Preparing your favorite dishes and cafe experience...
        </p>

        <div className="mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-[#2e241f]">
          <div className="h-full w-1/2 animate-[loading-bar_1.3s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#f0a75a] via-[#ffca7a] to-[#f0a75a]" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSplash;
