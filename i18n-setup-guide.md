# Hướng dẫn cài đặt i18n cho L-Edu

## 1. Cài đặt dependencies

Chạy lệnh sau trong thư mục L-Edu-FE:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## 2. Cấu trúc file đã tạo

```
L-Edu-FE/src/
├── i18n/
│   ├── index.ts                 # Cấu hình i18n chính
│   └── locales/
│       ├── vi.json             # Ngôn ngữ tiếng Việt
│       └── en.json             # Ngôn ngữ tiếng Anh
└── components/
    └── common/
        └── LanguageSwitcher.tsx # Component chuyển đổi ngôn ngữ
```

## 3. Các file đã được cập nhật

- `App.tsx` - Import i18n configuration
- `Header.tsx` - Thêm LanguageSwitcher và sử dụng translations
- `Login.tsx` - Sử dụng translations cho các text

## 4. Cách sử dụng

### Trong component:
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('auth.login.title')}</h1>
      <p>{t('auth.login.subtitle')}</p>
    </div>
  );
};
```

### Chuyển đổi ngôn ngữ:
```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();

// Chuyển sang tiếng Việt
i18n.changeLanguage('vi');

// Chuyển sang tiếng Anh
i18n.changeLanguage('en');
```

## 5. Thêm translations mới

Để thêm text mới, cập nhật cả 2 file:
- `src/i18n/locales/vi.json`
- `src/i18n/locales/en.json`

Ví dụ:
```json
{
  "newSection": {
    "title": "Tiêu đề mới",
    "description": "Mô tả mới"
  }
}
```

Sau đó sử dụng: `t('newSection.title')`

## 6. Features

- ✅ Tự động detect ngôn ngữ từ browser
- ✅ Lưu preference vào localStorage
- ✅ Fallback về tiếng Việt nếu không tìm thấy ngôn ngữ
- ✅ Language switcher với dropdown đẹp
- ✅ Support cả desktop và mobile
- ✅ Tích hợp với theme system
- ✅ TypeScript support

## 7. Các ngôn ngữ được hỗ trợ

- 🇻🇳 Tiếng Việt (vi) - Default
- 🇺🇸 English (en)

## 8. Cài đặt hoàn tất

Sau khi cài đặt dependencies, ứng dụng sẽ tự động:
- Detect ngôn ngữ từ browser
- Hiển thị LanguageSwitcher trong header
- Cho phép chuyển đổi ngôn ngữ real-time
- Lưu preference của user
