<template>
  <v-footer class="footer" color="primary">
    <v-container>
      <v-row class="footer-row">
        <v-col cols="12" md="4" class="text-center text-md-left">
          <h3 class="footer-title">יצירת קשר</h3>
          <div class="contact-info">
            <div class="contact-item">
              <v-icon icon="mdi-phone" size="20" />
              <span>054-8470845</span>
            </div>
            <div class="contact-item">
              <v-icon icon="mdi-email" size="20" />
              <a href="mailto:cbt33cbt@gmail.com" class="email-link">cbt33cbt@gmail.com</a>
            </div>
            <div class="contact-item">
              <v-icon icon="mdi-map-marker" size="20" />
              <span>כהנמן 161, בני ברק</span>
            </div>
            <div class="social-icons mt-4">
              <v-btn icon size="small" variant="text" href="https://www.youtube.com" target="_blank">
                <v-icon icon="mdi-youtube" />
              </v-btn>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="4" class="text-center">
          <h3 class="footer-title">קישורים מהירים</h3>
          <div class="footer-links">
            <router-link v-for="link in footerLinks" :key="link.path" :to="link.path" class="footer-link">
              {{ link.title }}
            </router-link>
          </div>
        </v-col>

        <v-col cols="12" md="4" class="text-center text-md-right">
          <div class="footer-logo">
            <v-icon icon="mdi-compass" size="32" color="white" />
            <span class="footer-logo-text">סולתרפיה</span>
          </div>
          <p class="mt-4 footer-text">
            גישה טיפולית המעודדת סקרנות ולמידה - ליווי אישי במסע של גילוי עצמי וצמיחה
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-6" color="white" opacity="0.3" />

      <v-row>
        <v-col cols="12" class="text-center">
          <p class="copyright">
            &copy; {{ currentYear }} סולתרפיה. כל הזכויות שמורות.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const footerLinks = [
  { title: 'בית', path: '/' },
  { title: 'מהי סולתרפיה', path: '/what-is-soltherapy' },
  { title: 'חברת סקרנות ולמידה', path: '/groups' },
  { title: 'אודות משה יצחק', path: '/about' },
  { title: 'יצירת קשר', path: '/contact' },
]
</script>

<style scoped>
.footer {
  padding: 48px 0 24px;
  color: white;
}

.footer-row {
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

@media (min-width: 960px) {
  .footer-logo {
    justify-content: flex-end;
  }
}

.footer-logo-text {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.footer-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-size: 14px;
}

.footer-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-link:hover {
  color: white;
  text-decoration: underline;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

@media (min-width: 960px) {
  .contact-info {
    align-items: flex-start;
  }
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.email-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.3s;
}

.email-link:hover {
  color: white;
  text-decoration: underline;
}

.social-icons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

@media (min-width: 960px) {
  .social-icons {
    justify-content: flex-start;
  }
}

.copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}
</style>

