<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="about-header">
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
              <v-icon icon="mdi-account-heart" size="64" class="hero-icon" />
            </div>
            <h1 class="page-title">אודות הגישה</h1>
            <p class="page-subtitle mt-4">סקרנות ולמידה - מסע של גילוי והבנה</p>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- About Content -->
    <v-container class="py-16">
      <v-row>
        <v-col cols="12" md="4" class="text-center">
          <div class="about-image-wrapper">
            <div class="image-glow"></div>
            <img
              src="/therapist-photo.jpg"
              alt="משה יצחק שידלובסקי"
              class="about-image"
            />
          </div>
          <h2 class="therapist-name mt-6">
            משה יצחק שידלובסקי
            <v-icon icon="mdi-account-circle" size="small" class="ms-2" color="primary" />
          </h2>
          <p class="therapist-title">
            מרצה, יועץ ומטפל רב תחומי. יוצר גישת סולתרפיה - סקרנות ולמידה
            <v-icon icon="mdi-medal" size="small" class="ms-1" />
          </p>
        </v-col>

        <v-col cols="12" md="8">
          <div class="about-content">
            <h3 class="content-title">מי אני?</h3>
            <p class="content-text">
              שמי משה יצחק שידלובסקי, מרצה ויועץ בעל שם בתחום הרגש וההתפתחות האישית. אני מתמחה בגישה
              הייחודית של סולתרפיה - גישה המבוססת על עידוד סקרנות ולמידה כדרך לשינוי ולצמיחה אישית.
            </p>

            <p class="content-text">
              "מסע תגליות אמיתי אינו כרוך בחיפוש אחר נופים חדשים אלא ברכישת עיניים חדשות" - מרסל פרוסט.
              משפט זה משקף את ליבת הגישה שלי: המטרה אינה לשנות את המציאות, אלא להכיר אותה בעיניים
              חדשות, מתוך סקרנות אמיתית.
            </p>

            <h3 class="content-title mt-8">הגישה - סולתרפיה</h3>
            <p class="content-text">
              סולתרפיה (סקרנות ולמידה) היא גישה מבוססת תרפיה הרלוונטית לכל אחד המעוניין להתפתח
              ולהכיר באמת את עצמו והעולם שסביבו. הגישה מעודדת מעבר "מבריחה לבחירה" - במקום לברוח מקשיים,
              אנו לומדים להיות סקרנים לגביהם, להכיר אותם, ולבחור כיצד להתמודד איתם בצורה מעצימה.
            </p>

            <p class="content-text">
              הגישה משלבת כלים מהגל השלישי של CBT, מיינדפולנס, ואלמנטים מהפסיכואנליזה, תוך יצירת מרחב
              בטוח לחקירה עצמית ולמידה. "לעולם ילמד אדם מה שליבו חפץ" - והנך מוזמן להכיר מה הלב חפץ על
              ידי הגישה הסקרנית.
            </p>

            <!-- קטע השכלה והסמכות מוסתר בינתיים -->
            <div v-if="false">
              <h3 class="content-title mt-8">
                <v-icon icon="mdi-school" size="small" class="me-2" color="primary" />
                השכלה והסמכות
              </h3>
              <div class="credentials-grid mt-6">
                <v-card v-for="item in credentials" :key="item" class="credential-card" elevation="0">
                  <v-card-text class="d-flex align-center pa-4">
                    <div class="credential-icon-wrapper me-4">
                      <v-icon icon="mdi-check-circle" size="32" color="primary" />
                    </div>
                    <div class="credential-content">
                      <span class="credential-text">{{ item }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Values Section -->
    <v-container fluid class="values-section py-8">
      <div class="floating-shapes">
        <div class="floating-shape shape-circle"></div>
        <div class="floating-shape shape-square"></div>
        <div class="floating-shape shape-triangle"></div>
      </div>
      <v-container style="position: relative; z-index: 1;">
        <div class="text-center mb-12">
          <div class="section-badge mb-4">
            <v-icon icon="mdi-star-four-points" start size="small" />
            הערכים שלנו
          </div>
          <h2 class="section-title">הערכים שמנחים אותי</h2>
        </div>
        <v-row>
          <v-col v-for="value in values" :key="value.title" cols="12" md="6" lg="3">
            <v-card class="value-card elevated-card" elevation="0" height="100%">
              <div class="card-corner-decoration"></div>
              <v-card-text class="text-center pa-6">
                <div class="value-icon-wrapper mb-4">
                  <div class="icon-background">
                    <v-icon :icon="value.icon" size="48" color="primary" />
                  </div>
                </div>
                <h4 class="value-title mb-3">{{ value.title }}</h4>
                <p class="value-text">{{ value.text }}</p>
              </v-card-text>
              <div class="card-shine"></div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- CTA Section -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="cta-card text-center" elevation="0" rounded="xl">
            <div class="cta-particles">
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
            </div>
            <v-card-text class="pa-12" style="position: relative; z-index: 1;">
              <v-icon icon="mdi-chat-outline" size="64" class="mb-6 cta-icon" />
              <h2 class="cta-title mb-4">רוצים להכיר אותי יותר?</h2>
              <p class="cta-text mb-8">
                אני מזמינה אתכם לפגישת היכרות ללא התחייבות, שבה נוכל לדבר על הצרכים שלכם ולראות איך אני
                יכולה לעזור.
              </p>
              <v-btn color="white" size="x-large" rounded="xl" :to="{ name: 'contact' }" class="cta-main-button" elevation="0">
                <v-icon icon="mdi-email-outline" start />
                צרו קשר
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const credentials = [
  'מומחה בגישת סולתרפיה - מכון MS',
  'הכשרה מתקדמת בגל השלישי של CBT',
  'הסמכה במיינדפולנס וטיפול מבוסס קשיבות',
  'התמחות בפסיכואנליזה ודינמיקה קבוצתית',
  'ניסיון רב בהנחיית קבוצות תהליך-תוכן',
  'מרצה ומנחה סדנאות לפיתוח ביטחון עצמי',
]

const values = [
  {
    icon: 'mdi-human-greeting',
    title: 'כבוד ושוויון',
    text: 'כל אדם ראוי לכבוד ולטיפול שוויוני ללא שיפוטיות',
  },
  {
    icon: 'mdi-shield-lock',
    title: 'סודיות',
    text: 'שמירה מוחלטת על פרטיות וסודיות המטופלים',
  },
  {
    icon: 'mdi-hand-heart',
    title: 'אמפתיה',
    text: 'הקשבה עמוקה והבנה של המצב הרגשי של המטופל',
  },
  {
    icon: 'mdi-account-star',
    title: 'מקצועיות',
    text: 'עבודה מקצועית מבוססת מחקר והתפתחות מתמדת',
  },
]
</script>

<style scoped>
.about-header {
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
  width: 100px;
  height: 35px;
  top: 15%;
  left: 15%;
  animation-delay: 0s;
}

.cloud-1::before {
  width: 45px;
  height: 45px;
  top: -22px;
  left: 10px;
}

.cloud-1::after {
  width: 50px;
  height: 25px;
  top: -12px;
  right: 10px;
}

.cloud-2 {
  width: 120px;
  height: 40px;
  top: 60%;
  right: 20%;
  animation-delay: -7s;
}

.cloud-2::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.cloud-2::after {
  width: 60px;
  height: 30px;
  top: -15px;
  right: 15px;
}

.cloud-3 {
  width: 90px;
  height: 32px;
  top: 35%;
  right: 30%;
  animation-delay: -14s;
}

.cloud-3::before {
  width: 40px;
  height: 40px;
  top: -18px;
  left: 10px;
}

.cloud-3::after {
  width: 45px;
  height: 22px;
  top: -10px;
  right: 10px;
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
  width: 250px;
  height: 250px;
  background: #1565C0;
  top: -80px;
  right: -80px;
  animation: pulse 8s infinite ease-in-out;
}

.shape-2 {
  width: 180px;
  height: 180px;
  background: #0D47A1;
  bottom: -40px;
  left: -40px;
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

.about-image-wrapper {
  width: 280px;
  height: 280px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(21, 101, 192, 0.3);
  border: 6px solid #90CAF9;
  position: relative;
  transition: all 0.5s ease;
}

.about-image-wrapper:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 24px 64px rgba(21, 101, 192, 0.4);
  border-color: #64B5F6;
}

.image-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(21, 101, 192, 0.3), transparent);
  animation: glow 3s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes glow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.about-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.about-image-wrapper:hover .about-image {
  transform: scale(1.1);
}

