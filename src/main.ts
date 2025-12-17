import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { he } from 'vuetify/locale'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  rtl: true,
  locale: {
    locale: 'he',
    messages: { he },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1565C0',
          secondary: '#0D47A1',
          accent: '#E3F2FD',
          background: '#F5F7FA',
          surface: '#FFFFFF',
          error: '#EF7674',
          'silver-gray': '#78909C',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
