export default function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-[80px] flex items-center justify-center rounded-full h-[36px] bg-white/20 border-t border-white/50 shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
      style={{
        height: "clamp(28px, 68%, 36px)",
        width: "clamp(58px, 68%, 80px)",
      }}
    >
      <a
        className="w-full h-full flex items-center justify-center"
        href="mailto:majed.alghoul3@gmail.com?subject=Project%20Inquiry"
      >
        {children}
      </a>
    </div>
  );
}
