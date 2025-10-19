import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Call the internal API route to fetch user pins. Forward cookies so
  // the route handler can authenticate the request via next/headers.
  const cookieHeader = cookies().toString();
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

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(data.claims, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>

      <div>
        <h2 className="font-bold text-2xl mb-4">Your pins</h2>
        {!pinsRes.ok ? (
          <div className="text-red-600">Error fetching pins: {pinsRes.status} {pinsData?.error}</div>
        ) : pinsData == null ? (
          <div>No pins returned.</div>
        ) : Array.isArray(pinsData.pins) ? (
          <ul className="grid gap-3">
            {pinsData.pins.map((pin: any, idx: number) => (
              <li key={idx} className="p-3 border rounded">
                <pre className="text-sm font-mono overflow-auto">{JSON.stringify(pin, null, 2)}</pre>
              </li>
            ))}
          </ul>
        ) : (
          <pre className="text-sm font-mono p-3 rounded border">{JSON.stringify(pinsData, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
