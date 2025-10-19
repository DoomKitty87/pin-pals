"use client";

import { useQRCode } from "next-qrcode";

export function QRClient({ targetId }: { targetId: string }) {
  const { SVG } = useQRCode();
  return (
    <SVG
      text={`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/?targetId=${targetId}&timestamp=${Math.floor(Date.now() / 1000)}`}
      options={{ width: 150 }}
    />
  );
}