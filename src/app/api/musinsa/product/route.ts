import { NextResponse } from "next/server";
import { z } from "zod";

import { fetchMusinsaProduct } from "@/lib/musinsa/product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ url: z.string().trim().min(1, "상품 URL 을 입력하세요.") });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await fetchMusinsaProduct(parsed.data.url));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
