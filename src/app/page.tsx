import { redirect } from "next/navigation";

import { getSettingsView } from "@/lib/settings/store";

export const dynamic = "force-dynamic";

/** 연결이 끝났으면 리포트로, 아니면 설정 화면으로 보낸다. */
export default async function Home() {
  let configured = false;
  try {
    configured = (await getSettingsView()).meta.configured;
  } catch {
    // 암호화 키 미설정 등으로 읽기에 실패하면 설정 화면에서 안내한다.
    configured = false;
  }

  redirect(configured ? "/report" : "/settings");
}
