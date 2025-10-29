<template>
  <div>
    <!-- Hero Section -->
    <v-container fluid class="hero-section">
      <div class="hero-background">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
        <div class="cloud cloud-4"></div>
        <div class="decorative-shape shape-1"></div>
        <div class="decorative-shape shape-2"></div>
      </div>
      <v-container class="hero-content">
        <v-row align="center" justify="center" class="py-16">
          <v-col cols="12" md="8" class="text-center">
            <div class="hero-icon-wrapper mb-6">
              <div class="icon-bg-circle"></div>
              <v-icon icon="mdi-compass" size="80" class="hero-icon" />
            </div>
            <h1 class="hero-title">ברוכים הבאים לסולתרפיה</h1>
            <p class="hero-subtitle mt-6">
              סקרנות ולמידה - מסע של גילוי עצמי וצמיחה אישית
            </p>
            <p class="hero-text mt-4">
              גישה טיפולית ייחודית המעודדת סקרנות, שאילת שאלות ולמידה מתמשכת. כאן אתם מוזמנים לחקור, לגלות
              ולצמוח דרך הבנה עמוקה של עצמכם והעולם שסביבכם.
            </p>
            <div class="mt-8">
              <v-btn color="primary" size="x-large" rounded="xl" :to="{ name: 'contact' }" class="me-4 hero-btn" elevation="8">
                <v-icon icon="mdi-email-outline" start />
                צרו קשר
              </v-btn>
              <v-btn color="white" size="x-large" rounded="xl" variant="elevated" :to="{ name: 'about' }" class="hero-btn-outline" elevation="4">
                <v-icon icon="mdi-arrow-left" start />
                קראו עוד
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Services Preview -->
    <v-container class="py-16 services-section">
      <div class="text-center mb-12">
        <div class="section-badge mb-4">
          <v-icon icon="mdi-star-outline" start size="small" />
          השירותים שלנו
        </div>
        <h2 class="section-title">התחומים שבהם אני מתמחה</h2>
      </div>
      <v-row class="rtl-grid">
        <v-col v-for="service in services" :key="service.title" cols="12" md="4">
          <v-card class="service-card elevated-card" elevation="0" height="100%">
            <div class="card-corner-decoration"></div>
            <div class="service-icon-wrapper">
              <div class="icon-background">
                <v-icon :icon="service.icon" size="56" :color="service.color" />
              </div>
            </div>
            <v-card-text class="text-center pa-8">
              <h3 class="service-title mb-4">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
            </v-card-text>
            <div class="card-shine"></div>
          </v-card>
        </v-col>
      </v-row>
      <div class="text-center mt-12">
        <v-btn color="primary" size="x-large" rounded="xl" :to="{ name: 'services' }" elevation="6" class="cta-button">
          <v-icon icon="mdi-arrow-left" start />
          למידע נוסף על הטיפולים
        </v-btn>
      </div>
    </v-container>

    <!-- Journey Section with Image -->
    <v-container class="py-16">
      <v-row align="center" class="journey-section rtl-grid">
        <v-col cols="12" md="6" order="2" order-md="1">
          <div class="journey-content">
            <div class="journey-badge mb-4">
              <v-icon icon="mdi-compass-outline" start size="small" />
              המסע שלנו
            </div>
            <h2 class="journey-title mb-4">מסע של גילוי והבנה</h2>
            <div class="journey-divider mb-4"></div>
            <p class="journey-text mb-4">
              כל אדם הוא חוקר טבעי. מגיל צעיר אנחנו שואלים שאלות, מגלים את העולם ולומדים. לפעמים בדרך אנחנו מאבדים את הסקרנות הזו.
            </p>
            <p class="journey-text mb-4">
              גישת סולתרפיה מזמינה אתכם לחזור לסקרנות הטבעית, לשאול שאלות ולחקור את עצמכם ואת החיים שלכם בצורה חדשה ומרתקת.
            </p>
            <v-btn color="primary" size="x-large" rounded="xl" :to="{ name: 'about' }" class="mt-4 journey-btn" elevation="6">
              <v-icon icon="mdi-arrow-left" start />
              גלו עוד על הגישה
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="6" order="1" order-md="2">
          <div class="image-wrapper">
            <div class="image-decoration"></div>
            <img
              src="https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&h=600&fit=crop"
              alt="זכוכית מגדלת על מפה"
              class="journey-image"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Why Choose Section -->
    <v-container fluid class="why-choose-section py-16">
      <div class="floating-shapes">
        <div class="floating-shape shape-circle"></div>
        <div class="floating-shape shape-square"></div>
        <div class="floating-shape shape-triangle"></div>
      </div>
      <v-container style="position: relative; z-index: 1;">
        <div class="text-center mb-12">
          <div class="section-badge mb-4">
            <v-icon icon="mdi-heart-outline" start size="small" />
            מדוע אנחנו?
          </div>
          <h2 class="section-title">למה לבחור בסולתרפיה?</h2>
        </div>
        <v-row class="rtl-grid">
          <v-col v-for="reason in reasons" :key="reason.title" cols="12" sm="6" md="3">
            <v-card class="reason-card" elevation="0">
              <v-card-text class="text-center pa-6">
                <div class="reason-icon-wrapper mb-4">
                  <div class="reason-icon-bg">
                    <v-icon :icon="reason.icon" size="40" :color="reason.color" />
                  </div>
                </div>
                <h4 class="reason-title mb-3">{{ reason.title }}</h4>
                <p class="reason-text">{{ reason.text }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- CTA Section -->
    <v-container class="py-16">
      <v-card class="cta-card" elevation="0" rounded="xl">
        <div class="cta-particles">
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
        </div>
        <v-card-text class="text-center pa-12" style="position: relative; z-index: 1;">
          <v-icon icon="mdi-hand-wave-outline" size="64" class="mb-6 cta-icon" />
          <h2 class="cta-title mb-4">מוכנים להתחיל את המסע?</h2>
          <p class="cta-text mb-8">
            צעד ראשון הוא תמיד הכי קשה, אבל גם הכי חשוב. אני כאן כדי ללוות אותכם בדרך.
          </p>
          <v-btn color="white" size="x-large" rounded="xl" :to="{ name: 'contact' }" class="cta-main-button" elevation="0">
            <v-icon icon="mdi-calendar-check" start />
            קבעו פגישת היכרות
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const services = [
  {
    icon: 'mdi-head-question-outline',
    title: 'סקרנות טיפולית',
    description:
      'גישה המעודדת שאלות, חקירה והתבוננות. נלמד יחד לפתח סקרנות בריאה כלפי עצמכם והעולם.',
    color: '#1565C0',
  },
  {
    icon: 'mdi-book-open-page-variant',
    title: 'למידה והתפתחות',
    description:
      'תהליך מתמשך של גילוי והבנה. כל מפגש הוא הזדמנות ללמוד משהו חדש על עצמכם.',
    color: '#1565C0',
  },
  {
    icon: 'mdi-compass',
    title: 'ניווט במסע האישי',
    description:
      'ליווי מקצועי בדרך שלכם, עם כלים לחקירה עצמית, הבנה עמוקה יותר וצמיחה מתמדת.',
    color: '#1565C0',
  },
]

const reasons = [
  {
    icon: 'mdi-lightbulb-on-outline',
    title: 'חקירה משותפת',
    text: 'גישה שמעודדת שאלות וסקרנות',
    color: '#1565C0',
  },
  {
    icon: 'mdi-book-open-variant',
    title: 'למידה מתמשכת',
    text: 'כל מפגש הוא הזדמנות לגילוי',
    color: '#1565C0',
  },
  {
    icon: 'mdi-shield-check-outline',
    title: 'מרחב בטוח',
    text: 'סביבה תומכת לחקירה עצמית',
    color: '#1565C0',
  },
  {
    icon: 'mdi-account-star-outline',
    title: 'גישה אישית',
    text: 'התאמה מלאה למסע האישי שלך',
    color: '#1565C0',
  },
]
</script>

<style scoped>
.rtl-grid {
  flex-direction: row-reverse !important;
}

.hero-section {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%);
  color: #0D47A1;
  min-height: 600px;
  display: flex;
  align-items: center;
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
  width: 120px;
  height: 40px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.cloud-1::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
}

