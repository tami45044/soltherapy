# 📦 הוראות גיבוי ושחזור - מדריך מלא

## 🎯 הפרדת סביבות

### 🧪 סביבת פיתוח (Development) - soltherapy-test
- **מה זה?** עותק של הנתונים האמיתיים לבדיקות
- **איך משתמשים?** `npm run dev` במחשב
- **בטוח לנסות דברים?** ✅ כן! שינויים לא משפיעים על הנתונים האמיתיים
- **Project ID:** `soltherapy-test`

### 🔴 סביבת ייצור (Production) - soltherapy-manage
- **מה זה?** הנתונים האמיתיים שלך
- **איפה?** האתר האמיתי (Vercel)
- **זהירות!** ⚠️ שינויים משפיעים על הנתונים האמיתיים
- **Project ID:** `soltherapy-manage`

---

## 💾 יצירת גיבוי

### דרך 1: גיבוי מהמערכת (מומלץ! קל וב טוח!)

1. **היכנסי למערכת** (במחשב או באתר)
2. **לכי לדשבורד**
3. **לחצי על הכפתור "גיבוי נתונים"** (למעלה מימין, כפתור ירוק)
4. **אשרי את הפופאפ**
5. **הקבצים ירדו לתיקיית Downloads שלך!** 🎉

**מה זה יוריד:**
- `YYYY-MM-DDTHH-MM-SS_clients.json` - כל הלקוחות
- `YYYY-MM-DDTHH-MM-SS_appointments.json` - כל הפגישות
- `YYYY-MM-DDTHH-MM-SS_schedule_template.json` - התבנית השבועית
- `YYYY-MM-DDTHH-MM-SS_weekly_prizes.json` - הפרסים
- `YYYY-MM-DDTHH-MM-SS_summary.json` - סיכום הגיבוי

### דרך 2: גיבוי ידני (מ-Firebase Console)

1. לכי ל: https://console.firebase.google.com/project/soltherapy-manage/firestore
2. לחצי על כל collection
3. לחצי על ה-3 נקודות → "Export collection"
4. שמרי את הקובץ

---

## 🔄 שחזור מגיבוי

אם קרתה תקלה ויש לך גיבוי:

1. **פתחי את קובץ הגיבוי** (למשל `backups/2024-12-23T15-30-00/appointments.json`)

2. **לכי ל-Firebase Console:**
   ```
   https://console.firebase.google.com/project/soltherapy-manage/firestore
   ```

3. **לכל collection שנמחק:**
   - לחצי "Start collection"
   - תני את השם (למשל `appointments`)
   - תוסיפי document אחד ידנית (כדי ליצור את ה-collection)

4. **ייבוא הנתונים:**
   - צור סקריפט שחזור (אשלח לך אם צריך)
   - או העתיקי ידנית מהגיבוי

---

## ⚠️ חשוב לזכור!

### ✅ עשי גיבוי:
- **לפני כל שינוי גדול** בקוד
- **פעם בשבוע** (ביום שישי בערב)
- **לפני שמנסים feature חדש**
- **אחרי יום עבודה עם הרבה פגישות**

### 🚫 אל תעשי:
- ❌ לא לשתף את קבצי `.env.*` (הם ב-gitignore!)
- ❌ לא להריץ קוד מחיקה ישירות על Production
- ❌ לא לפתח על ה-database האמיתי (השתמשי ב-Development!)

---

## 🔧 בדיקה שהכל עובד

### בדיקת סביבת Development:

1. **הריצי:** `npm run dev`
2. **פתחי קונסול (F12)**
3. **תראי:** `🔥 Firebase Environment: development`
4. **תראי:** `🔥 Firebase Project: soltherapy-test`

✅ אם רשום `soltherapy-test` - מעולה! את עובדת על סביבת פיתוח!

### בדיקת סביבת Production (באתר האמיתי):

1. **לכי לאתר האמיתי** (לא localhost)
2. **פתחי קונסול (F12)**
3. **תראי:** `🔥 Firebase Environment: production`
4. **תראי:** `🔥 Firebase Project: soltherapy-manage`

✅ אם רשום `soltherapy-manage` - מעולה! האתר משתמש בנתונים האמיתיים!

---

## 📞 עזרה

אם משהו לא עובד:
1. בדקי שהקבצים `.env.development` ו-`.env.production` קיימים
2. עצרי את `npm run dev` והריצי שוב
3. בדקי את הקונסול - יש הודעת שגיאה?

---

## 🎓 למה זה חשוב?

- **הפרדת סביבות** = לא להרוס נתונים אמיתיים בטעות
- **גיבויים קבועים** = שקט נפשי ויכולת לשחזר
- **גיבוי לפני שינויים** = אם משהו משתבש, יש ממה לשחזר

