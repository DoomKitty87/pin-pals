"use client";

import { clear } from "console";
import { useQRCode } from "next-qrcode";
import { useEffect, useRef, useState } from "react";

interface QRClientProps {
    targetId: string;
};

export default function QRClient({targetId}: QRClientProps) {
  const { SVG } = useQRCode();

  const [size, setSize] = useState(0);
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp( Math.floor(Date.now() / 1000) );
    }, 30000);

    const container = containerRef.current;
    if (container) {
      const newSize = Math.min(container.offsetHeight, container.offsetWidth);
      setSize(newSize - 5);
    }

    return () => clearInterval(interval);
  });

  return (
    <div ref={containerRef} className="w-full h-full flex justify-center items-center">
      <SVG
        text={`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/?targetId=${targetId}&timestamp=${timestamp}`}
        options={{ width: size }}
      />
    </div>
  );
}