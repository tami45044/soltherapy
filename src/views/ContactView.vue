<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="contact-header">
      <div class="hero-background">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
        <div class="decorative-shape shape-1"></div>
        <div class="decorative-shape shape-2"></div>
      </div>
      <v-container style="position: relative; z-index: 1;">
        <v-row align="center" justify="center" class="py-12">
          <v-col cols="12" class="text-center">
            <div class="hero-icon-wrapper mb-6">
              <div class="icon-bg-circle"></div>
              <v-icon icon="mdi-email-heart-outline" size="64" class="hero-icon" />
            </div>
            <h1 class="page-title">יצירת קשר</h1>
            <p class="page-subtitle mt-4">מוזמנים לשאול, לחקור ולהתחיל את המסע</p>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Contact Content -->
    <v-container class="py-16">
      <v-row class="contact-row">
        <!-- Contact Form -->
        <v-col cols="12" md="7" class="order-2 order-md-1">
          <v-card class="contact-form-card" elevation="4" rounded="xl">
            <v-card-text class="pa-8" >
              <h2 class="form-title mb-6">שלחו לנו הודעה</h2>
              <v-form ref="form" v-model="valid">
                <v-row class="form-row">
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.lastName"
                      label="שם משפחה *"
                      variant="outlined"
                      :rules="[rules.required]"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.firstName"
                      label="שם פרטי *"
                      variant="outlined"
                      :rules="[rules.required]"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.phone"
                      label="טלפון *"
                      variant="outlined"
                      :rules="[rules.required]"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.email"
                      label="אימייל *"
                      variant="outlined"
                      :rules="[rules.required, rules.email]"
                      type="email"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="formData.subject"
                      label="נושא הפנייה *"
                      :items="subjects"
                      variant="outlined"
                      :rules="[rules.required]"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.message"
                      label="הודעה *"
                      variant="outlined"
                      :rules="[rules.required]"
                      rows="5"
                      rounded="lg"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-checkbox v-model="formData.agree" :rules="[rules.required]" >
                      <template #label>
                        <span class="checkbox-label">אני מסכים/ה לתנאי השימוש ולמדיניות הפרטיות *</span>
                      </template>
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      color="primary"
                      size="x-large"
                      rounded="lg"
                      :disabled="!valid"
                      @click="submitForm"
                      class="px-12"
                    >
                      <v-icon icon="mdi-send" start />
                      שלח הודעה
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <!-- Success Message -->
              <v-alert v-if="showSuccess" type="success" variant="tonal" class="mt-6" rounded="lg">
                <v-alert-title>ההודעה נשלחה בהצלחה!</v-alert-title>
                נחזור אליך בהקדם האפשרי.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Contact Info -->
        <v-col cols="12" md="5" class="order-1 order-md-2">
          <v-card class="contact-info-card" elevation="0">
            <v-card-text class="pa-8" >
              <h2 class="info-title mb-8">
                  <v-icon icon="mdi-information-outline" size="small" color="primary" class="me-2" />
                  פרטי התקשרות
              </h2>

              <div class="info-items">
                <v-card class="info-card mb-4" elevation="0">
                  <v-card-text class="pa-4">
                    <div class="info-item">
                      <div class="info-icon-wrapper">
                        <v-icon icon="mdi-map-marker" size="28" color="primary" />
                      </div>
                      <div class="info-content">
                        <h4 class="info-label">כתובת</h4>
                        <p class="info-text">כהנמן 161, בני ברק</p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card class="info-card mb-4" elevation="0">
                  <v-card-text class="pa-4">
                    <div class="info-item">
                      <div class="info-icon-wrapper">
                        <v-icon icon="mdi-phone" size="28" color="primary" />
                      </div>
                      <div class="info-content">
                        <h4 class="info-label">טלפון</h4>
                        <p class="info-text">054-8470845</p>
                        <p class="info-text-small">זמינה: ראשון-חמישי 9:00-20:00</p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card class="info-card mb-4" elevation="0">
                  <v-card-text class="pa-4">
                    <div class="info-item">
                      <div class="info-icon-wrapper">
                        <v-icon icon="mdi-email" size="28" color="primary" />
                      </div>
                      <div class="info-content">
                        <h4 class="info-label">אימייל</h4>
                        <p class="info-text">cbt33cbt@gmail.com</p>
                        <p class="info-text-small">מענה תוך 24 שעות</p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card class="info-card mb-4" elevation="0">
                  <v-card-text class="pa-4">
                    <div class="info-item">
                      <div class="info-icon-wrapper">
                        <v-icon icon="mdi-clock-outline" size="28" color="primary" />
                      </div>
                      <div class="info-content">
                        <h4 class="info-label">שעות פעילות</h4>
                        <p class="info-text">ראשון-חמישי: 9:00-20:00</p>
                        <p class="info-text">שישי: 9:00-14:00</p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- FAQ Section -->
    <v-container fluid class="faq-section py-16">
      <div class="floating-shapes">
        <div class="floating-shape shape-circle"></div>
        <div class="floating-shape shape-square"></div>
      </div>
      <v-container style="position: relative; z-index: 1;">
        <div class="text-center mb-12">
          <div class="section-badge mb-4">
            <v-icon icon="mdi-help-circle-outline" start size="small" />
            שאלות ותשובות
          </div>
          <h2 class="section-title">שאלות נפוצות</h2>
        </div>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-expansion-panels variant="accordion" class="faq-panels">
              <v-expansion-panel v-for="(faq, index) in faqs" :key="faq.question" class="faq-panel">
                <v-expansion-panel-title class="faq-question">
                  <div class="faq-title-content">
                    <span>{{ faq.question }}</span>
                    <div class="faq-number">{{ index + 1 }}</div>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="faq-answer">
                  <div class="faq-answer-content">
                    <v-icon icon="mdi-check-circle" color="primary" size="small" class="me-2" />
                    {{ faq.answer }}
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>

        <!-- Map Section -->
        <v-row justify="center" class="mt-12">
          <v-col cols="12" md="10">
            <div class="text-center mb-8">
              <div class="section-badge mb-4">
                <v-icon icon="mdi-map" start size="small" />
                מיקום המרפאה
              </div>
              <h2 class="section-title">איך מגיעים</h2>
            </div>
            <v-card class="map-card" elevation="4" rounded="xl">
              <v-card-text class="pa-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.3573885892946!2d34.83528!3d32.08352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b7d7f3e3e3b%3A0x3e3e3e3e3e3e3e3e!2z15vXlNeg157ztCAxNjEsINeR16DXmSDXkdeo16w!5e0!3m2!1siw!2sil!4v1234567890123!5m2!1siw!2sil"
                  width="100%"
                  height="450"
                  style="border:0; border-radius: 24px;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const valid = ref(false)
