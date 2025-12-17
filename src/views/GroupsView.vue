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
              <v-icon icon="mdi-account-group" size="64" class="hero-icon" />
            </div>
            <h1 class="page-title">חברת סקרנות ולמידה</h1>
            <p class="page-subtitle mt-6" style="max-width: 900px; margin-left: auto; margin-right: auto;">
              מסע מביטחון לעצמי - תהליך מעצים ומעורר השראה של פיתוח הביטחון<br>
              בעצמי, ביכולות שלי ולמול החברה - המבוסס על הגרסה הבטוחה של עצמי
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Stories Section -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="10">
          <div class="text-center mb-12">
            <div class="section-badge mb-4">
              <v-icon icon="mdi-book-open-variant" start size="small" />
              למי זה מיועד?
            </div>
            <h2 class="section-title mb-8">סיפורים שמדברים אליך</h2>
          </div>

          <v-card class="stories-card" elevation="0" rounded="xl">
            <v-card-text class="pa-8 pa-md-12">
              <div class="story-intro mb-8">
                <p class="story-text highlight">
                  בדיוק בשבילם אנו פותחים מסגרת בוטיק של 'קבוצות תהליך - תוכן' בגישת סולתרפיה של 'מכון MS'
                </p>
                <p class="story-text highlight">
                  שבהם כל אלו ועוד, יכולים לקבל מענה הולם,
                  שיתיר אותם מבית האסורים של הפחד,
                  יתיר מהם את החרדות והחסימות,
                  ויתיר להם לבוא בקהל ולהעניק לו מזיו אישיותם
                </p>
              </div>

              <div class="stories-grid">
                <v-card
                  v-for="(story, index) in stories"
                  :key="index"
                  class="story-item-card mb-4"
                  elevation="0"
                  rounded="lg"
                >
                  <v-card-text class="pa-5">
                    <div class="story-item-content">
                      <v-icon icon="mdi-account-voice" size="24" color="primary" class="story-icon" />
                      <span class="story-text-styled">{{ story }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <div class="story-outro mt-10">
                <p class="story-text highlight">
                  הקבוצה מתאימה בפרט לך -<br>
                  אם אתה אדם איכותי, בעל אישיות מלאת רגש וכישרון, ואולי אפילו נחשב חברותי,<br>
                  אך הינך מרגיש בדידות בתוך שאר עמך וסביבתך,<br>
                  מרגיש שאין מי שמבין, אין מי שמרגיש –<br><br>
                  <strong>אתה מוזמן בחום!!</strong>
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Details Section -->
    <v-container fluid class="details-section py-16">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10">
            <div class="text-center mb-12">
              <div class="section-badge mb-4">
                <v-icon icon="mdi-information" start size="small" />
                פרטים על החברה
              </div>
            </div>

            <v-row>
              <!-- What -->
              <v-col cols="12" md="4">
                <v-card class="detail-card" height="100%" elevation="0" rounded="xl">
                  <v-card-text class="pa-6">
                    <div class="detail-icon-wrapper mb-4">
                      <v-icon icon="mdi-help-circle" size="40" color="primary" />
                    </div>
                    <h3 class="detail-title mb-4">מה בחברה?</h3>
                    <p class="detail-text">
                      חברת תהליך - קבוצת תוכן בגישת סולתרפיה, המבוססת על הגל השלישי של CBT ומיינדפולנס,
                      ומשלבת אלמנטים מהפסיכואנליזה. התהליך יתמקד במכלול נושאים הקשורים לביטחון עצמי,
                      החל מחרדה חברתית, פחד קהל, בדידות, נחיתות, ודימוי עצמי, וכלה בהתפתחות אישית,
                      מימוש עצמי, קבלת החלטות, יציאה מאזור הנוחות, ופריצת גבולות.
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Who -->
              <v-col cols="12" md="4">
                <v-card class="detail-card" height="100%" elevation="0" rounded="xl">
                  <v-card-text class="pa-6">
                    <div class="detail-icon-wrapper mb-4">
                      <v-icon icon="mdi-account-multiple" size="40" color="primary" />
                    </div>
                    <h3 class="detail-title mb-4">למי מיועדת?</h3>
                    <p class="detail-text">
                      החברה מיועדת למעוניינים ליצור שינוי מהותי בעצמם, לפתח ביטחון עצמי במישור החברתי,
                      התעסוקתי והמשפחתי. כמו כן, היא מיועדת לאנשים שחשוב להם להעשיר את הנפש, לפרוץ את
                      המגבלות האישיות והחברתיות, ולהיות אנשים טובים יותר לעצמם ולסביבה. החברה מתאימה
                      במיוחד לעוסקים בחינוך, ייעוץ וטיפול, המעוניינים להגיע לרף גבוה יותר בפן המקצועי
                      והאישי כאחד.
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Format -->
              <v-col cols="12" md="4">
                <v-card class="detail-card" height="100%" elevation="0" rounded="xl">
                  <v-card-text class="pa-6">
                    <div class="detail-icon-wrapper mb-4">
                      <v-icon icon="mdi-calendar-clock" size="40" color="primary" />
                    </div>
                    <h3 class="detail-title mb-4">מתכונת החברה</h3>
                    <p class="detail-text">
                      החברה תתקיים בקבוצה סגורה של עד 30 משתתפים, פעם בשבוע בימי שני, בין השעות 17:00
                      ל-21:00, למשך 12 מפגשים. כל מפגש יחולק לשניים: החלק הראשון יוקדש ללמידה בקבוצה
                      (הקניית תוכן, הרצאה ותיאור מקרה) והחלק השני להתנסות בקבוצה (טיפול דרך הדגמות,
                      תרגול, והנחייה להמשך השבוע).
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Program Section -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="10">
          <div class="text-center mb-12">
            <div class="section-badge mb-4">
              <v-icon icon="mdi-map-marker-path" start size="small" />
              תוכנית המפגשים
            </div>
            <h2 class="section-title mb-4">12 מפגשים תהליכיים + 3–4 מפגשי תרגול והעמקה</h2>
            <p class="section-subtitle">
              גישה ייחודית המשלבת דיאלוג קבוצתי, חקירה עצמית, והתנסות חיה במפגש<br>
              פיתוח "שריר הסקרנות" ככלי להתמודדות עם פחדים, תקיעות ודפוסים בין-אישיים
            </p>
          </div>

          <div class="sessions-grid">
            <v-card
              v-for="session in sessions"
              :key="session.number"
              class="session-card"
              elevation="0"
              rounded="xl"
            >
              <div class="session-number-badge">{{ session.number }}</div>
              <v-card-text class="pa-6">
                <h3 class="session-title mb-4">{{ session.title }}</h3>
                <ul class="session-points mb-4">
                  <li v-for="(point, index) in session.points" :key="index">{{ point }}</li>
                </ul>
                <div class="session-insight">
                  <div class="insight-label">תובנה סולתרפית:</div>
                  <div class="insight-text">{{ session.insight }}</div>
                </div>
              </v-card-text>
              <div class="card-shine"></div>
            </v-card>
          </div>
        </v-col>
      </v-row>
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
              <v-icon icon="mdi-account-multiple-plus" size="64" class="mb-6 cta-icon" />
              <h2 class="cta-title mb-4">מוכנים להצטרף?</h2>
              <p class="cta-text mb-8">
                זו ההזדמנות שלך להצטרף לקבוצה ייחודית ומעצימה שתשנה את חייך.<br>
                צור קשר עוד היום לקבלת פרטים נוספים ולהרשמה.
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
                צרו קשר להרשמה
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const stories = [
  'אותו מלמד, שפנה אלי לפני שנה, ולא היה מסוגל לספר שהוא מרגיש חרדה איומה מהתלמידים שלו בני העשר',
  'אותו אברך, שהשווער שלו סידר לו שטעלא בשיעור א\' ישיבה גדולה והוא מרגיש שכל גופו נהיה משותק רק מהמחשבה על הרעיון',
  'אותו בעל שמחה, שחש צמרמורת מהצורך להושיט יד לכל אלה שבאים לאחל מזל טוב, \'והוא לא יודע מה לענות להם..\'',
  'אותו מתווך, שכוחו בפיו, ואין לו שום בעיה להרבות בשבח דירה פלונית והוא מקבל הצעה לעלות רמה ולהפוך למשווק בלעדי של פרויקט שתמיד חלם עליו, אבל הוא מקבל פיק ברכיים מזה שיגלו שהוא לא שיווק פרויקטים מעולם',
  'אותו גביר מהשטיבל, שמוזמן לוועידה יוקרתית של \'נדיבי עם\' וכל אחד מוזמן להציע רעיון לתועלת הקהילה על במה מקושטת ומוארת בפרוז\'קטור, וכבר עכשיו הוא ממצמץ במבוכה ושוקל לוותר על התואר \'גביר\'',
  'אותו מרצה, ששובץ ביום עיון שבו ישתתפו אנשי מקצוע אינטיליגנטים מהשורה הראשונה והוא מתחיל להזיע מהמחשבה - "עכשיו כולם יראו שאין לי מה למכור"',
  'אותו יהודי שנפשו חפצה לסייע לנפשות בני ישראל, והוא מרגיש שאינו מסוגל בשום אופן לפרסם את עצמו בשמו המפורש מחשש לשמוע ש\'\'הנה עוד אחד שחושב שהוא פסיכולוג..\'\'',
  'אותו סופר שנדרך מבקשות של קוראים לפגוש בו, \'\'הם עלולים לצפות לאיזו דמות שאני לא יודע לגלם אותה..\'\'',
  'אותו מתפלל, שנמלט מהבית כנסת לקראת קריאת התורה מחשש שיכבדו אותו בעלייה לתורה',
  'אותו צדיק שמאימת הציבור הוא נמנע לאורך כל השנים מלשמש כשליח ציבור',
  'אותם גליונות, שמונחים בקרן זווית, רק כי מחבריהם נמנע באופן עקבי מלחשוף את הגיונותיו לעולם שמא יקבל הערה על חידוש שאינו לאמיתה של תורה',
  'ואותה לבביות אנושית, שנדחקת תחת מסכה של רושם \'רציני ומכובד\' שלא מאפשר לאנושיות להיחשף בחום אנושי לסביבה - שמא זה יתפרש כרמה נמוכה',
  'אותם חיוכים ואותן מילים טובות, שהצורך להרשים ולהיות חשוב, מונע מהם להאיר ולהעצים את הזולת - שמא זה לא יתקבל בברכה',
]

const sessions = [
  {
    number: 1,
    title: 'פתיחה והיכרות עם סולתרפיה',
    points: [
      'היכרות ראשונית עם המשתתפים',
      'היכרות ראשונית עם השיטה: סקרנות כמנוע לכל סוג תהליך',
      'הצגת המסגרת: מהי קבוצת תהליך-תוכן',
    ],
    insight: 'לא באנו לשנות - באנו להכיר, להתעניין. במקום לפתור את הקושי - נסתקרן לגביו',
  },
  {
    number: 2,
    title: 'למה באתי? ומהי קבוצה בשבילי?',
    points: [
      'שיתוף אישי: מה הביא אותי הנה?',
      'הצגת מטרות הקבוצה: עבודה על ביטחון עצמי, תקשורת בין-אישית, דימוי חברתי',
      'יתרונות ייחודיים בקבוצה – אוניברסליות, שיקוף, תחושת שייכות, תרגול חי',
    ],
    insight: 'יתאפשר לי להתעניין בעצמי - כשאראה את העניין שיש לאחר לגבי',
  },
  {
    number: 3,
    title: 'רגשות חבויים מול החברה',
    points: [
      'מה אני רגיל להסתיר – מעצמי ומאחרים?',
      'איך מתמודדים עם מבוכה, דחייה, ביקורת?',
      'התבוננות סקרנית: מה הרגש הזה רוצה ללמד אותי?',
    ],
    insight: 'האתגר אינו ברגש שמתעורר בי - אלא בצורך להסתיר אותו',
  },
  {
    number: 4,
    title: 'פיתוח שריר הסקרנות',
    points: [
      'מהי סקרנות נפשית?',
      'זיהוי המקומות שבהם הפחד משתלט – והמרתו בשאלות סקרניות',
      'תרגיל אישי: "מה אני מרגיש כשאני לא מנסה להבין או לפתור?"',
    ],
    insight: 'רק כשאיני מנסה למצוא עניין מיוחד - אני מגלה את העניין במציאות האמיתית שלי',
  },
  {
    number: 5,
    title: 'התבוננות קוגניטיבית מתוך סקרנות',
    points: [
      'איך המחשבות שלי מגיבות למציאות?',
      'זיהוי דפוסים קוגניטיביים: הכללות, קטסטרופה, קריאת מחשבות',
      'שינוי תגובה דרך שאלות פתוחות ולא מאשימות',
    ],
    insight: 'רק הסקרנות מה אני באמת חווה - תניע למידה אמיתית על טיב המציאות שלי',
  },
  {
    number: 6,
    title: 'אנליזה סקרנית – מה מניע אותי באמת?',
    points: [
      'לחקור את עצמי לא מתוך ניתוח, אלא מתוך עניין אותנטי',
      'איזה חלק בי מופעל כשאני נפגע, נסגר, מתאמץ מדי?',
      'תרגיל קבוצתי: תפקידים חבויים ביחסים',
    ],
    insight: 'כל ניסיון להבין - עלול להחמיץ את הלמידה האותנטית של מערכת ההפעלה שלי',
  },
  {
    number: 7,
    title: 'כאן ועכשיו – תרגול חי',
    points: [
      'מה קורה איתי ברגע הזה?',
      'תגובות תוך כדי הקבוצה: שתיקה, עצבנות, רצון להתבלט',
      'תרגול תשומת לב חיה בלי שיפוט',
    ],
    insight: 'רק כשנפסיק לנסות להיאחז ברגע - נתחיל לחיות אותו באמת',
  },
  {
    number: 8,
    title: 'הקבוצה כמראה – סקרנות לאחר',
    points: [
      'לא רק מה הם חושבים עליי – אלא מה אני לומד כשאני מתבונן בהם',
      'פרקטיקות של הקשבה לא שיפוטית',
      'בניית ביטחון דרך קשר ולא דרך מופע',
    ],
    insight: 'במקום להטריד את עצמי במה חושבים עלי - אני יכול להיות סקרן מה אני חושב על אחרים',
  },
  {
    number: 9,
    title: 'פחדים ואי-ודאות',
    points: [
      'ממה אני מפחד חברתית?',
      'איך אני מגיב לחוסר שליטה, שתיקה, בוז, דחייה?',
      'לפגוש את הפחד בסקרנות: איפה הוא פוגש אותי בגוף ובמחשבה?',
    ],
    insight: 'הכוח של הפחד מופעל נגדי - כשהסקרנות שלי לגביו לא קיימת',
  },
  {
    number: 10,
    title: 'כלים מרחיבי תודעה',
    points: [
      'הכרות עם עקרונות מ-CBT – רקע ככלי עזר',
      'איך משלבים סקרנות עם בדיקה אמפירית, ניסוי, חקירה',
      'התנסות בדיבור פנימי סקרן מתוך חמלה עצמית - הגל השלישי',
    ],
    insight: 'כשאני מוכן לשהות בתוך החוויה המרתיעה - הסקרנות תאפשר לי להרחיב את הלמידה מה יפתור אותה',
  },
  {
    number: 11,
    title: 'מה למדתי עליי?',
    points: [
      'רפלקציה קבוצתית: שיתוף במה שגיליתי על עצמי דרך האחרים',
      'ניסוח אישי מחודש: מהי הסקרנות שלי היום?',
      'שימור למידה פנימית',
    ],
    insight: 'הסקרנות האידיאלית היא זו שלא מחפשת רק ריגוש חדש - אלא סקרנית למה שכבר קורה',
  },
  {
    number: 12,
    title: 'תנועה פתוחה – לאן עכשיו?',
    points: [
      'סיום פתוח, לא כ"סוף טיפול" אלא כנקודת תנועה',
      'הזמנה להמשיך לפעול, להקשיב, להתחבר גם מחוץ לקבוצה',
      'חיבור הקבוצה כקהילה מתהווה',
    ],
    insight: 'הסקרנות שלי להכיר (את עצמי ואת זולתי) - תוכל להתמיד ולהתפתח ככל שההיכרות תתעצם',
  },
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
  font-size: clamp(1.0625rem, 2.5vw, 1.25rem);
  line-height: 1.9;
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

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.7);
  max-width: 800px;
  margin: 0 auto;
}

