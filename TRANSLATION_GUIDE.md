# 📘 معايير الترجمة في مشروع EcoVision

## ✅ القواعد الأساسية:

### 1. **ممنوع نهائياً Hard-coded Text**
❌ **خطأ:**
```javascript
<h1>{isAr ? 'مرحباً' : 'Hello'}</h1>
```

✅ **صح:**
```javascript
<h1>{t('common.welcome')}</h1>
```

---

### 2. **استخدام useLanguage() Hook**
```javascript
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, locale, isRTL } = useLanguage();
  
  return <p>{t('section.key')}</p>;
}
```

---

### 3. **ملفات الترجمة**
كل النصوص موجودة في:
- `/src/locales/ar.json` (عربي)
- `/src/locales/en.json` (English)

**المفاتيح لازم تكون متطابقة في الملفين!**

---

### 4. **هيكل الترجمات**
```json
{
  "section_name": {
    "key": "قيمة",
    "another_key": "قيمة أخرى"
  }
}
```

**أمثلة:**
```javascript
t('nav.dashboard')           // "لوحة المعلومات"
t('dashboard.totalEmissions') // "إجمالي الانبعاثات"
t('common.save')              // "حفظ"
```

---

### 5. **RTL/LTR Support**
- الموقع يقلب تلقائياً حسب اللغة
- استخدم `isRTL` لأي logic يحتاج اتجاه

```javascript
const { isRTL } = useLanguage();

<div className={isRTL ? 'text-right' : 'text-left'}>
```

---

## 🎯 الأقسام الموجودة:

### في `ar.json` و `en.json`:
- `nav` - Navigation menu
- `common` - كلمات مشتركة
- `dashboard` - لوحة المعلومات
- `emissions_calculator` - حاسبة الانبعاثات
- `ai_insights` - رؤى AI
- `esg_reports` - تقارير ESG
- `reports_log` - سجل التقارير
- `company_profile` - ملف الشركة
- `settings` - الإعدادات
- `chatbot` - المساعد الذكي

---

## 📝 إضافة ترجمات جديدة:

### الخطوات:
1. افتح `src/locales/ar.json`
2. أضف المفتاح والقيمة العربية
3. افتح `src/locales/en.json`
4. أضف **نفس المفتاح** مع القيمة بالإنجليزي
5. استخدم `t('section.key')` في الكود

---

## ⚠️ أخطاء شائعة:

### ❌ **خطأ 1: نص مباشر**
```javascript
<button>احفظ</button>  // ❌
```
✅ **الصح:**
```javascript
<button>{t('common.save')}</button>
```

---

### ❌ **خطأ 2: مفتاح مختلف**
**ar.json:**
```json
{ "title": "عنوان" }
```
**en.json:**
```json
{ "heading": "Title" }  // ❌ المفتاح مختلف!
```

✅ **الصح:**
```json
{ "title": "Title" }
```

---

### ❌ **خطأ 3: نسيان useLanguage()**
```javascript
function Page() {
  return <h1>{t('title')}</h1>;  // ❌ t مش معرّف!
}
```

✅ **الصح:**
```javascript
function Page() {
  const { t } = useLanguage();
  return <h1>{t('title')}</h1>;
}
```

---

## 🚀 الخلاصة:

✅ **كل نص** لازم يطلع من `t()`  
✅ **المفاتيح** متطابقة في `ar.json` و `en.json`  
✅ **استخدام** `useLanguage()` في كل component  
✅ **RTL/LTR** بيشتغل تلقائياً  

---

**أي سؤال؟ راجع الملف ده أو شوف أمثلة في `/src/app/dashboard/page.js`**