const showSuccess = ref(false)

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  agree: false,
})

const subjects = [
  'פגישת היכרות',
  'שאלה כללית',
  'טיפול אישי',
  'טיפול זוגי',
  'טיפול משפחתי',
  'הרצאה',
  'אחר',
]

const rules = {
  required: (value: string | boolean) => !!value || 'שדה חובה',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'כתובת אימייל לא תקינה'
  },
}

const faqs = [
  {
    question: '? איך אפשר לקבוע פגישה',
    answer:
      'אפשר לקבוע פגישה בטלפון או דרך טופס יצירת הקשר באתר. נחזור אליכם בהקדם לתיאום מועד.',
  },
  {
    question: '? מה המחיר לפגישה',
    answer:
      'המחיר משתנה בהתאם לסוג הטיפול. בפגישת ההיכרות נדבר על כל הפרטים הכספיים והאפשרויות השונות.',
  },
  {
    question: '? איפה מתקיימות הפגישות',
    answer: 'הפגישות מתקיימות במרחב טיפולי נעים ושקט בכהנמן 161, בני ברק, קרוב לתחבורה ציבורית.',
  },
  {
    question: '? האם יש חניה',
    answer: 'כן, ישנה חניה ציבורית בקרבת מקום וגם אפשרויות חניה ברחוב.',
  },
]

function submitForm() {
  if (valid.value) {
    // Here you would normally send the form data to your backend
    showSuccess.value = true

    // Reset form after 3 seconds
    setTimeout(() => {
      showSuccess.value = false
      formData.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agree: false,
      }
    }, 3000)
  }
}
</script>

<style scoped>
.contact-header {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%);
  color: #0D47A1;
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  animation: float 20s infinite ease-in-out;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
}

.cloud-1 {
  width: 108px;
  height: 37px;
  top: 13%;
  left: 13%;
  animation-delay: 0s;
}

.cloud-1::before {
  width: 47px;
  height: 47px;
  top: -23px;
  left: 11px;
}

.cloud-1::after {
  width: 51px;
  height: 25px;
  top: -12px;
  right: 11px;
}

.cloud-2 {
  width: 127px;
  height: 41px;
  top: 63%;
  right: 17%;
  animation-delay: -7s;
}

.cloud-2::before {
  width: 54px;
  height: 54px;
  top: -27px;
  left: 17px;
}

.cloud-2::after {
  width: 64px;
  height: 32px;
  top: -16px;
  right: 17px;
}

.cloud-3 {
  width: 93px;
  height: 32px;
  top: 37%;
  right: 27%;
  animation-delay: -14s;
}

