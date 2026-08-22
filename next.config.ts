import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许手机通过局域网 IP 访问开发服务器，否则客户端 JS 不下发，页面会变纯静态
  allowedDevOrigins: ["192.168.2.15"],
};

export default nextConfig;