.cloud-1::after {
  width: 60px;
  height: 30px;
  top: -15px;
  right: 10px;
}

.cloud-2 {
  width: 140px;
  height: 45px;
  top: 60%;
  right: 15%;
  animation-delay: -7s;
}

.cloud-2::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 15px;
}

.cloud-2::after {
  width: 70px;
  height: 35px;
  top: -20px;
  right: 15px;
}

.cloud-3 {
  width: 100px;
  height: 35px;
  top: 30%;
  right: 25%;
  animation-delay: -14s;
}

.cloud-3::before {
  width: 45px;
  height: 45px;
  top: -20px;
  left: 10px;
}

.cloud-3::after {
  width: 50px;
  height: 25px;
  top: -12px;
  right: 10px;
}

.cloud-4 {
  width: 110px;
  height: 38px;
  top: 75%;
  left: 20%;
  animation-delay: -10s;
}

.cloud-4::before {
  width: 48px;
  height: 48px;
  top: -22px;
  left: 12px;
}

.cloud-4::after {
  width: 55px;
  height: 28px;
  top: -14px;
  right: 12px;
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
  width: 300px;
  height: 300px;
  background: #1565C0;
  top: -100px;
  right: -100px;
  animation: pulse 8s infinite ease-in-out;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: #0D47A1;
  bottom: -50px;
  left: -50px;
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

.hero-content {
  position: relative;
  z-index: 1;
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
  width: 120px;
  height: 120px;
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

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 500;
  opacity: 0.95;
}

.hero-text {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.8;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
}

.hero-btn {
  font-weight: 600;
  padding: 0 32px !important;
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(21, 101, 192, 0.4) !important;
}

.hero-btn-outline {
  font-weight: 600;
  padding: 0 32px !important;
  transition: all 0.3s ease;
  color: #1565C0 !important;
  border: 2px solid rgba(21, 101, 192, 0.3);
}

.hero-btn-outline:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(21, 101, 192, 0.3) !important;
  border-color: #1565C0;
}

