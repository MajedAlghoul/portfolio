import { useThemeSelect } from "@/contexts/ThemeSelectContext";

export default function ColorDrop() {
  const { toggleOpen } = useThemeSelect();

  return (
    <button
      onClick={toggleOpen}
      className="w-full h-full flex items-center justify-center cursor-pointer"
    >
      <div
        className="rounded-full bg-[var(--accent-color)] border-1 border-b-0 border-white/40 shadow-[0_4px_10px_rgba(0,0,0,0.1)] "
        style={{
          width: "clamp(22px, 28%, 30px)",
          height: "clamp(22px, 28%, 30px)",
        }}
      />
    </button>
  );
}
