import { NextRequest, NextResponse } from "next/server";
import { browserAirlock } from "@/lib/browser-airlock";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid payload: 'url' is required." }, { status: 400 });
    }

    const result = await browserAirlock.inspectUrl(url);

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("Browser airlock error:", err);
    return NextResponse.json(
      { error: "Browser airlock execution failed.", details: err?.message },
      { status: 500 }
    );
  }
}
