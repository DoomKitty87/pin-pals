import TopPage from "./app/pages/topQR/page";
import MiddlePage from "./app/page";
import BottomPage from "./app/pages/bottomInventory/page";
import { useEffect, useRef } from "react";

export default function SwipeStack() {
  const ref = useRef<HTMLDivElement>(null);

  // Start centered on the middle page
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const middle = el.children[1] as HTMLElement;
    middle?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div
      ref={ref}
      className="snap-y"
      style={{
        height: "100vh",
        overflowY: "auto",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <TopPage />
      <MiddlePage />
      <BottomPage />
    </div>
  );
}
