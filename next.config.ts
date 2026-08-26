import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 자격증명은 서버에서만 다룬다. 클라이언트 번들로 새어나가지 않도록
  // NEXT_PUBLIC_ 접두사가 붙은 값 외에는 노출하지 않는다.
  reactStrictMode: true,
};

export default nextConfig;
