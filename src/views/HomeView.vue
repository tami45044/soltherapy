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
          <v-col cols="12" md="10" class="text-center">
            <div class="hero-icon-wrapper mb-8">
              <div class="icon-bg-circle"></div>
              <v-icon icon="mdi-compass-rose" size="80" class="hero-icon" />
            </div>
            <h1 class="hero-title mb-6">הסתקרנת?<br>סימן שהמסע כבר התחיל</h1>
            <p class="hero-subtitle mt-6">
              ברוך הבא אל <strong>סולתרפיה</strong> – תחנת המוצא במסע לגילוי עצמך.<br>
              הפיתוח שיעניק לך נוכחות מלאה במנעד החיים.
            </p>
            <div class="hero-definition mt-8">
              <p>
                <strong>סולתרפיה</strong> – גישה טיפולית־התפתחותית המבוססת על
                <em>סקרנות ולמידה</em>.
              </p>
            </div>
            <div class="mt-10">
              <v-btn
                color="primary"
                size="x-large"
                rounded="xl"
                :to="{ name: 'contact' }"
                class="me-4 hero-btn"
                elevation="8"
              >
                <v-icon icon="mdi-calendar-check" start />
                לקביעת פגישה
              </v-btn>
              <v-btn
                color="white"
                size="x-large"
                rounded="xl"
                variant="elevated"
                :to="{ name: 'what-is-soltherapy' }"
                class="hero-btn-outline"
                elevation="4"
              >
                <v-icon icon="mdi-arrow-left" start />
                מהי סולתרפיה?
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Quotes Section -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="10">
          <div class="quotes-wrapper">
            <v-card
              v-for="quote in quotes"
              :key="quote.text"
              class="quote-card"
              elevation="0"
              rounded="xl"
            >
              <v-card-text class="pa-8 pa-md-10">
                <div class="quote-icon mb-4">
                  <v-icon icon="mdi-format-quote-open" size="48" color="primary" />
                </div>
                <blockquote class="quote-text mb-6">
                  {{ quote.text }}
                </blockquote>
                <footer class="quote-author">— {{ quote.author }}</footer>
              </v-card-text>
              <div class="card-shine"></div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- "מבריחה לבחירה" Section -->
    <v-container fluid class="transformation-section py-16">
      <div class="floating-shapes">
        <div class="floating-shape shape-circle"></div>
        <div class="floating-shape shape-square"></div>
        <div class="floating-shape shape-triangle"></div>
      </div>
      <v-container style="position: relative; z-index: 1;">
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <div class="transformation-badge mb-6">
              <v-icon icon="mdi-arrow-right-bold-circle" start size="small" />
              מבריחה לבחירה
            </div>
            <h2 class="transformation-title mb-8">
              מסע מביטחון לעצמי
            </h2>
            <p class="transformation-text">
              תהליך מעצים ומעורר השראה של פיתוח הביטחון – בעצמי, ביכולות שלי ולמול החברה –
              המבוסס על הגרסה הבטוחה של עצמי!
            </p>
            <p class="transformation-text">
              המתקיים בקבוצה ייחודית נבחרת, שתיקרא <strong>'חברת סקרנות ולמידה'</strong>
              בהנחיית משה יצחק שידלובסקי - מרצה ויועץ בעל שם בתחום הרגש וההתפתחות האישית
            </p>
            <div class="mt-10">
              <v-btn
                color="primary"
                size="x-large"
                rounded="xl"
                :to="{ name: 'groups' }"
                elevation="8"
                class="transformation-btn"
              >
                <v-icon icon="mdi-account-group" start />
                למידע על חברת סקרנות ולמידה
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Three Paths Section -->
    <v-container class="py-16">
      <div class="text-center mb-12">
        <div class="section-badge mb-4">
          <v-icon icon="mdi-map-marker-path" start size="small" />
          שלושה מסלולים
        </div>
        <h2 class="section-title">איך אפשר להתחיל?</h2>
      </div>
      <v-row>
        <v-col v-for="path in paths" :key="path.title" cols="12" md="4">
          <v-card class="path-card elevated-card" elevation="0" height="100%">
            <div class="card-corner-decoration"></div>
            <div class="path-icon-wrapper">
              <div class="icon-background">
                <v-icon :icon="path.icon" size="56" color="primary" />
              </div>
            </div>
            <v-card-text class="text-center pa-8">
              <h3 class="path-title mb-4">{{ path.title }}</h3>
              <p class="path-description mb-6" style="flex-grow: 1;">{{ path.description }}</p>
              <div style="margin-top: auto;">
                <v-btn
                  :color="path.btnColor"
                  size="large"
                  rounded="xl"
                  :to="{ name: path.link }"
                  block
                  elevation="4"
                >
                  <v-icon :icon="path.btnIcon" start />
                  {{ path.btnText }}
                </v-btn>
              </div>
            </v-card-text>
            <div class="card-shine"></div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- About Preview -->
    <v-container fluid class="about-preview-section py-16">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="5">
            <div class="about-image-wrapper">
              <div class="image-glow"></div>
              <img
                src="/therapist-photo.jpg"
                alt="משה יצחק שידלובסקי"
                class="about-preview-image"
              />
            </div>
          </v-col>
          <v-col cols="12" md="7">
            <div class="about-content">
              <div class="section-badge mb-4">
                <v-icon icon="mdi-account-circle" start size="small" />
                מי מנחה אתכם במסע?
              </div>
              <h2 class="about-title mb-6">משה יצחק שידלובסקי</h2>
              <p class="about-subtitle mb-6">מרצה, יועץ ומטפל רב תחומי. יוצר גישת סולתרפיה - סקרנות ולמידה</p>
              <p class="about-text mb-4">
                "מסע תגליות אמיתי אינו כרוך בחיפוש אחר נופים חדשים אלא ברכישת עיניים חדשות" - מרסל פרוסט.
              </p>
              <p class="about-text mb-4">
                משפט זה משקף את ליבת הגישה שלי: המטרה אינה לשנות את המציאות, אלא להכיר אותה בעיניים
                חדשות, מתוך סקרנות אמיתית.
              </p>
              <v-btn
                color="primary"
                size="x-large"
                rounded="xl"
                :to="{ name: 'about' }"
                class="mt-6"
                elevation="6"
              >
                <v-icon icon="mdi-arrow-left" start />
                קראו עוד עליי
              </v-btn>
            </div>
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
              <v-icon icon="mdi-rocket-launch" size="64" class="mb-6 cta-icon" />
              <h2 class="cta-title mb-4">מוכנים להתחיל את המסע&#x2E;</h2>
              <p class="cta-text mb-8">
                המסע מתחיל בשיחה אחת. בואו נתחיל את התהליך יחד.<br>
                צרו קשר עוד היום לקביעת פגישת היכרות.
              </p>
              <v-btn
                color="white"
                size="x-large"
                rounded="xl"
                :to="{ name: 'contact' }"
                class="cta-main-button"
                elevation="0"
              >
                <v-icon icon="mdi-email-outline" start />
                צרו קשר עכשיו
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const quotes = [
  {
    text: 'לעולם ילמד אדם מה שלבו חפץ.',
    author: 'חז"ל',
  },
  {
    text: 'מסע תגליות אמיתי אינו כרוך בחיפוש אחר נופים חדשים, אלא ברכישת עיניים חדשות.',
    author: 'מרסל פרוסט',
  },
]

