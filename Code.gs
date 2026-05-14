/**
 * Divyanshi Capital - Sovereign Engine V5
 * PRODUCTION CORE - P1 Master Protocol
 */

const CONFIG = {
  MASTER_FILE_ID: PropertiesService.getScriptProperties().getProperty('MASTER_FILE_ID'),
  MD_EMAIL: 'upendra.raghav@divyanshicapital.com',
  FOUNDER_EMAIL: 'u.raghav003@gmail.com',
  HEADERS: [
    "SALES_TEAM_STATUS", "TIMESTAMP", "FORM_SOURCE", "FULL_NAME", "MOBILE", "EMAIL_ID", "CITY_LOCATION", 
    "LOAN_TYPE", "REQUIRED_LOAN_AMOUNT", "EMPLOYMENT_TYPE", "PREFERRED_BANK", "BANK", "SOURCE_NAME", 
    "DOC_UPLOAD_STATUS", "REFERENCE_TYPE", "REF_CONTACT_NUMBER", "ATTACHMENT_URL", "SALES_UPDATE_TIME", 
    "LOGIN_UPDATE_TIME", "LOGIN_HEAD_UPDATE_TIME", "RM_UPDATE_TIME", "CASE_STATUS", "CASE_REMARK", 
    "ASSIGNED_COORDINATOR_EMAIL", "TAT_DEADLINE", "ESCALATION_L1", "ESCALATION_L2", "LOAN_NAME", 
    "APPLICATION_NO", "DISBURSED_CODE", "DISBURSED_AMOUNT", "ROI", "DISBURSAL_DATE", "PF", 
    "PDD_PENDING", "SECURED_TYPE", "LAST_UPDATE_BY", "TENURE", "LOAN_MODE", "INSURANCE_AMOUNT", 
    "SUBVENTION", "ACCOUNTS_STATUS", "ACCOUNTS_REMARK", "LEAD_ID", "FOLDER_URL", "SALES_REMARK", 
    "LOGIN_REMARK", "LOGIN_HEAD_REMARK", "ROUGH_WORK", "COMPANY_NAME", "SOURCE_TYPE", "SOURCE_EMAIL", 
    "BANK_RM_REMARK", "EMP_CODE", "MANAGER_EMAIL", "REPORTING_HEAD"
  ]
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(30000); // Production-grade wait
  
  try {
    const payload = JSON.parse(e.postData.contents);
    const healed = healMatrix(payload);
    
    const ss = SpreadsheetApp.openById(CONFIG.MASTER_FILE_ID);
    const masterSheet = ss.getSheetByName('MASTER_DATA');
    const data = masterSheet.getDataRange().getValues();
    
    // MATCH LOGIC: LEAD_ID + BANK + CLIENT_NAME
    let targetRowIndex = -1;
    const headerRow = data[0];
    const L_ID_IDX = headerRow.indexOf('LEAD_ID');
    const B_IDX = headerRow.indexOf('BANK');
    const C_NAME_IDX = headerRow.indexOf('FULL_NAME');

    if (healed.LEAD_ID) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][L_ID_IDX] == healed.LEAD_ID && 
            data[i][B_IDX] == healed.BANK && 
            data[i][C_NAME_IDX] == healed.client_name) {
          targetRowIndex = i + 1;
          break;
        }
      }
    }

    const rowData = CONFIG.HEADERS.map(h => {
      if (h === 'TIMESTAMP') return new Date();
      if (h === 'FULL_NAME') return healed.client_name;
      if (h === 'MOBILE') return healed.mobile;
      if (h === 'LEAD_ID') return healed.LEAD_ID || `DC-${Date.now()}`;
      return healed[h.toLowerCase()] || healed[h] || "";
    });

    if (targetRowIndex > 0) {
      // UPDATE EXISTING
      if (healed.CASE_STATUS === 'REJECT') {
        applyColor(masterSheet, targetRowIndex, '#FCA5A5'); // Light Red
      } else if (healed.CASE_STATUS === 'SANCTION') {
        applyColor(masterSheet, targetRowIndex, '#86EFAC'); // Light Green
      }
      masterSheet.getRange(targetRowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // NEW ENTRY
      masterSheet.appendRow(rowData);
    }
    
    // Avatar Notification
    triggerAvatarActions(healed);

    return ContentService.createTextOutput(JSON.stringify({ok: true, syncId: healed.LEAD_ID || "NEW_NODE"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok: false, error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function applyColor(sheet, row, color) {
  sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground(color);
}

function healMatrix(payload) {
  payload.client_name = payload.client_name || payload.FULL_NAME || "";
  payload.mobile = String(payload.mobile || "").replace(/\D/g, "").slice(-10);
  return payload;
}

function triggerAvatarActions(healed) {
  // Bulbhul AI Banker Logic
  if (healed.CASE_STATUS === 'PENDING') {
    GmailApp.sendEmail(CONFIG.MD_EMAIL, "Bulbhul: Lead Action Required", 
      `Level 1 Alert: ${healed.client_name} is in PENDING state. Initiating 2h TAT Watchdog.`);
  }
  
  if (healed.auto_actions && healed.auto_actions.includes('SEND_WELCOME_MAIL')) {
    const template = `Welcome to Divyanshi Capital. Your loan case (${healed.LEAD_ID}) is now in our Sovereign Registry.`;
    GmailApp.sendEmail(healed.email, "Registration Success | Divyanshi Capital", template);
  }
}

function PROCESS_DISBURSAL_() {
  // Logic for daily 9am IST disbursal sweep
  const ss = SpreadsheetApp.openById(CONFIG.MASTER_FILE_ID);
  const sheet = ss.getSheetByName('MASTER_DATA');
  const data = sheet.getDataRange().getValues();
  
  data.forEach((row, i) => {
    if (i === 0) return;
    if (row[21] === 'DISBURSE') { // CASE_STATUS
      GmailApp.sendEmail(CONFIG.FOUNDER_EMAIL, "Disbursal Alert", `Case ${row[43]} (ID) has been marked DISBURSED.`);
    }
  });
}