.therapist-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0D47A1;
}

.therapist-title {
  font-size: 1.125rem;
  color: #616161;
  margin-top: 8px;
}

.about-content {
  padding: 0 24px;
}

.content-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.content-text {
  font-size: 1.0625rem;
  line-height: 1.9;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 16px;
}

.credentials-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.credential-card {
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.3), rgba(255, 255, 255, 0.9));
  border: 1px solid #E3F2FD;
  border-radius: 16px !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.credential-card::before {
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

.credential-card:hover {
  transform: translateX(-8px);
  box-shadow: 0 8px 24px rgba(21, 101, 192, 0.15);
  border-color: #90CAF9;
}

.credential-card:hover::before {
  opacity: 1;
}

.credential-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.8), rgba(187, 222, 251, 0.8));
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.credential-card:hover .credential-icon-wrapper {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.2);
}

.credential-content {
  flex: 1;
}

.credential-text {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
}

.values-section {
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
  opacity: 0.08;
}

.shape-circle {
  width: 150px;
  height: 150px;
  background: #1565C0;
  border-radius: 50%;
  top: 10%;
  right: 5%;
  animation: floatShape 15s infinite ease-in-out;
}

.shape-square {
  width: 100px;
  height: 100px;
  background: #0D47A1;
  border-radius: 20px;
  bottom: 15%;
  left: 10%;
  animation: floatShape 18s infinite ease-in-out reverse;
  transform: rotate(45deg);
}

