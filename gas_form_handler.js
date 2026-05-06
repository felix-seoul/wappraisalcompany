/**
 * W 감정평가사무소 — 상담 신청 폼 → Google Sheets 연동
 * 
 * 설치 방법:
 * 1. https://script.google.com 에서 새 프로젝트 생성
 * 2. 아래 코드 전체를 붙여넣기
 * 3. SHEET_ID를 실제 Google Spreadsheet ID로 교체
 * 4. 배포 → 새 배포 → 웹 앱으로 배포
 *    - 실행 대상: 나 (본인)
 *    - 액세스: 모든 사용자
 * 5. 배포 URL을 복사해서 main.js의 GAS_URL에 붙여넣기
 */

const SHEET_ID = 'YOUR_GOOGLE_SPREADSHEET_ID_HERE';
const SHEET_NAME = '상담신청';

// 시트가 없으면 생성하고 헤더 추가
function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      '접수일시', '이름/회사명', '연락처', '이메일',
      '평가대상 소재지', '평가목적', '추가문의', '구분'
    ]);
    // 헤더 스타일
    sheet.getRange(1, 1, 1, 8).setBackground('#071C35').setFontColor('#F7F4EE').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// POST 요청 처리
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    
    sheet.appendRow([
      data._time || new Date().toLocaleString('ko-KR'),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.property_address || '',
      data.purpose || '',
      data.message || '',
      data._type || 'inquiry'
    ]);

    // 이메일 알림 (선택사항 — 본인 이메일로 발송)
    try {
      MailApp.sendEmail({
        to: Session.getActiveUser().getEmail(),
        subject: `[W 감정평가사무소] 새 상담 신청 — ${data.name || ''}`,
        body: `
새 상담 신청이 접수되었습니다.

이름/회사: ${data.name || '-'}
연락처: ${data.phone || '-'}
이메일: ${data.email || '-'}
평가대상: ${data.property_address || '-'}
평가목적: ${data.purpose || '-'}
추가문의: ${data.message || '-'}
접수시각: ${data._time || '-'}

Google Sheets에서 확인:
https://docs.google.com/spreadsheets/d/${SHEET_ID}
        `
      });
    } catch (mailErr) {
      // 이메일 실패해도 시트 저장은 유지
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 요청 (테스트용)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'W Appraisal Company Form API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
