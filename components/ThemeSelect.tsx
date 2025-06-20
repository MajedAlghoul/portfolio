"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useThemeSelect } from "@/contexts/ThemeSelectContext";

export default function ThemeSelect() {
  const { isThemeSelectOpen, toggleOpen } = useThemeSelect();

  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const collapseThreshold = 200;

  useEffect(() => {
    const updateHeight = () => {
      setFullHeight(window.innerHeight * 2);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    if (isThemeSelectOpen) {
      setVisible(true);
      animate(y, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30,
      });
    } else {
      animate(y, fullHeight, {
        type: "spring",
        stiffness: 300,
        damping: 25,
        onComplete: () => {
          setVisible(false);
        },
      });
    }
  }, [isThemeSelectOpen]);

  function handleDragEnd(_: any, info: any) {
    setIsDragging(false);
    y.stop();

    const offsetY = info.offset.y;
    const velocityY = info.velocity.y;

    const isDownward = offsetY > 0 && velocityY > 0;
    const draggedFar = offsetY > collapseThreshold;
    const flickedFastDown = velocityY > 800;

    const shouldCollapse = isDownward && (draggedFar || flickedFastDown);

    if (shouldCollapse) {
      toggleOpen();
      animate(y, fullHeight, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    } else {
      animate(y, 0, {
        type: "spring",
        stiffness: 400,
        damping: 25,
      });
    }
  }

  if (!visible) return null;

  const showGrab = isDragging ? "cursor-grabbing" : "cursor-default";

  return (
    <div
      className="fixed bottom-0 left-0 w-full z-50 pointer-events-auto h-[100dvh]"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget && !isDragging) {
          toggleOpen();
        }
      }}
    >
      <motion.div
        className={`absolute top-[100px] w-full h-[${fullHeight}px] ${showGrab}`}
        style={{ height: fullHeight }}
      >
        <motion.div
          drag="y"
          dragConstraints={{ top: 0 }}
          style={{ y }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
          className="Glass rounded-t-4xl w-full h-full flex flex-col items-center pt-4"
        >
          <div
            className={`rounded-full w-40 h-2 bg-white/30 border-t border-white/40 shadow-[0_4px_10px_rgba(0,0,0,0.1)] cursor-grab ${showGrab}`}
          />
          <div className="mt-6 text-white">Overlay content...</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
