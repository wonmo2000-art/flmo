"use client";

import { useState } from "react";

import type { SettingsView } from "@/lib/settings/store";

import AnthropicSection from "./AnthropicSection";
import McpSection from "./McpSection";
import MetaSection from "./MetaSection";
import MusinsaSection from "./MusinsaSection";

type TabId = "meta" | "musinsa" | "anthropic" | "mcp";

export default function SettingsPanel({ initial }: { initial: SettingsView }) {
  const [settings, setSettings] = useState(initial);
  const [tab, setTab] = useState<TabId>("meta");

  const tabs: { id: TabId; label: string; on: boolean }[] = [
    { id: "meta", label: "메타 광고", on: settings.meta.configured },
    { id: "musinsa", label: "무신사", on: Boolean(settings.musinsa.brandName) },
    { id: "anthropic", label: "Claude API", on: settings.anthropic.configured },
    {
      id: "mcp",
      label: `MCP 커넥터${settings.mcp.length ? ` (${settings.mcp.length})` : ""}`,
      on: settings.mcp.some((server) => server.lastCheck?.ok),
    },
  ];

  const props = { settings, onUpdate: setSettings };

  return (
    <>
      <div className="tabs">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            data-active={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
            <span className="dot" data-on={item.on} />
          </button>
        ))}
      </div>

      {tab === "meta" && <MetaSection {...props} />}
      {tab === "musinsa" && <MusinsaSection {...props} />}
      {tab === "anthropic" && <AnthropicSection {...props} />}
      {tab === "mcp" && <McpSection {...props} />}
    </>
  );
}
