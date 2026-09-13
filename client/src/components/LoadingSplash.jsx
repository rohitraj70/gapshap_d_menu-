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

      <div className="relative z-10 flex w-full max-w-[320px] flex-col items-center justify-center text-center sm:max-w-[360px]">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.8rem] border border-[#f0a75a]/35 bg-[#1d1714] shadow-[0_22px_100px_-35px_rgba(240,167,90,0.8)] sm:h-28 sm:w-28">
          <div className="absolute -inset-3 rounded-[2.1rem] border border-[#f0a75a]/15 sm:-inset-4 sm:rounded-[2.4rem]" />
          <img src="/Gapshap-logo.png" alt="Gapshup Cafe" className="h-16 w-16 rounded-[1.1rem] object-cover sm:h-20 sm:w-20 sm:rounded-[1.4rem]" />
        </div>

        <div className="mt-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.24em] text-[#f0c28c] sm:mt-6 sm:text-[10px]">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#f0a75a]" />
          Loading menu
        </div>

        <h1 className="mt-3 max-w-[14ch] text-[1.7rem] leading-[1.08] tracking-[-0.04em] text-[#fff8f0] sm:text-[2.2rem]">
          Welcome to <span className="text-[#f0a75a]">Gapshup</span>'s digital menu
        </h1>
        <p className="mt-2 max-w-[26rem] text-xs leading-5 text-[#d7bba3] sm:text-sm sm:leading-6">
          Preparing your favorite dishes and cafe experience...
        </p>

        <div className="mt-5 h-1.5 w-36 overflow-hidden rounded-full bg-[#2e241f] shadow-inner shadow-black/30 sm:mt-6 sm:w-44">
          <div className="h-full w-1/2 animate-[loading-bar_1.3s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#f0a75a] via-[#ffca7a] to-[#f0a75a]" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSplash;
