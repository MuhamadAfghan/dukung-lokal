import { useState, useRef, useEffect } from "react";
import { useDrag } from "@use-gesture/react";

export default function SlideUpDrawer({ children, isDrawerOpen, setDrawerOpen }) {
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef(null);
  const drawerTressholdHeight = 42;

  const getWindowHeight = () => {
    if (typeof window != "undefined") {
      return window.innerHeight;
    }
    return 0;
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const bind = useDrag(
    ({ movement: [_, my], down, velocity: [, vy] }) => {
      const drawer = drawerRef.current;
      if (!drawer) return;

      setIsDragging(true);

      const currentTransform = isDrawerOpen ? 0 : getWindowHeight();
      const newY = Math.max(
        0,
        Math.min(getWindowHeight(), currentTransform + my)
      );

      drawer.style.transform = `translateY(${newY}px)`;

      if (!down) {
        setIsDragging(false);
        const threshold = getWindowHeight() * 0.2;

        if (Math.abs(vy) > 0.5) {
          setDrawerOpen(vy < 0);
        } else {
          setDrawerOpen(newY < threshold);
        }
      }
    },
    {
      bounds: { top: 0, bottom: getWindowHeight() },
      rubberband: true,
      from: () => [0, isDrawerOpen ? 0 : getWindowHeight()],
    }
  );

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer || isDragging) return;

    drawer.style.transform = isDrawerOpen
      ? "translateY(0)"
      : "translateY(100%)";
  }, [isDrawerOpen, isDragging]);

  return (
    <div
      ref={drawerRef}
      {...bind()}
      className={`fixed bottom-0 z-10 translate-y-full  transition-transform duration-300  left-0 right-0 bg-white shadow-lg 
        border-t border-zinc-100`}
      style={{
        height: `calc(100dvh - ${drawerTressholdHeight}px)`,
        touchAction: "none",
      }}
    >
      {/* Drawer hook */}
      <div
        className="absolute cursor-pointer sm:w-2/3 md:w-1/2 flex items-center justify-center w-full h-[42px] -translate-x-1/2 bg-white border border-b-0 shadow-up rounded-t-2xl border-zinc-100 left-1/2"
        style={{ top: `-${drawerTressholdHeight}px` }}
        onClick={toggleDrawer}
      >
        <div className="h-2 w-[100px] rounded-full bg-zinc-300" />
      </div>

      {/* Drawer Content */}
      <div className="flex flex-col h-full pt-8">
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