.stories-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%);
  border: 2px solid #E3F2FD;
}

.story-intro,
.story-outro {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.3), rgba(187, 222, 251, 0.2));
  border-radius: 16px;
}

.story-text {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.9;
  color: rgba(0, 0, 0, 0.87);
}

.story-text.highlight {
  font-weight: 600;
  color: #0D47A1;
  font-size: clamp(1.0625rem, 2vw, 1.1875rem);
}

.stories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.story-item-compact {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 8px 12px;
}

.story-item-card {
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.3), rgba(255, 255, 255, 0.8));
  border: 1px solid rgba(21, 101, 192, 0.1);
  transition: all 0.3s ease;
}

.story-item-card:hover {
  transform: translateX(-4px);
  box-shadow: 0 4px 16px rgba(21, 101, 192, 0.15) !important;
  border-color: rgba(21, 101, 192, 0.3);
}

.story-item-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.story-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.story-text-styled {
  flex: 1;
  font-size: 1.0625rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.87);
}

.details-section {
  background: linear-gradient(180deg, #F5F7FA 0%, #E3F2FD 100%);
}

.detail-card {
  background: white;
  border: 1px solid #E3F2FD;
  transition: all 0.4s ease;
}

.detail-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(21, 101, 192, 0.15) !important;
  border-color: #90CAF9;
}

.detail-icon-wrapper {
  display: flex;
  justify-content: flex-start;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0D47A1;
}

.detail-text {
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.8);
}

.sessions-grid {
  display: grid;
  gap: 24px;
}

.session-card {
  background: white;
  border: 1px solid #E3F2FD;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.session-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 16px 40px rgba(21, 101, 192, 0.2) !important;
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

.session-card:hover .card-shine {
  left: 150%;
}

.session-number-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1565C0, #0D47A1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 6px 16px rgba(21, 101, 192, 0.3);
  z-index: 1;
}

.session-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #0D47A1;
  padding-right: 80px;
}

.session-points {
  list-style: none;
  padding: 0;
  margin: 0;
}

.session-points li {
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.8);
  padding: 8px 28px 8px 0;
  position: relative;
}

.session-points li::before {
  content: '◀';
  position: absolute;
  right: 8px;
  color: #1565C0;
  font-size: 0.875rem;
}

.session-insight {
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.5), rgba(187, 222, 251, 0.3));
  padding: 16px;
  border-radius: 12px;
  border-right: 4px solid #1565C0;
  margin-top: 16px;
}

.insight-label {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1565C0;
  margin-bottom: 8px;
}

.insight-text {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.87);
  font-style: italic;
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