const paths = [
  {
    icon: 'mdi-book-open-page-variant',
    title: 'גלו את הגישה',
    description: 'הבינו מהי סולתרפיה ואיך היא עובדת - סקרנות מול פחד, למידה חיה, והתעניינות אנושית',
    btnColor: 'primary',
    btnIcon: 'mdi-compass',
    btnText: 'מהי סולתרפיה?',
    link: 'what-is-soltherapy',
  },
  {
    icon: 'mdi-account-group',
    title: 'הצטרפו לקבוצה',
    description: 'חברת סקרנות ולמידה - 12 מפגשים תהליכיים לפיתוח ביטחון עצמי וצמיחה אישית בקבוצה מעצימה',
    btnColor: 'primary',
    btnIcon: 'mdi-account-multiple-plus',
    btnText: 'פרטי הקבוצה',
    link: 'groups',
  },
  {
    icon: 'mdi-account-heart',
    title: 'פגישה אישית',
    description: 'טיפול אישי מותאם ומעמיק בגישת סולתרפיה - מפגש אחד על אחד עם משה יצחק שידלובסקי',
    btnColor: 'primary',
    btnIcon: 'mdi-calendar-check',
    btnText: 'צרו קשר',
    link: 'contact',
  },
]
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%);
  color: #0D47A1;
  position: relative;
  overflow: hidden;
  min-height: 700px;
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

