import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

export const TargetCursor = ({
  targetSelector = "a:not(.no-cursor), button:not(.no-cursor), .cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
}: TargetCursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Only apply on devices with a fine pointer (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current;
    const corners = cornersRef.current;

    if (!cursor) return;

    // Force GSAP to handle centering properly
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    if (hideDefaultCursor) {
      document.body.style.cursor = "none";
      // Also inject a style tag to force hide default cursor on interactive elements
      const style = document.createElement("style");
      style.id = "target-cursor-style";
      style.innerHTML = `
        * { cursor: none !important; }
      `;
      document.head.appendChild(style);
    }

    let isHovering = false;
    let currentRotation = 0;

    // We manually update rotation so we can gracefully take over
    const updateRotation = () => {
      currentRotation = (currentRotation + (360 / (spinDuration * 60))) % 360;
      if (!isHovering) {
        gsap.set(cursor, { rotation: currentRotation });
      }
    };

    gsap.ticker.add(updateRotation);

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const target = (e.target as Element).closest(targetSelector);

      if (target) {
        if (!isHovering) {
          isHovering = true;
          
          // Calculate the nearest 180-degree angle to our current rotation for a smooth snap
          // Snapping to 180 instead of 90 ensures the width/height axes aren't visually swapped!
          const nearest180 = Math.round(currentRotation / 180) * 180;
          
          gsap.to(cursor, { 
            rotation: nearest180, 
            duration: hoverDuration, 
            ease: "back.out(1.2, 0.8)",
            overwrite: "auto" 
          });
        }

        const rect = target.getBoundingClientRect();
        const { left, top, width, height } = rect;

        // Apply a slight padding to the target box
        const padding = 12;

        gsap.to(cursor, {
          x: left + width / 2,
          y: top + height / 2,
          width: width + padding,
          height: height + padding,
          borderRadius: "12px",
          duration: hoverDuration,
          ease: "power3.out",
          overwrite: "auto"
        });

        if (parallaxOn) {
          const relX = (clientX - (left + width / 2)) / (width / 2);
          const relY = (clientY - (top + height / 2)) / (height / 2);

          corners.forEach((corner) => {
            if (!corner) return;
            const factor = 4;
            gsap.to(corner, {
              x: relX * factor,
              y: relY * factor,
              duration: hoverDuration,
              ease: "power3.out"
            });
          });
        }
      } else {
        if (isHovering) {
          isHovering = false;
          // Sync our tracker to wherever the tween left off
          const currentRotationStr = gsap.getProperty(cursor, "rotation") as string;
          currentRotation = parseFloat(currentRotationStr) || 0;
        }

        gsap.to(cursor, {
          x: clientX,
          y: clientY,
          width: 32,
          height: 32,
          borderRadius: "50%",
          duration: 0.15,
          ease: "power2.out",
          overwrite: "auto"
        });

        corners.forEach((corner) => {
          if (!corner) return;
          gsap.to(corner, { x: 0, y: 0, duration: 0.15, ease: "power2.out" });
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(updateRotation);
      if (hideDefaultCursor) {
        document.body.style.cursor = "auto";
        const style = document.getElementById("target-cursor-style");
        if (style) style.remove();
      }
    };
  }, [targetSelector, spinDuration, hideDefaultCursor, hoverDuration, parallaxOn]);

  return (
    <div
      ref={cursorRef}
      className="hidden md:flex pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 32,
        height: 32,
        boxSizing: "border-box",
        border: "1.5px solid var(--accent-primary)",
        borderRadius: "50%",
        zIndex: 99999,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 10px rgba(255, 149, 0, 0.3)",
        background: "rgba(255, 149, 0, 0.05)",
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => { cornersRef.current[i] = el; }}
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            borderTop: i < 2 ? "2px solid var(--accent-primary)" : "none",
            borderBottom: i >= 2 ? "2px solid var(--accent-primary)" : "none",
            borderLeft: i % 2 === 0 ? "2px solid var(--accent-primary)" : "none",
            borderRight: i % 2 !== 0 ? "2px solid var(--accent-primary)" : "none",
            top: i < 2 ? -2 : "auto",
            bottom: i >= 2 ? -2 : "auto",
            left: i % 2 === 0 ? -2 : "auto",
            right: i % 2 !== 0 ? -2 : "auto",
          }}
        />
      ))}
    </div>
  );
};
