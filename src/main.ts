import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/colors.css'
import './style.css'
import App from './App.vue'
import { StatsigClient } from '@statsig/js-client';
import { StatsigSessionReplayPlugin } from '@statsig/session-replay';
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics';

const app = createApp(App)
const pinia = createPinia()
const SDK_KEY = import.meta.env.VITE_SDK_KEY as string;

app.use(pinia)
app.mount('#app')

const defaultUserID = `user-${Math.random().toString(12).substring(2, 10)}`;

// Initialize Statsig analytics if key is provided
if (SDK_KEY) {
    const statsigClient = new StatsigClient(
  SDK_KEY,
  { userID: defaultUserID },
  {
    plugins: [
      new StatsigSessionReplayPlugin(),
      new StatsigAutoCapturePlugin(),
    ],
  }
);

(async () => {
    await statsigClient.initializeAsync();
    app.config.globalProperties.$statsig = statsigClient;
    // Log app open event
    statsigClient.logEvent("app_opened", defaultUserID);
  })();
}
