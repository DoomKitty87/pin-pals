import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import QRClient from "./qrclient";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/logout-button";
import Pin from "@/components/pin/pin";
import FlippableCard from "@/components/flippable-card/FlippableCard";
import FlippableCardSide, { CardSide } from "@/components/flippable-card/FlippableCardSide";

export default async function Home() {
  const supabase = await createClient();

  // Check if the request url includes any query params (if user scanned a qr code)
  const fullUrl = (await headers()).get("x-url");
  const url = new URL(fullUrl || process.env.NEXT_PUBLIC_BASE_URL || '');
  const urlParams = url.searchParams
  console.log("URL Params:", urlParams.toString());

  // Make sure user is logged in
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    console.log("User not logged in");
    if (urlParams.has("targetId") && urlParams.has("timestamp")) {
      console.log("Redirecting to login with targetId and timestamp");
      const targetId = urlParams.get("targetId");
      const timestamp = urlParams.get("timestamp");
      redirect(`/auth/login?targetId=${targetId}&timestamp=${timestamp}`);
    } else {
      redirect("/auth/login");
    }
  } else {
    console.log("User is logged in:", data.user);
  }
  const cookieHeader = (await cookies()).toString();

  if (urlParams.has("targetId") && urlParams.has("timestamp")) {
    const targetId = urlParams.get("targetId");
    const timestamp = urlParams.get("timestamp");
    console.log("Scanned QR Code with targetId:", targetId, "and timestamp:", timestamp);

    // Check if timestamp is within acceptable range (e.g., 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    const timeDiff = now - Number(timestamp);
    const MAX_TIME_DIFF = 300; // 5 minutes in seconds

    if (timeDiff < 0 || timeDiff > MAX_TIME_DIFF) {
      console.warn("QR code timestamp is invalid or has expired.");
    } else {
      console.log("QR code timestamp is valid.");
      
      // Call route to log interaction
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/scanpin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: cookieHeader,
        },
        body: JSON.stringify({ targetId }),
      })
      .then(res => res.json())
      .then(data => {
        console.log("Logged interaction successfully:", data);
      })
      .catch(err => {
        console.error("Error logging interaction:", err);
      });
    }
  }

  // Call the internal API route to fetch user pins. Forward cookies so
  // the route handler can authenticate the request via next/headers.
  const pinsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/getpins`, {
    headers: {
      cookie: cookieHeader,
    },
    // ensure we always get fresh data for this protected page
    cache: 'no-store',
  });

  let pinsData: any = null;
  try {
    pinsData = await pinsRes.json();
  } catch (e) {
    pinsData = { error: 'Invalid JSON response from /api/getpins' };
  }

  console.log('Fetched pins data:', pinsData);

  return (
    <main className="min-h-screen flex flex-col items-center">
      <h1 className="text-6xl font-bold mt-2 mb-0" style={{ color: '#6b3d00', textShadow: '-5px 5px 0 #806742', fontSize: '80px', zIndex: 1 }}>Pin Pals!</h1>

      <div className="mt-3 mb-3 flex flex-col items-center">
        <FlippableCard className="w-[300px] h-[300px] flex flex-col items-center text-center text-2x1">
          <FlippableCardSide side={CardSide.FRONT} >
            <Pin userId={data.user.id} size={300} score={0} />
          </FlippableCardSide>
          <FlippableCardSide side={CardSide.BACK} >
            <QRClient targetId={data.user.id} />
          </FlippableCardSide>
        </FlippableCard>
        <label className="m-1 text-[20px]">Press To Flip!</label>
      </div>

      <Card className="w-5/6 max-w-3xl mb-4">
        <CardHeader>
          <CardTitle className="text-2xl mb-0" style={{ marginBottom: '-35px' }}>My Collection</CardTitle>
        </CardHeader>
        <div style={{ padding: '20px'}}>
          {!pinsRes.ok ? (
            <div className="text-red-600">Error fetching pins: {pinsRes.status} {pinsData?.error}</div>
          ) : (
            <div>{
                <ul className="grid gap-3 grid-cols-3">
                  {pinsData.map((pin: any, idx: number) => (
                    <li key={idx}><Pin userId={pin.other_user_id === data.user.id ? pin.user_id : pin.other_user_id} size={100} score={pin.times_interacted} /></li>
                  ))}
                </ul>
            }</div>
          )}
        </div>
      </Card>
      <div style={{ marginBottom: '15px' }}>
        <LogoutButton />
      </div>
    </main>
  );
}
