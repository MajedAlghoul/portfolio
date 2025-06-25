"use client";

import { motion, useAnimation, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import NavButton from "./NavButton";
import CtaButton from "./CtaButton";
import { usePathname } from "next/dist/client/components/navigation";
import ColorDrop from "./ColorDrop";
import { useThemeSelect } from "@/contexts/ThemeSelectContext";

export default function Notch() {
  const scrollYMotion = useMotionValue(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scale, setScale] = useState(1);
  const circleControls = useAnimation();
  const navControls = useAnimation();
  const pathname = usePathname();
  const { isThemeSelectOpen } = useThemeSelect();

  // Calculate responsive scale based on screen width
  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;

      // Base widths for desktop
      const baseNavWidth = 502;
      const baseExpandedWidth = 562;

      // Calculate total width needed (nav + circle + some padding)
      const totalWidthNeeded = baseExpandedWidth + 60 + 32; // nav + circle + padding

      // Calculate scale factor for width
      let widthScale = 1;
      if (screenWidth < totalWidthNeeded) {
        widthScale = Math.max(0.4, (screenWidth - 64) / totalWidthNeeded); // Min scale 0.3, with 64px total padding
      }

      setScale(widthScale);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  // Scaled values
  const scaledNavWidth = Math.round(502 * scale); // Adjusted for better fit
  const scaledExpandedWidth = Math.round(562 * scale);
  const scaledHeight = Math.max(38, Math.round(60 * scale)); // Height stops at 48px minimum
  const scaledCircleSize = Math.max(38, Math.round(60 * scale)); // Circle stops at 48px minimum

  // Calculate centered positioning
  const totalWidth = scaledExpandedWidth + scaledCircleSize;
  const navLeftOffset = totalWidth / 2;
  const circleLeftOffset = (scaledExpandedWidth - scaledCircleSize) / 3.4;

  const circleVariants = {
    start: {
      x: scaledExpandedWidth - scaledNavWidth,
      borderRadius: "30px 30px 30px 30px",
      opacity: 1,
    },
    merge: {
      x: scaledExpandedWidth - scaledNavWidth - 28,
      borderRadius: "0px 30px 30px 0px",
      opacity: 0,
      transition: {
        x: {
          type: "spring" as const,
          stiffness: 200,
          damping: 20,
          duration: 0.9,
        },
        borderRadius: {
          type: "spring" as const,
          stiffness: 200,
          damping: 20,
          duration: 0.4,
        },
        opacity: {
          type: "spring" as const,
          stiffness: 200,
          damping: 20,
          delay: 0.2,
          duration: 0.3,
        },
      },
    },
  };

  const navVariants = {
    start: {
      width: scaledNavWidth,
      borderRadius: "30px 30px 30px 30px",
    },
    flat: {
      width: scaledNavWidth,
      borderRadius: "30px 0px 0px 30px",
      transition: {
        borderRadius: {
          type: "spring" as const,
          stiffness: 200,
          damping: 20,
          duration: 0.4,
        },
      },
    },
    expanded: {
      width: scaledExpandedWidth,
      borderRadius: "30px 30px 30px 30px",
      transition: {
        width: {
          type: "spring" as const,
          stiffness: 200,
          damping: 20,
          duration: 0.3,
        },
        borderRadius: {
          type: "spring" as const,
          stiffness: 200,
          damping: 20,
          duration: 0.3,
        },
      },
    },
    contracted: {
      width: scaledNavWidth,
      borderRadius: "30px 30px 30px 30px",
      transition: {
        width: {
          type: "spring" as const,
          stiffness: 200,
          damping: 20,
          duration: 0.3,
        },
      },
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollYMotion.set(currentScrollY);
      setIsScrolled(currentScrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollYMotion]);

  useEffect(() => {
    if (isScrolled || isThemeSelectOpen) {
      navControls.start("flat");
      circleControls.start("merge");
      setTimeout(() => {
        navControls.start("expanded");
      }, 200);
      setTimeout(() => {
        navControls.start("contracted");
      }, 500);
    } else {
      circleControls.start({
        x: scaledExpandedWidth - scaledNavWidth - 4,
        borderRadius: "0px 30px 30px 0px",
        opacity: 1,
        transition: {
          x: { type: "spring", stiffness: 200, damping: 20, duration: 0.3 },
          borderRadius: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.3,
          },
          opacity: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.3,
          },
        },
      });
      navControls.start("flat");
      setTimeout(() => {
        circleControls.start("start");
        navControls.start("start");
      }, 200);
    }
  }, [isScrolled, circleControls, navControls, isThemeSelectOpen, scale]);

  return (
    <div
      style={{
        fontSize: `${Math.max(10, 12 * scale)}px`,
      }}
    >
      <motion.div
        className="fixed top-4 z-50 Glass"
        variants={navVariants}
        initial="start"
        animate={navControls}
        style={{
          height: `${scaledHeight}px`,
          left: `calc(50% - ${navLeftOffset}px)`,
        }}
      >
        <div className="flex items-center justify-between h-full text-white pr-[12px]">
          <NavButton isOn={pathname === "/"} link="/">
            I
          </NavButton>
          <NavButton isOn={pathname === "/projects"} link="/projects">
            Projects
          </NavButton>
          <NavButton isOn={pathname === "/themes"} link="/themes">
            Themes
          </NavButton>
          <NavButton isOn={pathname === "/pictures"} link="/pictures">
            Pictures
          </NavButton>
          <CtaButton>Connect</CtaButton>
        </div>
      </motion.div>

      <motion.div
        className="fixed top-4 z-40 Glass"
        variants={circleVariants}
        initial="start"
        animate={circleControls}
        style={{
          left: `calc(50% + ${circleLeftOffset}px)`,
          width: `${scaledCircleSize}px`,
          height: `${scaledCircleSize}px`,
        }}
      >
        <div className="flex items-center justify-center h-full text-white font-medium text-xl">
          <ColorDrop />
        </div>
      </motion.div>
    </div>
  );
}