.cloud-3::before {
  width: 41px;
  height: 41px;
  top: -19px;
  left: 11px;
}

.cloud-3::after {
  width: 47px;
  height: 23px;
  top: -11px;
  right: 11px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(-15px) translateX(5px);
  }
}

.decorative-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.shape-1 {
  width: 258px;
  height: 258px;
  background: #1565C0;
  top: -83px;
  right: -83px;
  animation: pulse 8s infinite ease-in-out;
}

.shape-2 {
  width: 188px;
  height: 188px;
  background: #0D47A1;
  bottom: -43px;
  left: -43px;
  animation: pulse 6s infinite ease-in-out reverse;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.15;
  }
}

.hero-icon-wrapper {
  position: relative;
  display: inline-block;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.icon-bg-circle {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  box-shadow: 0 10px 40px rgba(21, 101, 192, 0.3);
}

.hero-icon {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 8px rgba(21, 101, 192, 0.3));
  color: #1565C0 !important;
}

.page-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
}

.page-subtitle {
  font-size: clamp(1rem, 3vw, 1.25rem);
  opacity: 0.95;
}

.contact-row {
}

.contact-info-card {
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.3), rgba(255, 255, 255, 0.9));
  border: 1px solid #E3F2FD;
  border-radius: 24px !important;
  height: 100%;
}

.info-title {
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.info-items {
}

.info-card {
  background: white;
  border: 1px solid #E3F2FD;
  border-radius: 16px !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #1565C0, #90CAF9);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-card:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 20px rgba(21, 101, 192, 0.12);
  border-color: #90CAF9;
}

.info-card:hover::before {
  opacity: 1;
}

.info-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.8), rgba(187, 222, 251, 0.8));
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.info-card:hover .info-icon-wrapper {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.2);
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 4px;
}

.info-text {
  font-size: 1.0625rem;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 4px;
  line-height: 1.6;
}

.info-text-small {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.5;
}

.social-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.social-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 8px 20px rgba(21, 101, 192, 0.25);
}

.contact-form-card {
  height: 100%;
  border: 1px solid #E3F2FD;
  background: white;
  box-shadow: 0 8px 32px rgba(21, 101, 192, 0.08) !important;
  transition: all 0.3s ease;
}

.contact-form-card:hover {
  box-shadow: 0 12px 48px rgba(21, 101, 192, 0.15) !important;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.form-row {
}

.checkbox-label {
  font-size: 0.9375rem;
  color: rgba(0, 0, 0, 0.8);
}

.map-section {
  background-color: rgb(var(--v-theme-accent));
}

.map-placeholder {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(227, 242, 253, 0.3);
}

.map-text {
  font-size: 1.125rem;
  color: rgba(0, 0, 0, 0.6);
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.section-badge {
  display: inline-block;
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
  color: #1565C0;
  padding: 8px 24px;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.15);
}

.faq-section {
  background: linear-gradient(180deg, #F5F7FA 0%, #E3F2FD 100%);
  position: relative;
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.floating-shape {
  position: absolute;
  opacity: 0.06;
}

.shape-circle {
  width: 200px;
  height: 200px;
  background: #1565C0;
  border-radius: 50%;
  top: 10%;
  left: 5%;
  animation: floatShape 20s infinite ease-in-out;
}

.shape-square {
  width: 150px;
  height: 150px;
  background: #0D47A1;
  border-radius: 30px;
  bottom: 10%;
  right: 10%;
  animation: floatShape 25s infinite ease-in-out reverse;
  transform: rotate(45deg);
}

@keyframes floatShape {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-40px) rotate(15deg);
  }
  66% {
    transform: translateY(30px) rotate(-15deg);
  }
}

.faq-panels {
  background: transparent !important;
}

.faq-panel {
  background: white !important;
  border: 1px solid #E3F2FD !important;
  border-radius: 16px !important;
  margin-bottom: 16px !important;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(21, 101, 192, 0.08) !important;
  transition: all 0.3s ease;
}

.faq-panel:hover {
  box-shadow: 0 8px 24px rgba(21, 101, 192, 0.15) !important;
  border-color: #90CAF9 !important;
}

.faq-question {
  font-size: 1.125rem !important;
  font-weight: 600 !important;
  padding: 20px 24px !important;
}

.faq-title-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;
}

.faq-title-content span {
  flex: 1;
}

.faq-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1565C0, #0D47A1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.25);
}

.faq-answer {
  font-size: 1.0625rem !important;
  line-height: 1.8 !important;
  color: rgba(0, 0, 0, 0.8) !important;
  padding: 16px 24px !important;
  background: rgba(227, 242, 253, 0.2) !important;
}

.faq-answer-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
</style>

