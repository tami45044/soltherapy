<template>
  <div>
    <!-- Hero Section -->
    <v-container fluid class="hero-section">
      <div class="hero-background">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
        <div class="decorative-shape shape-1"></div>
        <div class="decorative-shape shape-2"></div>
      </div>
      <v-container style="position: relative; z-index: 1;">
        <v-row align="center" justify="center" class="py-12">
          <v-col cols="12" md="10" class="text-center">
            <div class="hero-icon-wrapper mb-6">
              <div class="icon-bg-circle"></div>
              <v-icon icon="mdi-compass-rose" size="64" class="hero-icon" />
            </div>
            <h1 class="page-title">מהי סולתרפיה?</h1>
            <p class="page-subtitle mt-6" style="max-width: 800px; margin-left: auto; margin-right: auto; text-align: center;">
              אם הגעת לכאן, אולי אתה לא מחפש עוד "שיטה".<br>
              אולי אתה פשוט רוצה לגלות מה באמת קורה בך —<br>
              מעבר להסברים, מעבר למילים.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Main Content -->
    <v-container class="py-16">
      <!-- Introduction Card -->
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="10">
          <v-card class="intro-card" elevation="0" rounded="xl">
            <v-card-text class="pa-8 pa-md-12">
              <p class="intro-text">
                סולתרפיה היא הזמנה להכיר את עצמך דרך הדבר הכי טבעי שנשאר בך – <strong>הסקרנות</strong>.
              </p>
              <p class="intro-text">
                זו אינה שיטה לתיקון, אלא דרך להקשבה. היא לא מבקשת לשנות אותך, אלא לעורר מחדש את התנועה הפנימית שכבר קיימת: הרצון להבין, להרגיש, להתחבר.
              </p>
              <p class="intro-text highlight">
                כי בסוף, מה שמרפא אותנו באמת – אינו הידע, אלא העניין.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Three Pillars -->
      <v-row class="mb-16">
        <v-col cols="12">
          <div class="text-center mb-12">
            <div class="section-badge mb-4">
              <v-icon icon="mdi-star-four-points" start size="small" />
              עקרונות הגישה
            </div>
            <h2 class="section-title">שלוש נקודות מפתח לצמיחה אמיתית</h2>
          </div>
        </v-col>

        <!-- Pillar 1 -->
        <v-col cols="12" md="4" order="3" order-md="3">
          <v-card class="pillar-card" height="100%" elevation="0" rounded="xl">
            <div class="card-corner-decoration"></div>
            <v-card-text class="pa-8" style="display: flex; flex-direction: column; height: 100%;">
              <div class="pillar-number">1</div>
              <div class="pillar-icon-wrapper mb-4">
                <div class="icon-background">
                  <v-icon icon="mdi-shield-search" size="48" color="primary" />
                </div>
              </div>
              <h3 class="pillar-title mb-4">סקרנות מול פחד</h3>
              <h4 class="pillar-subtitle mb-4">כשהפחד מפנה מקום לשאלה</h4>
              <p class="pillar-text">
                הפחד הוא לא הבעיה, אלא הסימן שיש בי משהו שעדיין חי.
                הוא רק שכח את שפת הסקרנות.
              </p>
              <p class="pillar-text">
                בסולתרפיה אנחנו לומדים לדבר שוב את השפה הזו:
                להתעניין במקום להילחם, לשהות במקום למהר,
                ולגלות שהמקומות שהפחידו אותנו – הם בדיוק המקומות שבהם מתרחשת הלמידה.
              </p>
              <div class="pillar-highlight mt-auto">
                <v-icon icon="mdi-lightbulb-on" size="20" class="me-2" color="primary" />
                <span>זהו תיקון קדום: להשיב את הסקרנות למקומה הטבעי, במקום שבו הפחד השתלט על ההגה.</span>
              </div>
            </v-card-text>
            <div class="card-shine"></div>
          </v-card>
        </v-col>

        <!-- Pillar 2 -->
        <v-col cols="12" md="4" order="2" order-md="2">
          <v-card class="pillar-card" height="100%" elevation="0" rounded="xl">
            <div class="card-corner-decoration"></div>
            <v-card-text class="pa-8" style="display: flex; flex-direction: column; height: 100%;">
              <div class="pillar-number">2</div>
              <div class="pillar-icon-wrapper mb-4">
                <div class="icon-background">
                  <v-icon icon="mdi-book-open-page-variant" size="48" color="primary" />
                </div>
              </div>
              <h3 class="pillar-title mb-4">סקרנות כלמידה חיה</h3>
              <h4 class="pillar-subtitle mb-4">לחדש את הלהבה</h4>
              <p class="pillar-text">
                ברובנו הוחלפה הסקרנות בצורך "להצליח".
                למדנו להכיר כדי להרשים, כדי לעמוד בציפייה, כדי שלא נאכזב.
              </p>
              <p class="pillar-text">
                אבל הלב לומד אחרת.
                הוא לומד כשהוא סקרן, לא כשהוא נבחן.
              </p>
              <p class="pillar-text">
                בסולתרפיה אנחנו משיבים את הלמידה למקורה:
                מגע ישיר עם החיים.
              </p>
              <div class="pillar-highlight mt-auto">
                <v-icon icon="mdi-lightbulb-on" size="20" class="me-2" color="primary" />
                <span>שיעור שמתרחש גם בשקט, גם בשעמום, גם בכישלון – כי כל רגע שבו אני מתעניין, הוא רגע שבו אני חי.</span>
              </div>
            </v-card-text>
            <div class="card-shine"></div>
          </v-card>
        </v-col>

        <!-- Pillar 3 -->
        <v-col cols="12" md="4" order="1" order-md="1">
          <v-card class="pillar-card" height="100%" elevation="0" rounded="xl">
            <div class="card-corner-decoration"></div>
            <v-card-text class="pa-8" style="display: flex; flex-direction: column; height: 100%;">
              <div class="pillar-number">3</div>
              <div class="pillar-icon-wrapper mb-4">
                <div class="icon-background">
                  <v-icon icon="mdi-account-heart" size="48" color="primary" />
                </div>
              </div>
              <h3 class="pillar-title mb-4">סקרנות לאדם</h3>
              <h4 class="pillar-subtitle mb-4">אמנות ההתעניינות</h4>
              <p class="pillar-text">
                יש משהו מרפא במבט שמתעניין באמת.
              </p>
              <p class="pillar-text">
                כשאני מביט באדם אחר מתוך סקרנות, ולא מתוך שיפוט,
                אני מעניק לו את מה שהנפש כמהה אליו יותר מכל – מקום.
              </p>
              <p class="pillar-text">
                וכשאני לומד להתעניין גם בעצמי באותו אופן,
                נולדת חמלה.
              </p>
              <div class="pillar-highlight mt-auto">
                <v-icon icon="mdi-lightbulb-on" size="20" class="me-2" color="primary" />
                <span>חמלה שמחזירה אליי את הערך, ומחזירה לעולם את האנושיות שאבדה לו בשגרה האדישה.</span>
              </div>
            </v-card-text>
            <div class="card-shine"></div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Video Section -->
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="10">
          <div class="text-center mb-8">
            <div class="section-badge mb-4">
              <v-icon icon="mdi-play-circle" start size="small" />
              הרצאה לדוגמה
            </div>
            <h2 class="section-title">צפו בהרצאה על סולתרפיה</h2>
          </div>
          <v-card class="video-card" elevation="4" rounded="xl">
            <v-card-text class="pa-0">
              <div class="video-wrapper">
                <iframe
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/_8DNjAFetWc"
                  title="הרצאה על סולתרפיה"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  style="border-radius: 24px;"
                ></iframe>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Benefits Section -->
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-card class="benefits-card" elevation="0" rounded="xl">
            <div class="benefits-particles">
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
              <div class="particle"></div>
            </div>
            <v-card-text class="pa-8 pa-md-12" style="position: relative; z-index: 1;">
              <div class="text-center mb-8">
                <v-icon icon="mdi-gift" size="56" class="benefits-icon mb-4" />
                <h2 class="benefits-title">ומה זה נותן לך?</h2>
              </div>

              <div class="benefits-grid">
                <div v-for="benefit in benefits" :key="benefit" class="benefit-item">
                  <v-icon icon="mdi-checkbox-marked-circle" size="24" color="white" class="me-3" />
                  <span>{{ benefit }}</span>
                </div>
              </div>

              <div class="text-center mt-10">
                <v-btn
                  color="white"
                  size="x-large"
                  rounded="xl"
                  :to="{ name: 'contact' }"
                  class="benefits-button"
                  elevation="0"
                >
                  <v-icon icon="mdi-calendar-check" start />
                  לקביעת פגישה אישית או להצטרפות לקבוצה
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const benefits = [
  'להפוך פחד לסקרנות, ובדידות לקשר',
  'לחוות ביטחון עצמי לא דרך שליטה, אלא דרך הבנה',
  'לפתח הקשבה חיה לעצמך ולאנשים שסביבך',
  'להכיר את חייך לא דרך תאוריה – אלא דרך החיים עצמם',
  'תשומת הלב שתעניק לך את עצמך',
]
</script>

