<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="services-header">
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
              <v-icon icon="mdi-hand-heart-outline" size="64" class="hero-icon" />
            </div>
            <h1 class="page-title">תחומי הליווי שלנו</h1>
            <p class="page-subtitle mt-4">מסע של חקירה, למידה וצמיחה אישית</p>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Services Grid -->
    <v-container class="py-16">
      <div class="text-center mb-12">
        <div class="section-badge mb-4">
          <v-icon icon="mdi-heart-pulse" start size="small" />
          השירותים שלנו
        </div>
        <h2 class="section-title">תחומי הליווי</h2>
      </div>
      <v-row>
        <v-col v-for="service in services" :key="service.title" cols="12" md="6" lg="4">
          <v-card class="service-card elevated-card" elevation="0" height="100%">
            <div class="card-corner-decoration"></div>
            <v-card-text class="pa-8 service-card-content">
              <div class="service-icon-wrapper mb-4">
                <div class="icon-background">
                  <v-icon :icon="service.icon" size="48" color="primary" />
                </div>
              </div>
              <h3 class="service-title mb-3">{{ service.title }}</h3>
              <p class="service-description mb-4">{{ service.description }}</p>

              <v-divider class="my-4" />

              <h4 class="includes-title mb-2">הטיפול כולל:</h4>
              <ul class="service-includes">
                <li v-for="item in service.includes" :key="item">{{ item }}</li>
              </ul>

              <div class="mt-4 tags-wrapper">
                <v-chip v-for="tag in service.tags" :key="tag" size="small" color="secondary" class="ms-2 mb-2">
                  {{ tag }}
                </v-chip>
              </div>
            </v-card-text>
            <div class="card-shine"></div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Process Section -->
    <v-container fluid class="process-section py-16">
      <div class="floating-shapes">
        <div class="floating-shape shape-circle"></div>
        <div class="floating-shape shape-square"></div>
        <div class="floating-shape shape-triangle"></div>
      </div>
      <v-container style="position: relative; z-index: 1;">
        <div class="text-center mb-12">
          <div class="section-badge mb-4">
            <v-icon icon="mdi-map-marker-path" start size="small" />
            התהליך שלנו
          </div>
          <h2 class="section-title">תהליך הטיפול</h2>
        </div>
        <v-row class="process-row">
          <v-col v-for="(step, index) in processSteps" :key="step.title" cols="12" md="3">
            <div class="process-step">
              <div class="step-number-wrapper mb-4">
                <div class="step-number">{{ index + 1 }}</div>
              </div>
              <div class="step-icon-wrapper mb-4">
                <v-icon :icon="step.icon" size="40" color="primary" />
              </div>
              <h4 class="step-title mb-3">{{ step.title }}</h4>
              <p class="step-text">{{ step.text }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- FAQ Section -->
    <v-container fluid class="faq-section-services py-16">
      <div class="floating-shapes-faq">
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
      </v-container>
    </v-container>

    <!-- CTA Section -->
    <v-container class="pb-16">
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
              <v-icon icon="mdi-calendar-heart" size="64" class="mb-6 cta-icon" />
              <h2 class="cta-title mb-4">מעוניינים להתחיל?</h2>
              <p class="cta-text mb-8">
                צור אתנו קשר כדי לקבוע פגישת היכרות ראשונית. ביחד נמצא את הדרך המתאימה ביותר עבורך.
              </p>
              <v-btn color="white" size="x-large" rounded="xl" :to="{ name: 'contact' }" class="cta-main-button" elevation="0">
                <v-icon icon="mdi-email-outline" start />
                צור קשר עכשיו
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const services = [
  {
    icon: 'mdi-account-heart',
    title: 'טיפול אישי',
    description:
      'טיפול אישי פרטני המותאם לצרכים האישיים שלך. במהלך הטיפול נעבוד על הבנת הרגשות, פיתוח כלים להתמודדות ויצירת שינוי משמעותי בחיים.',
    includes: [
      'פגישות שבועיות של 50 דקות',
      'תכנית טיפולית מותאמת אישית',
      'תרגילים וכלים מעשיים',
      'מעקב והערכה מתמדת',
    ],
    tags: ['מבוגרים', 'מתבגרים', 'צעירים'],
  },
  {
    icon: 'mdi-account-multiple-outline',
    title: 'טיפול זוגי',
    description:
      'טיפול המיועד לזוגות המעוניינים לחזק את הקשר ביניהם, לשפר את התקשורת ולפתור קונפליקטים. נעבוד על בניית אמון ויצירת קשר עמוק יותר.',
    includes: [
      'פגישות משותפות או נפרדות',
      'כלי תקשורת זוגית',
      'תרגילים לביצוע ביחד',
      'מעקב והתאמת התהליך',
    ],
    tags: ['זוגות', 'נשואים', 'זוגות לא נשואים'],
  },
  {
    icon: 'mdi-home-heart',
    title: 'טיפול משפחתי',
    description:
      'טיפול המיועד למשפחות המתמודדות עם אתגרים שונים. נעבוד על שיפור התקשורת המשפחתית, פתרון קונפליקטים וחיזוק הקשרים בין בני המשפחה.',
    includes: [
      'פגישות משפחתיות מתואמות',
      'עבודה על דינמיקה משפחתית',
      'כלים לשיפור התקשורת',
      'הדרכה הורית',
    ],
    tags: ['הורים', 'ילדים', 'משפחה'],
  },
  {
    icon: 'mdi-brain',
    title: 'טיפול בחרדות',
    description:
      'טיפול ייעודי להתמודדות עם חרדות, פאניקה ופחדים. נלמד טכניקות הרגעה, נעבוד על שינוי דפוסי חשיבה ונבנה כלים מעשיים להתמודדות יומיומית.',
    includes: [
      'טכניקות הרגעה ונשימה',
      'CBT לטיפול בחרדות',
      'חשיפה מדורגת',
      'כלים מעשיים להתמודדות',
    ],
    tags: ['חרדות', 'פחדים', 'פאניקה'],
  },
  {
    icon: 'mdi-weather-cloudy',
    title: 'טיפול בדיכאון',
    description:
      'טיפול המסייע להתמודד עם תחושות של דיכאון, עצב ואובדן מוטיבציה. נעבוד על זיהוי מחשבות שליליות, פיתוח מיומנויות התמודדות ובניית משמעות בחיים.',
    includes: [
      'זיהוי מחשבות שליליות',
      'פיתוח אסטרטגיות התמודדות',
      'עבודה על מוטיבציה',
      'תכנון פעילויות משמעותיות',
    ],
    tags: ['דיכאון', 'עצב', 'מוטיבציה'],
  },
  {
    icon: 'mdi-lightbulb-on-outline',
    title: 'צמיחה אישית',
    description:
      'ליווי בתהליכי התפתחות והתקדמות אישית. נעבוד על הגדרת מטרות, זיהוי חוזקות, פיתוח מיומנויות חדשות והגשמה עצמית.',
    includes: [
      'הגדרת מטרות ויעדים',
      'זיהוי חוזקות ותחומי פיתוח',
      'בניית תכנית פעולה',
      'ליווי והדרכה מתמשכת',
    ],
    tags: ['פיתוח אישי', 'מטרות', 'הגשמה'],
  },
]

const processSteps = [
  {
    icon: 'mdi-handshake',
    title: 'פגישת היכרות',
    text: 'פגישה ראשונית בה נכיר זה את זה ונבין את הצרכים והציפיות',
  },
  {
    icon: 'mdi-clipboard-text',
    title: 'הערכה ואבחון',
    text: 'הערכת המצב הנוכחי ובניית תכנית טיפולית מותאמת אישית',
  },
  {
    icon: 'mdi-account-arrow-up',
    title: 'תהליך הטיפול',
    text: 'פגישות קבועות עם כלים, תרגילים ותמיכה מתמשכת',
  },
  {
    icon: 'mdi-trophy-outline',
    title: 'השגת יעדים',
    text: 'הערכת התקדמות, חגיגת הישגים וסיום מושכל',
  },
]

const faqs = [
  {
    question: 'כמה זמן אורך תהליך טיפולי?',
    answer:
      'משך הטיפול משתנה בהתאם למטרות האישיות ולמורכבות הנושא. טיפול קצר טווח יכול להימשך 10-15 פגישות, בעוד שטיפול ארוך טווח יכול להימשך חודשים ואף שנים. נעריך את הצרכים בפגישה הראשונה.',
  },
  {
    question: 'מה תדירות הפגישות?',
    answer:
      'בדרך כלל ממליצים על פגישה אחת בשבוע בתחילת התהליך. עם ההתקדמות, אפשר לעבור לפגישות דו-שבועיות או חודשיות. התדירות תותאם לצרכים האישיים שלך.',
  },
  {
    question: 'האם השיחות חסויות?',
    answer:
      'כן, מוחלטות. כל מה שנאמר במסגרת הטיפול נשאר סודי ומוגן על פי חוק. החריגים היחידים הם מצבים של סכנה מיידית לחיים או חובת דיווח על פי חוק.',
  },
  {
    question: 'מה ההבדל בין טיפול פסיכולוגי לפסיכיאטרי?',
    answer:
      'טיפול פסיכולוגי מתמקד בשיחה, הבנת רגשות, שינוי דפוסי חשיבה והתנהגות. טיפול פסיכיאטרי כולל אבחון רפואי ומתן תרופות בנוסף. במקרים מסוימים, השילוב בין השניים הוא היעיל ביותר.',
  },
  {
    question: 'האם אפשר לקיים פגישות באינטרנט?',
    answer:
      'כן, אני מציעה גם פגישות אונליין דרך פלטפורמות מאובטחות. הטיפול האונליין יעיל באותה מידה ומאפשר גמישות ונוחות לאנשים שלא יכולים להגיע פיזית.',
  },
  {
    question: 'מה המחיר לפגישה?',
    answer:
      'מחיר פגישה משתנה בהתאם לסוג הטיפול ולמשך הפגישה. בפגישת ההיכרות נדבר על כל הפרטים הכספיים. אני מציעה גם אפשרויות תשלום גמישות למי שזקוק לכך.',
  },
]
</script>

<style scoped>
.services-header {
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
  width: 110px;
  height: 38px;
  top: 12%;
  left: 12%;
  animation-delay: 0s;
}

.cloud-1::before {
  width: 48px;
  height: 48px;
  top: -24px;
  left: 12px;
}

.cloud-1::after {
  width: 52px;
  height: 26px;
  top: -13px;
  right: 12px;
}

.cloud-2 {
  width: 130px;
  height: 42px;
  top: 65%;
  right: 18%;
  animation-delay: -7s;
}

.cloud-2::before {
  width: 55px;
  height: 55px;
  top: -28px;
  left: 18px;
}

.cloud-2::after {
  width: 65px;
  height: 32px;
  top: -16px;
  right: 18px;
}

.cloud-3 {
  width: 95px;
  height: 33px;
  top: 38%;
  right: 28%;
  animation-delay: -14s;
}

.cloud-3::before {
  width: 42px;
  height: 42px;
  top: -19px;
  left: 12px;
}

.cloud-3::after {
  width: 48px;
  height: 24px;
  top: -11px;
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
  width: 260px;
  height: 260px;
  background: #1565C0;
  top: -85px;
  right: -85px;
  animation: pulse 8s infinite ease-in-out;
}

.shape-2 {
  width: 190px;
  height: 190px;
  background: #0D47A1;
  bottom: -45px;
  left: -45px;
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

.service-card-content {
  position: relative;
  z-index: 1;
}

.service-icon-wrapper {
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
  border-radius: 24px;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0D47A1;
}

.service-description {
  font-size: 1rem;
  line-height: 1.8;
  color: #616161;
}

.includes-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0D47A1;
}

.service-includes {
  padding: 0;
  margin: 0;
  list-style-position: inside;
}

.service-includes li {
  font-size: 0.9375rem;
  line-height: 2;
  color: #616161;
  padding-right: 8px;
}

.tags-wrapper {
}

.process-section {
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

.process-row {
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.process-step {
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.process-step:hover {
  transform: translateY(-8px);
}

.step-number-wrapper {
  display: inline-block;
}

.step-number {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1565C0, #0D47A1);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(21, 101, 192, 0.3);
  transition: all 0.3s ease;
}

.process-step:hover .step-number {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 32px rgba(21, 101, 192, 0.4);
}

.step-icon-wrapper {
  display: flex;
  justify-content: center;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0D47A1;
  text-align: center;
}

.step-text {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #616161;
  text-align: center;
}

.faq-section-services {
  background: linear-gradient(180deg, #F5F7FA 0%, #E3F2FD 100%);
  position: relative;
  overflow: hidden;
}

.floating-shapes-faq {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
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

.faq-question :deep(.v-expansion-panel-title__overlay) {
}

.faq-question :deep(button) {
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

.faq-answer :deep(.v-expansion-panel-text__wrapper) {
}

.faq-answer-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
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

