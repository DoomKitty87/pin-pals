import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { headers } from "next/headers";

export default async function Home() {
  const supabase = await createClient();

  // Make sure user is logged in
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    console.log("User not logged in");
    redirect("/auth/login");
  } else {
    console.log("User is logged in:", data.user);
  }
  const cookieHeader = (await cookies()).toString();

  // Check if the request url includes any query params (if user scanned a qr code)
  const fullUrl = (await headers()).get("x-url");
  const url = new URL(fullUrl || process.env.NEXT_PUBLIC_BASE_URL || '');
  const urlParams = url.searchParams
  console.log("URL Params:", urlParams.toString());
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



      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Next.js Supabase Starter</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">Next steps</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