.cloud-4 {
  width: 110px;
  height: 38px;
  top: 80%;
  left: 40%;
  animation-delay: -10s;
}

.cloud-4::before {
  width: 48px;
  height: 48px;
  top: -24px;
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
  bottom: -60px;
  left: -60px;
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
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
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
  box-shadow: 0 15px 50px rgba(21, 101, 192, 0.3);
}

.hero-icon {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 6px 12px rgba(21, 101, 192, 0.3));
  color: #1565C0 !important;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  line-height: 1.8;
  opacity: 0.95;
  max-width: 900px;
  margin: 0 auto;
}

.hero-definition {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px 32px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(21, 101, 192, 0.2);
  max-width: 700px;
  margin: 0 auto;
}

.hero-definition p {
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin: 0;
  color: #0D47A1;
}

.hero-btn {
  font-size: 1.0625rem;
  font-weight: 600;
  padding: 0 40px !important;
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(21, 101, 192, 0.4) !important;
}

.hero-btn-outline {
  font-size: 1.0625rem;
  font-weight: 600;
  padding: 0 40px !important;
  color: #1565C0 !important;
  transition: all 0.3s ease;
}

.hero-btn-outline:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
}

.quotes-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.quote-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%);
  border: 2px solid #E3F2FD;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.quote-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(21, 101, 192, 0.2) !important;
  border-color: #90CAF9;
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

.quote-card:hover .card-shine {
  left: 150%;
}

.quote-icon {
  display: flex;
  justify-content: flex-start;
}

.quote-text {
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
  font-style: italic;
}

.quote-author {
  font-size: clamp(1rem, 2vw, 1.125rem);
  color: #1565C0;
  font-weight: 700;
  text-align: left;
}

.transformation-section {
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

.transformation-badge {
  display: inline-block;
  background: linear-gradient(135deg, #1565C0, #0D47A1);
  color: white;
  padding: 10px 28px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 16px rgba(21, 101, 192, 0.3);
}

.transformation-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #0D47A1;
}

.transformation-text {
  font-size: clamp(1.0625rem, 2.5vw, 1.3125rem);
  line-height: 2;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 24px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.transformation-btn {
  font-size: 1.0625rem;
  font-weight: 600;
  padding: 0 48px !important;
  transition: all 0.3s ease;
}

.transformation-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 32px rgba(21, 101, 192, 0.4) !important;
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

.path-card {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.path-card .v-card-text {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.path-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
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

.elevated-card:hover .icon-background {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 12px 32px rgba(21, 101, 192, 0.25);
}

.path-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0D47A1;
}

.path-description {
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.8);
}

.about-preview-section {
  background: linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%);
}

.about-image-wrapper {
  width: 100%;
  max-width: 400px;
  height: 400px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(21, 101, 192, 0.3);
  border: 8px solid #90CAF9;
  position: relative;
  transition: all 0.5s ease;
}

.about-image-wrapper:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 30px 80px rgba(21, 101, 192, 0.4);
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

.about-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.about-image-wrapper:hover .about-preview-image {
  transform: scale(1.1);
}

.about-content {
  padding: 0 24px;
}

.about-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #0D47A1;
}

.about-subtitle {
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  color: #1565C0;
  font-weight: 600;
}

.about-text {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.9;
  color: rgba(0, 0, 0, 0.8);
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
