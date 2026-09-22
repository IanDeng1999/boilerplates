import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.unnamedapp",
  appName: "Unnamed App",
  webDir: "dist",

  // 本地开发 APK Hot Relaod
  // server: {
  //   url: "http://10.74.23.224:2121",
  //   cleartext: true,
  // },
};

export default config;
