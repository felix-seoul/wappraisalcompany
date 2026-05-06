# W 감정평가사무소 — W Appraisal Company

공식 웹사이트 소스코드  
URL: https://wappraisalcompany.com

## 구조

```
/
├── index.html          # 언어 감지 → /kr/ 또는 /en/ 리다이렉트
├── kr/                 # 한국어 페이지
│   ├── index.html      # 메인 홈페이지
│   ├── company.html
│   ├── representative.html
│   ├── services.html
│   ├── fees.html
│   ├── required-documents.html
│   ├── faq.html
│   ├── case-studies.html
│   ├── contact.html
│   └── services/       # 서비스 상세 페이지
├── en/                 # English pages
│   └── ...
├── assets/
│   ├── css/style.css   # 디자인 시스템
│   └── js/main.js      # 인터랙션 + 폼 처리
├── sitemap.xml
└── robots.txt
```

## 폼 연동 (Google Sheets)

1. `gas_form_handler.js` 내용을 Google Apps Script에 붙여넣기
2. SHEET_ID를 실제 Google Spreadsheet ID로 변경
3. 웹 앱으로 배포 후 URL을 `assets/js/main.js`의 `GAS_URL`에 입력

## GitHub Pages 배포

```bash
git init
git add .
git commit -m "Initial release"
git remote add origin https://github.com/YOUR_USERNAME/wappraisal.git
git push -u origin main
```

Settings → Pages → Source: main branch, / (root)

## 커스텀 도메인

GitHub Pages Settings → Custom domain → wappraisalcompany.com
DNS: CNAME record pointing to YOUR_USERNAME.github.io