.services-section {
  position: relative;
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

.service-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 16px;
  position: relative;
  z-index: 1;
}

.icon-background {
  width: 100px;
  height: 100px;
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

.service-card {
  transition: transform 0.4s, box-shadow 0.4s;
  height: 100%;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0D47A1;
}

.service-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #616161;
}

.cta-button {
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 0 40px !important;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(21, 101, 192, 0.3) !important;
}

.journey-section {
  gap: 48px;
}

@media (min-width: 960px) {
  .journey-section {
    display: flex !important;
    flex-wrap: wrap;
  }
}

.journey-content {
  padding: 24px;
}

.journey-badge {
  display: inline-block;
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.8), rgba(187, 222, 251, 0.8));
  color: #1565C0;
  padding: 6px 20px;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.1);
}

.journey-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #0D47A1;
  line-height: 1.3;
}

.journey-divider {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #1565C0, #90CAF9);
  border-radius: 2px;
}

.journey-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #616161;
}

.journey-btn {
  font-weight: 600;
  transition: all 0.3s ease;
}

.journey-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(21, 101, 192, 0.3) !important;
}

.image-wrapper {
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(21, 101, 192, 0.2);
  position: relative;
  transform: rotate(-2deg);
  transition: all 0.5s ease;
}

.image-wrapper:hover {
  transform: rotate(0deg) translateY(-8px);
  box-shadow: 0 24px 64px rgba(21, 101, 192, 0.3);
}

.image-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #90CAF9, #BBDEFB);
  border-radius: 50%;
  opacity: 0.6;
  z-index: -1;
  filter: blur(40px);
}

.journey-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

.image-wrapper:hover .journey-image {
  transform: scale(1.08);
}

.why-choose-section {
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

.reason-card {
  background: white;
  border-radius: 20px;
  transition: all 0.4s ease;
  height: 100%;
  border: 1px solid rgba(21, 101, 192, 0.1);
}

.reason-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(21, 101, 192, 0.15);
  border-color: #90CAF9;
}

.reason-icon-wrapper {
  display: flex;
  justify-content: center;
}

.reason-icon-bg {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.8), rgba(187, 222, 251, 0.8));
  border-radius: 50%;
  transition: all 0.4s ease;
  position: relative;
}

.reason-icon-bg::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #90CAF9;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.4s ease;
}

.reason-card:hover .reason-icon-bg {
  transform: scale(1.15) rotate(-10deg);
}

.reason-card:hover .reason-icon-bg::after {
  opacity: 1;
  transform: scale(1.2);
}

.reason-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0D47A1;
}

.reason-text {
  font-size: 0.95rem;
  color: #616161;
  line-height: 1.7;
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
  font-size: clamp(1.75rem, 4vw, 2.5rem);
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
