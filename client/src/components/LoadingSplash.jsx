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
      className={`fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-[#120f0d] px-5 py-6 transition-opacity duration-500 [padding-top:env(safe-area-inset-top)] [padding-bottom:env(safe-area-inset-bottom)] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(240,167,90,0.18),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(240,167,90,0.12),_transparent_30%)]" />

      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center justify-center text-center sm:max-w-[480px]">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-[#f0a75a]/35 bg-[#1d1714] shadow-[0_22px_100px_-35px_rgba(240,167,90,0.8)]">
          <div className="absolute -inset-4 rounded-[2.4rem] border border-[#f0a75a]/15" />
          <img src="/Gapshap-logo.png" alt="Gapshup Cafe" className="h-20 w-20 rounded-[1.4rem] object-cover" />
        </div>

        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f0c28c] sm:text-[11px]">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#f0a75a]" />
          Loading menu
        </div>

        <h1 className="mt-4 max-w-[15ch] text-[2.05rem] leading-[1.08] tracking-[-0.04em] text-[#fff8f0] sm:text-[2.7rem]">
          Welcome to <span className="text-[#f0a75a]">Gapshup</span>'s digital menu
        </h1>
        <p className="mt-3 max-w-[28rem] text-sm leading-6 text-[#d7bba3] sm:text-[0.95rem]">
          Preparing your favorite dishes and cafe experience...
        </p>

        <div className="mt-7 h-1.5 w-44 overflow-hidden rounded-full bg-[#2e241f] shadow-inner shadow-black/30 sm:w-52">
          <div className="h-full w-1/2 animate-[loading-bar_1.3s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#f0a75a] via-[#ffca7a] to-[#f0a75a]" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSplash;
