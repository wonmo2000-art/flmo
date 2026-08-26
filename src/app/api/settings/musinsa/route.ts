import { NextResponse } from "next/server";
import { z } from "zod";

import { getSettingsView, updateSection } from "@/lib/settings/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  brandName: z.string().trim().max(80).optional(),
  storeUrl: z.string().trim().url("스토어 URL 형식이 올바르지 않습니다.").or(z.literal("")).optional(),
  utmSource: z.string().trim().min(1, "utm_source 를 입력하세요.").max(40),
  utmMedium: z.string().trim().min(1, "utm_medium 을 입력하세요.").max(40),
  utmCampaign: z.string().trim().max(60).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  await updateSection("musinsa", {
    brandName: parsed.data.brandName || undefined,
    storeUrl: parsed.data.storeUrl || undefined,
    utmSource: parsed.data.utmSource,
    utmMedium: parsed.data.utmMedium,
    utmCampaign: parsed.data.utmCampaign || undefined,
  });

  return NextResponse.json(await getSettingsView());
}