<style scoped>
.hero-section {
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
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
}

.page-subtitle {
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  line-height: 1.8;
  opacity: 0.95;
}

.intro-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%);
  border: 2px solid #E3F2FD;
  text-align: right;
  direction: rtl;
}

.intro-text {
  font-size: clamp(1.0625rem, 2vw, 1.25rem);
  line-height: 2;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 24px;
}

.intro-text.highlight {
  font-size: clamp(1.125rem, 2.2vw, 1.375rem);
  font-weight: 600;
  color: #0D47A1;
  margin-top: 32px;
  margin-bottom: 0;
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

.pillar-card {
  background: white;
  border: 1px solid #E3F2FD;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-align: right;
  direction: rtl;
}

.pillar-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(21, 101, 192, 0.2) !important;
  border-color: #90CAF9;
}

.card-corner-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #E3F2FD, transparent);
  border-radius: 24px 0 100% 0;
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

.pillar-card:hover .card-shine {
  left: 150%;
}

.pillar-number {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1565C0;
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.2);
  z-index: 1;
}

.pillar-icon-wrapper {
  display: flex;
  justify-content: flex-start;
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

.pillar-card:hover .icon-background {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 12px 32px rgba(21, 101, 192, 0.25);
}

.pillar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0D47A1;
}

.pillar-subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1565C0;
  font-style: italic;
}

.pillar-text {
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 16px;
}

.pillar-highlight {
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.5), rgba(187, 222, 251, 0.3));
  padding: 16px;
  border-radius: 12px;
  border-right: 4px solid #1565C0;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
}

.benefits-card {
  background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(21, 101, 192, 0.3) !important;
}

.benefits-particles {
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

.benefits-icon {
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

.benefits-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
}

.benefits-grid {
  display: grid;
  gap: 20px;
  text-align: right;
  direction: rtl;
}

.benefit-item {
  display: flex;
  align-items: center;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.8;
  text-align: right;
  direction: rtl;
}

.benefits-button {
  font-weight: 600;
  padding: 0 40px !important;
  color: #1565C0 !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
}

.benefits-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.5) !important;
}

.video-card {
  background: white;
  overflow: hidden;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

