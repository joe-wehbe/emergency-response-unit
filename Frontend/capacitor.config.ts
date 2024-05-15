import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'lb.edu.lau.eru',
  appName: 'ERU',
  webDir: 'www',
  server: {
    androidScheme: 'http'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
