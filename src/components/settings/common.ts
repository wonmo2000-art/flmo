"use client";

import type { SettingsView } from "@/lib/settings/store";

export type Feedback = { kind: "error" | "success" | "info"; message: string } | null;

export interface SectionProps {
  settings: SettingsView;
  onUpdate: (next: SettingsView) => void;
}

/** 설정 API 를 호출하고 갱신된 설정을 반환한다. 실패하면 서버 메시지를 그대로 던진다. */
export async function submit(
  path: string,
  init: RequestInit & { json?: unknown },
): Promise<SettingsView> {
  const { json, ...rest } = init;
  const response = await fetch(path, {
    ...rest,
    headers: json ? { "Content-Type": "application/json" } : undefined,
    body: json ? JSON.stringify(json) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? "요청에 실패했습니다.");
  }
  return data as SettingsView;
}
