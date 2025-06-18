"use client";

import { motion, useAnimation, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import NavButton from "./NavButton";
import CtaButton from "./CtaButton";
import { usePathname } from "next/dist/client/components/navigation";
import ColorDrop from "./ColorDrop";

export default function Notch() {
  const scrollYMotion = useMotionValue(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const circleControls = useAnimation();
  const navControls = useAnimation();
  const pathname = usePathname();

  const circleVariants = {
    start: {
      x: 176,
      borderRadius: "30px 30px 30px 30px",
      opacity: 1,
    },
    merge: {
      x: 148,
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
      width: 502,
      borderRadius: "30px 30px 30px 30px",
    },
    flat: {
      width: 502,
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
      width: 562,
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
      width: 502,
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
    if (isScrolled) {
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
        x: 140,
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
  }, [isScrolled, circleControls, navControls]);

  return (
    <div className="text-[12px]">
      <motion.div
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 Glass"
        variants={navVariants}
        initial="start"
        animate={navControls}
        style={{ height: "60px" }}
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
        className="fixed top-8 z-40 Glass"
        variants={circleVariants}
        initial="start"
        animate={circleControls}
        style={{
          left: `calc(50% + 100px)`,
          width: "60px",
          height: "60px",
        }}
      >
        <div className="flex items-center justify-center h-full text-white font-medium text-xl">
          <ColorDrop></ColorDrop>
        </div>
      </motion.div>
    </div>
  );
}
