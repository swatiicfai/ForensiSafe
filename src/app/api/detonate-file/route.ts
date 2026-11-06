import { NextRequest, NextResponse } from "next/server";
import { sandboxManager } from "@/lib/sandbox-manager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, fileContent, isSimulatedMalware } = body;

    if (!filename || typeof fileContent !== "string") {
      return NextResponse.json(
        { error: "Invalid payload: 'filename' and 'fileContent' are required." },
        { status: 400 }
      );
    }

    const report = await sandboxManager.executeAndDetonate({
      filename,
      fileContent,
      isSimulatedMalware: Boolean(isSimulatedMalware),
    });

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error("Detonation error:", err);
    return NextResponse.json(
      { error: "Detonation failed inside Vultr sandbox.", details: err?.message },
      { status: 500 }
    );
  }
}