.shape-triangle {
  width: 0;
  height: 0;
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-bottom: 100px solid #1565C0;
  top: 50%;
  left: 50%;
  animation: floatShape 20s infinite ease-in-out;
}

@keyframes floatShape {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(10deg);
  }
  66% {
    transform: translateY(20px) rotate(-10deg);
  }
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

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.elevated-card {
  background: white;
  border: 1px solid #E3F2FD;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 24px !important;
  position: relative;
  overflow: hidden;
}

.elevated-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(21, 101, 192, 0.2) !important;
  border-color: #90CAF9;
}

.card-corner-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #E3F2FD, transparent);
  border-radius: 0 24px 0 100%;
  z-index: 0;
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.5s;
  z-index: 10;
  pointer-events: none;
}

.elevated-card:hover .card-shine {
  left: 150%;
}

.value-icon-wrapper {
  display: flex;
  justify-content: center;
}

.icon-background {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(21, 101, 192, 0.15);
  transition: all 0.4s ease;
  position: relative;
}

.icon-background::before {
  content: '';
  position: absolute;
  width: 110%;
  height: 110%;
  border-radius: 50%;
  border: 2px solid #90CAF9;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.elevated-card:hover .icon-background {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 12px 32px rgba(21, 101, 192, 0.25);
}

.elevated-card:hover .icon-background::before {
  opacity: 1;
  animation: ripple 1.5s infinite;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.value-card {
  background-color: white;
  border-radius: 24px;
  transition: transform 0.4s, box-shadow 0.4s;
}

.value-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0D47A1;
}

.value-text {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #616161;
}

.cta-card {
  background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(21, 101, 192, 0.3) !important;
}

.cta-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: particleFloat 8s infinite ease-in-out;
}

.particle:nth-child(1) {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  top: 60%;
  left: 30%;
  animation-delay: -2s;
}

.particle:nth-child(3) {
  top: 40%;
  right: 20%;
  animation-delay: -4s;
}

.particle:nth-child(4) {
  top: 75%;
  right: 40%;
  animation-delay: -6s;
}

.particle:nth-child(5) {
  top: 30%;
  left: 50%;
  animation-delay: -3s;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 0.8;
  }
}

.cta-icon {
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: rotate(15deg);
  }
  20%, 40%, 60%, 80% {
    transform: rotate(-15deg);
  }
}

.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
}

.cta-text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.8;
  opacity: 0.95;
}

.cta-main-button {
  font-weight: 600;
  padding: 0 40px !important;
  color: #1565C0 !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
}

.cta-main-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.5) !important;
}
</style>
