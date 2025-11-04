# סולתרפיה - אתר למטפלת רגשית

אתר מקצועי ומעוצב למטפלת רגשית, בנוי עם Vue 3, Vite ו-Vuetify 3.

## 🎨 תכונות האתר

- **דף בית** - עמוד נחיתה מרשים עם מסר מרכזי והצגת השירותים
- **אודות** - מידע על המטפלת, הגישה הטיפולית והשכלה
- **טיפולים** - תיאור מפורט של כל סוגי הטיפולים
- **הרצאות** - גלריית סרטונים מיוטיוב עם אפשרות צפייה
- **יצירת קשר** - טופס יצירת קשר ופרטי התקשרות

## 🛠️ טכנולוגיות

- **Vue 3** - Framework מודרני ל-JavaScript
- **Vite** - Build tool מהיר
- **Vuetify 3** - ספריית UI components מעוצבת
- **Vue Router** - ניווט בין דפים
- **TypeScript** - Type safety

## 🎨 עיצוב

האתר מעוצב בגוון צבעים מרגיע ופסטלי:
- ירוק ראשי: #6B9080
- ירוק משני: #A4C3B2
- תכלת בהיר: #CCE3DE
- רקע: #F6FFF8

העיצוב כולל:
- Responsive Design - מותאם לכל גדלי מסך
- אנימציות עדינות
- טיפוגרפיה נקייה וקריאה
- קומפוננטים מודרניים של Vuetify

## 📦 התקנה והרצה

### דרישות מוקדמות
- Node.js (מומלץ גרסה 20+)
- npm

### התקנה

```bash
# התקנת תלויות
npm install
```

### הרצה בסביבת פיתוח

```bash
npm run dev
```

האתר יהיה זמין בכתובת: `http://localhost:5173`

### בנייה לפרודקשן

```bash
npm run build
```

הקבצים המוכנים יהיו בתיקיית `dist/`

### צפייה בגרסת Production

```bash
npm run preview
```

## 📁 מבנה הפרויקט

```
soltherapy-test/
├── src/
│   ├── assets/          # תמונות וקבצי CSS
│   ├── components/      # קומפוננטים משותפים
│   │   ├── Navbar.vue
│   │   └── AppFooter.vue
│   ├── views/           # דפים
│   │   ├── HomeView.vue
│   │   ├── AboutView.vue
│   │   ├── ServicesView.vue
│   │   ├── LecturesView.vue
│   │   └── ContactView.vue
│   ├── router/          # הגדרות ניתוב
│   ├── App.vue          # קומפוננט ראשי
│   └── main.ts          # נקודת כניסה
├── public/              # קבצים סטטיים
└── package.json
```

## 🎥 הרצאות וסרטונים

בדף ההרצאות ניתן:
- לצפות בסרטונים מוטמעים מיוטיוב
- לסנן לפי קטגוריות
- לפתוח סרטונים בחלון מודלי
- להירשם לעדכונים

### הוספת סרטונים חדשים

ערוך את הקובץ `src/views/LecturesView.vue` והוסף אובייקט חדש למערך `videos`:

```javascript
{
  videoId: 'YOUR_YOUTUBE_VIDEO_ID',
  title: 'כותרת הסרטון',
  description: 'תיאור הסרטון',
  thumbnail: 'https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg',
  duration: '15:30',
  tags: ['תג1', 'תג2'],
  category: 'הקטגוריה',
}
```

## 📧 טופס יצירת קשר

הטופס כולל ולידציה מלאה:
- שדות חובה
- בדיקת תקינות אימייל
- הודעת הצלחה
- עיצוב responsive

**שים לב:** כרגע הטופס לא שולח נתונים לשרת. להוספת פונקציונליות זו, יש לממש את הפונקציה `submitForm()` עם קריאה ל-API.

## 🎨 התאמה אישית

### שינוי צבעים

ערוך את הקובץ `src/main.ts` במקטע `theme`:

```typescript
theme: {
  defaultTheme: 'light',
  themes: {
    light: {
      colors: {
        primary: '#YOUR_COLOR',
        secondary: '#YOUR_COLOR',
        // ...
      },
    },
  },
}
```

### הוספת דפים חדשים

1. צור קובץ חדש ב-`src/views/`
2. הוסף route חדש ב-`src/router/index.ts`
3. הוסף קישור בתפריט ב-`src/components/Navbar.vue`

## 📱 Responsive Design

האתר מותאם לכל גדלי מסך:
- Mobile: עד 600px
- Tablet: 600px - 1264px
- Desktop: 1264px+

## 🚀 השלבים הבאים (אופציונלי)

- [ ] חיבור לבסיס נתונים (Firebase/MongoDB)
- [ ] מערכת ניהול תוכן (CMS)
- [ ] הוספת בלוג
- [ ] אינטגרציה עם מערכת קביעת פגישות
- [ ] הוספת Google Maps
- [ ] אופטימיזציה ל-SEO
- [ ] הוספת אנליטיקס (Google Analytics)

## 📄 רישיון

פרויקט זה נוצר למטרות הדגמה.

## 👨‍💻 פיתוח

פותח בעזרת AI Assistant - אוקטובר 2025

---

**נהנת מהפרויקט? כוכב ⭐ יעזור!**
