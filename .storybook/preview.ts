import type { Preview } from '@storybook/vue3'
import { createPinia } from 'pinia'
import { setup } from '@storybook/vue3'

// Import global styles
import '../src/assets/colors.css'
import '../src/style.css' // Add this if you have a global style.css file

setup((app) => {
  const pinia = createPinia()
  app.use(pinia)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'var(--gray-50)',
        },
      ],
    },
    docs: {
      story: {
        inline: true,
        iframeHeight: '500px',
      },
      canvas: {
        backgroundColor: 'var(--gray-50)',
      },
    },
  },
};

export default preview;