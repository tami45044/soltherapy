# ⚙️ הגדרות Vercel

## 🔐 הגדרת Environment Variables ב-Vercel

כדי שהאתר האמיתי ישתמש ב-Production database, צריך להגדיר משתנים ב-Vercel:

### צעדים:

1. **לכי ל-Vercel Dashboard:**
   ```
   https://vercel.com/
   ```

2. **בחרי את הפרויקט** `soltherapy-test`

3. **לכי ל:** Settings → Environment Variables

4. **הוסיפי את המשתנים הבאים:**

   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_FIREBASE_API_KEY` | `AIzaSyBKOPNyi4TJ9mVMQFPmLakF-3WcLYzFzEc` | Production |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `soltherapy-manage.firebaseapp.com` | Production |
   | `VITE_FIREBASE_PROJECT_ID` | `soltherapy-manage` | Production |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `soltherapy-manage.firebasestorage.app` | Production |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `710375340022` | Production |
   | `VITE_FIREBASE_APP_ID` | `1:710375340022:web:cc8c104a29ba3170e279d7` | Production |

5. **שמרי את השינויים**

6. **עשי Redeploy** לפרויקט:
   - Settings → Deployments
   - בחרי את ה-deployment האחרון
   - לחצי על ה-3 נקודות → "Redeploy"

---

## ✅ בדיקה שהכל עובד

אחרי ה-Redeploy:

1. **לכי לאתר האמיתי** (לא localhost)
2. **פתחי קונסול (F12)**
3. **תראי:** `🔥 Firebase Project: soltherapy-manage`

✅ אם רשום `soltherapy-manage` - מעולה! האתר משתמש בנתונים האמיתיים!

❌ אם רשום `soltherapy-test` - צריך לבדוק את המשתנים ב-Vercel!

---

## 📝 הערות

- המשתנים האלה **לא נשמרים ב-Git** (הם ב-gitignore)
- Vercel משתמש בהם רק בזמן build
- כל שינוי במשתנים דורש Redeploy

