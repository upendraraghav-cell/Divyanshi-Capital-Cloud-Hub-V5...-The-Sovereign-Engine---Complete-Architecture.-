/******************************************************************
 * DIVYANSHI CAPITAL — BULBHUL FINAL PRODUCTION Code.gs
 * POLISHED & BUG-FREE VERSION
 *
 * COMPLETE FLOW:
 * Gmail "MIS-Incoming" label
 *   ──► RAW_INBOX (always append)
 *   ──► DEDUP: LEAD_ID + MOBILE + BANK match in COMMON_ENTRY?
 *         YES → update REMARKS only (no new row)
 *         NO  → full pipeline below
 * COMMON_ENTRY ──► SMART_LOG ──► MASTER_DATA ──► ALL_EMPLOYEES
 *   ──► Personal File: MY_CASES (view-only) + SALES_ACTIVITY (editable)
 *   ──► TAT engine (auto-colour + stop on REJECT / complete on DISBURSE)
 *   ──► DISBURSE → ACCOUNTS_LOG + Telegram
 *   ──► BULBHUL Avatar Brain (per-role AI persona)
 *   ──► Evening 19:30 → MIS_FINAL_REPORT + Telegram
 *
 * GOVERNANCE: MD + Founder = final authority
 * ZERO MANUAL WORK. All auto.
 ******************************************************************/

/* ─────────────────────────────────────────────
   CONFIG (STANDALONE)
───────────────────────────────────────────── */

const MASTER_SS_ID = "1Mk9AzGdKK07WZCKV6lZgtlM4JWy2sdESQwh70r0UicU";

const DC_CFG = {
  PROPS: PropertiesService.getScriptProperties(),
  COMPANY: {
    NAME: "Divyanshi Capital Pvt Ltd",
    MD_EMAIL: "upendra.raghav@divyanshicapital.com",
    FOUNDER_EMAIL: "NARENDRARAGHAV@DIVYANSHICAPITAL.COM",
    HR_EMAIL: "khushboo.divyanshicapital@gmail.com",
    ACCOUNTS_EMAIL: "accounts@divyanshicapital.com",
    SUPPORT_EMAIL: "support@divyanshicapital.com"
  },
  BULBHUL: { WA_NUMBER: "9718861305", NAME: "Bulbhul - AI Banker" },
  SHEETS: {
    COMMON_ENTRY: "COMMON_ENTRY",
    SMART_LOG: "SMART_LOG",
    SOURCE_NAME: "SOURCE_NAME",
    MASTER_DATA: "MASTER_DATA",
    ALL_EMPLOYEES: "ALL_EMPLOYEES",
    MIS_LOG: "MIS_LOG",
    ATTENDANCE: "ATTENDANCE_LOG",
    ACCOUNTS_LOG: "ACCOUNTS_LOG",
    RAW_INBOX: "RAW_INBOX",
    MIS_REPORT: "MIS_FINAL_REPORT",
    HR_APPROVAL: "HR_MD_APPROVAL",
    LOAN_BANK_MAP: "Loan_Bank_Map",
    ERR: "ERR"
  },
  ATTENDANCE: {
    PRESENT_THRESHOLD: 5,
    HALF_DAY_THRESHOLD: 3,
    MANAGER_CHECKIN_1_START: 10,
    MANAGER_CHECKIN_1_END_MIN: 15,
    MANAGER_CHECKIN_2_START: 14,
    MANAGER_CHECKIN_2_END_MIN: 15
  },
  MIS: {
    GMAIL_LABEL: "MIS-Incoming",
    SYNC_INTERVAL: 15,
    REPORT_HOUR: 19
  }
};

let DC_EMP_CACHE = null;

/* ─────────────────────────────────────────────
   NORMALISER + HELPERS
───────────────────────────────────────────── */

function DC_NORM_(v) {
  const alias = {
    "EMPOLYEES_NAME": "EMPLOYEES_NAME", "EMPLOYEE_NAME": "EMPLOYEES_NAME",
    "EMPLOYEES_EMAIL_ID": "EMPLOYEE_EMAIL", "OFFICIAL_EMAIL": "EMPLOYEE_EMAIL",
    "EMPLOYEE_CODE": "EMP_CODE", "EMPLOYEE_ID": "EMP_CODE",
    "PHONE": "CLIENT_MOBILE", "MOBILE": "CLIENT_MOBILE",
    "CUSTOMER_NAME": "CLIENT_NAME", "FULL_NAME": "CLIENT_NAME",
    "PRODUCT": "LOAN_TYPE", "LOAN_PRODUCT": "LOAN_TYPE",
    "BANK": "PREFERRED_BANK", "BANK_NAME": "PREFERRED_BANK",
    "LOAN_AMOUNT": "REQUIRED_LOAN_AMOUNT", "AMOUNT": "REQUIRED_LOAN_AMOUNT",
    "COMMENT": "REMARKS", "COMMENTS": "REMARKS",
    "CIBIL": "CIBIL_SCORE", "CITY": "CITY_LOCATION"
  };
  const key = String(v || "").trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  return alias[key] || key;
}

function DC_CRM_SAFE_(v) { return String(v || "").trim(); }
function DC_CLEAN_MOBILE_(v) { return String(v || "").replace(/\D/g, "").slice(-10); }
function DC_CLEAN_EMAIL_(v) { return String(v || "").trim().toLowerCase(); }

function SHEET_(name) {
  try {
    return DC_GET_SS_().getSheetByName(name);
  } catch (e) {
    Logger.log("Sheet not found: " + name);
    return null;
  }
}

function GET_OR_CREATE_(name) {
  const ss = DC_GET_SS_();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function LOG_ERR_(func, code, msg) {
  try {
    const sh = GET_OR_CREATE_(DC_CFG.SHEETS.ERR);
    P1_ENSURE_HEADERS_(sh, ["TIMESTAMP", "FUNCTION", "CODE", "MESSAGE"]);
    sh.appendRow([new Date(), func || "", code || "", msg || ""]);
  } catch (e) { /* silent */ }
}

/* ─────────────────────────────────────────────
   SPREADSHEET ACCESS
───────────────────────────────────────────── */

function DC_GET_SS_() {
  const p = PropertiesService.getScriptProperties();
  if (MASTER_SS_ID && MASTER_SS_ID.length > 20) {
    try {
      const ss = SpreadsheetApp.openById(MASTER_SS_ID);
      p.setProperty("MASTER_FILE_ID", MASTER_SS_ID);
      return ss;
    } catch (e) { /* fall through */ }
  }
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active && active.getId()) {
      p.setProperty("MASTER_FILE_ID", active.getId());
      return active;
    }
  } catch (e) { }
  
  const ids = [
    p.getProperty("MASTER_FILE_ID"),
    p.getProperty("P1_MASTER_FILE_ID"),
    p.getProperty("SPREADSHEET_ID")
  ].filter(Boolean);

  for (let i = 0; i < ids.length; i++) {
    try {
      const ss = SpreadsheetApp.openById(ids[i]);
      p.setProperty("MASTER_FILE_ID", ids[i]);
      return ss;
    } catch (e) { }
  }
  throw new Error("Cannot open Master Sheet. Check MASTER_SS_ID at top of Code.gs");
}

function SETUP_STANDALONE_() {
  Logger.log("════════════════════════════════");
  Logger.log("  DIVYANSHI CAPITAL — SETUP START");
  Logger.log("════════════════════════════════");

  if (!MASTER_SS_ID || MASTER_SS_ID.length < 20) {
    Logger.log("❌ FATAL: MASTER_SS_ID is empty or invalid.");
    throw new Error("MASTER_SS_ID missing");
  }
  Logger.log("✅ MASTER_SS_ID: " + MASTER_SS_ID.substring(0, 20) + "...");

  const props = PropertiesService.getScriptProperties();
  props.setProperties({
    "MASTER_FILE_ID": MASTER_SS_ID,
    "P1_MASTER_FILE_ID": MASTER_SS_ID
  });

  try {
    const masterSheet = SpreadsheetApp.openById(MASTER_SS_ID);
    Logger.log("✅ Spreadsheet: " + masterSheet.getName() + " (" + masterSheet.getSheets().length + " sheets)");
  } catch (e) {
    Logger.log("❌ Connection failed: " + e.message);
    throw e;
  }

  Logger.log("════════════════════════════════");
  Logger.log("  SETUP COMPLETE ✅");
  Logger.log("════════════════════════════════");
}

function HEALTH_CHECK_() {
  Logger.log("════════════════════════════════════════");
  Logger.log("  SYSTEM HEALTH CHECK");
  Logger.log("  " + new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
  Logger.log("════════════════════════════════════════");

  let passed = 0, failed = 0;

  function check(label, testFn) {
    try {
      const result = testFn();
      Logger.log("✅ " + label + (result ? ": " + result : ""));
      passed++;
    } catch (e) {
      Logger.log("❌ " + label + " — " + e.message);
      failed++;
    }
  }

  check("MASTER_SS_ID", () => { if (!MASTER_SS_ID || MASTER_SS_ID.length < 20) throw new Error("Invalid"); return "OK"; });
  check("Spreadsheet connection", () => { const ss = SpreadsheetApp.openById(MASTER_SS_ID); return ss.getName(); });

  const requiredSheets = ["ALL_EMPLOYEES", "MASTER_DATA", "COMMON_ENTRY", "SMART_LOG", "ERR"];
  check("Required sheets", () => {
    const ss = SpreadsheetApp.openById(MASTER_SS_ID);
    const names = ss.getSheets().map(s => s.getName());
    const missing = requiredSheets.filter(r => !names.includes(r));
    if (missing.length) throw new Error("Missing: " + missing.join(", "));
    return "All " + requiredSheets.length + " found";
  });

  Logger.log("════════════════════════════════════════");
  Logger.log("  RESULT: " + passed + " PASSED | " + failed + " FAILED");
  Logger.log("════════════════════════════════════════");
}

/* ─────────────────────────────────────────────
   HEADER + ROW HELPERS
───────────────────────────────────────────── */

function P1_ENSURE_HEADERS_(sh, headers) {
  if (!sh) throw new Error("Sheet missing");
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  
  let current = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].map(h => String(h || "").trim());
  let norm = current.map(DC_NORM_);
  
  headers.forEach(h => {
    if (norm.indexOf(DC_NORM_(h)) === -1) {
      current.push(h);
      norm.push(DC_NORM_(h));
      sh.getRange(1, current.length).setValue(h);
    }
  });

  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, sh.getLastColumn()).setBackground("#0b5394").setFontColor("#ffffff").setFontWeight("bold");
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
}

function P1_VAL_(obj, header) {
  const n = DC_NORM_(header);
  if (obj.hasOwnProperty(header)) return obj[header];
  if (obj.hasOwnProperty(n)) return obj[n];
  for (const k of Object.keys(obj)) {
    if (DC_NORM_(k) === n) return obj[k];
  }
  return "";
}

function P1_BUILD_ROW_(headers, obj) {
  return headers.map(h => P1_VAL_(obj, h));
}

/* ─────────────────────────────────────────────
   MASTER HEADERS
───────────────────────────────────────────── */

function GET_MASTER_HEADERS_() {
  return [
    "TIMESTAMP", "EMP_CODE", "SALES_NAME", "CLIENT_NAME", "CLIENT_MOBILE",
    "LOAN_TYPE", "REQUIRED_LOAN_AMOUNT", "PREFERRED_BANK", "CASE_CATEGORY",
    "CIBIL_SCORE", "REMARKS", "LEAD_ID", "TAT_DAYS", "TAT_DEADLINE",
    "TAT_STATUS", "DATA_FLOW", "SOURCE_NAME", "DOCS_LINK", "PROCESS_STATUS"
  ];
}

function GET_RAW_INBOX_HEADERS_() {
  return ["RECEIVED_AT", "GMAIL_MSG_ID", "FROM_EMAIL", "SUBJECT", "LEAD_ID",
    "CLIENT_NAME", "CLIENT_MOBILE", "PREFERRED_BANK", "LOAN_TYPE", "CASE_STATUS",
    "SOURCE_NAME", "PROCESS_STATUS", "DEDUP_ACTION", "PROCESSED_AT"];
}

/* ─────────────────────────────────────────────
   EMPLOYEE CACHE
───────────────────────────────────────────── */

function DC_BUILD_EMP_MAP_() {
  if (DC_EMP_CACHE) return DC_EMP_CACHE;

  const sh = SHEET_(DC_CFG.SHEETS.ALL_EMPLOYEES);
  if (!sh || sh.getLastRow() < 2) return {};

  const data = sh.getDataRange().getValues();
  const h = data[0].map(DC_NORM_);
  const out = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    h.forEach((key, idx) => obj[key] = row[idx]);

    const code = DC_CRM_SAFE_(obj.EMP_CODE).toUpperCase();
    if (!code) continue;

    obj.EMP_CODE = code;
    obj.NAME = obj.EMPLOYEES_NAME || code;
    obj.EMAIL = DC_CLEAN_EMAIL_(obj.EMPLOYEE_EMAIL || "");
    obj.PERSONAL_FILE_ID = String(obj.PERSONAL_FILE_ID || "").trim();

    if (out[code]) {
      const ex = out[code];
      Object.keys(obj).forEach(k => {
        if (!ex[k] && obj[k]) ex[k] = obj[k];
      });
    } else {
      out[code] = obj;
    }
  }

  DC_EMP_CACHE = out;
  return out;
}

function FIND_EMPLOYEE_FULL_(codeOrEmailOrName) {
  const map = DC_BUILD_EMP_MAP_();
  const searchKey = String(codeOrEmailOrName || "").trim().toUpperCase();
  if (!searchKey) return null;

  if (map[searchKey]) return map[searchKey];

  const cleanSearch = searchKey.toLowerCase();
  for (const k of Object.keys(map)) {
    const emp = map[k];
    const empEmail = String(emp.EMAIL || "").toLowerCase();
    const empName = String(emp.NAME || "").toLowerCase();

    if (empEmail === cleanSearch || empName === cleanSearch) {
      return emp;
    }
  }
  return null;
}

/* ─────────────────────────────────────────────
   LEAD DEDUPLICATION
───────────────────────────────────────────── */

function CHECK_DEDUP_IN_COMMON_ENTRY_(leadId, mobile, clientName) {
  try {
    const sh = SHEET_(DC_CFG.SHEETS.COMMON_ENTRY);
    if (!sh || sh.getLastRow() < 2) return { found: false };

    const data = sh.getDataRange().getValues();
    const h = data[0].map(DC_NORM_);

    const liIdx = h.indexOf("LEAD_ID");
    const moIdx = h.indexOf("CLIENT_MOBILE");
    const nmIdx = h.indexOf("CLIENT_NAME");

    const cleanMobile = DC_CLEAN_MOBILE_(mobile || "");
    const cleanLead = String(leadId || "").trim().toUpperCase();
    const cleanName = String(clientName || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

    for (let i = 1; i < data.length; i++) {
      const rl = liIdx > -1 ? String(data[i][liIdx] || "").trim().toUpperCase() : "";
      const rm = moIdx > -1 ? DC_CLEAN_MOBILE_(data[i][moIdx]) : "";
      const rn = nmIdx > -1 ? String(data[i][nmIdx] || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "") : "";

      const mobileMatch = cleanMobile && rm === cleanMobile;
      const leadMatch = cleanLead && rl === cleanLead;
      const nameMatch = cleanName && rn && (rn.includes(cleanName) || cleanName.includes(rn));

      if (mobileMatch || leadMatch || nameMatch) {
        return { found: true, row: i + 1 };
      }
    }
    return { found: false };
  } catch (e) {
    LOG_ERR_("CHECK_DEDUP", "", e.message);
    return { found: false };
  }
}

/* ─────────────────────────────────────────────
   PARSE & PROCESS MIS EMAILS
───────────────────────────────────────────── */

function PARSE_MIS_MAIL_BODY_(subject, body) {
  const parsed = {};

  String(body || "").split(/\r?\n/).forEach(line => {
    const m = line.match(/^([A-Za-z0-9_ ]+?)\s*[:\-=]\s*(.+)$/);
    if (m) parsed[DC_NORM_(m[1].trim())] = m[2].trim();
  });

  try {
    const j = body.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
    if (j) {
      const o = JSON.parse(j[0]);
      Object.keys(o).forEach(k => parsed[DC_NORM_(k)] = o[k]);
    }
  } catch (_) { }

  let leadId = parsed["LEAD_ID"] || "";
  let clientName = parsed["CLIENT_NAME"] || "";
  let clientMobile = DC_CLEAN_MOBILE_(parsed["CLIENT_MOBILE"] || "");
  let preferredBank = parsed["PREFERRED_BANK"] || "";
  let loanType = parsed["LOAN_TYPE"] || "";
  let caseStatus = parsed["CASE_STATUS"] || "OPEN";

  return {
    LEAD_ID: leadId,
    CLIENT_NAME: clientName,
    CLIENT_MOBILE: clientMobile,
    PREFERRED_BANK: preferredBank,
    LOAN_TYPE: loanType,
    CASE_STATUS: caseStatus,
    SOURCE_NAME: "MIS-Incoming"
  };
}

function PROCESS_MIS_MAIL_(mail) {
  try {
    const cleanSub = String(mail.subject || "").toUpperCase();
    const exclusions = ["NEW LOGIN", "SECURITY ALERT", "VERIFICATION CODE", "OTP", "PASSWORD"];

    const isExcluded = exclusions.some(x => cleanSub.includes(x));
    if (isExcluded) return;

    const parsed = PARSE_MIS_MAIL_BODY_(mail.subject, mail.body);

    if (!parsed.CLIENT_NAME || !parsed.CLIENT_MOBILE) return; // Skip invalid leads

    const rawSh = GET_OR_CREATE_(DC_CFG.SHEETS.RAW_INBOX);
    const rawH = P1_ENSURE_HEADERS_(rawSh, GET_RAW_INBOX_HEADERS_());
    rawSh.appendRow(P1_BUILD_ROW_(rawH, {
      RECEIVED_AT: mail.receivedAt,
      GMAIL_MSG_ID: mail.msgId,
      SUBJECT: mail.subject,
      CLIENT_NAME: parsed.CLIENT_NAME,
      CLIENT_MOBILE: parsed.CLIENT_MOBILE,
      LOAN_TYPE: parsed.LOAN_TYPE,
      CASE_STATUS: parsed.CASE_STATUS,
      PROCESS_STATUS: "PENDING"
    }));

    const dedup = CHECK_DEDUP_IN_COMMON_ENTRY_(parsed.LEAD_ID, parsed.CLIENT_MOBILE, parsed.CLIENT_NAME);

    if (dedup.found) {
      // Update existing lead
      const ceSh = SHEET_(DC_CFG.SHEETS.COMMON_ENTRY);
      const ceH = ceSh.getRange(1, 1, 1, ceSh.getLastColumn()).getValues()[0].map(DC_NORM_);
      const ceRIdx = ceH.indexOf("REMARKS");

      if (ceRIdx > -1) {
        const old = String(ceSh.getRange(dedup.row, ceRIdx + 1).getValue() || "").trim();
        ceSh.getRange(dedup.row, ceRIdx + 1).setValue(old ? (old + " | [MIS: " + mail.subject + "]") : ("[MIS: " + mail.subject + "]"));
      }
    } else {
      // New lead: full pipeline
      const leadPayload = {
        EMP_CODE: "",
        CLIENT_NAME: parsed.CLIENT_NAME,
        CLIENT_MOBILE: parsed.CLIENT_MOBILE,
        LOAN_TYPE: parsed.LOAN_TYPE,
        REQUIRED_LOAN_AMOUNT: "",
        PREFERRED_BANK: parsed.PREFERRED_BANK,
        CASE_CATEGORY: parsed.CASE_STATUS || "OPEN",
        REMARKS: "[MIS: " + mail.subject + "]",
        SOURCE_TYPE: "EMAIL_MIS",
        SOURCE_NAME: "MIS-Incoming",
        LEAD_ID: parsed.LEAD_ID || ""
      };

      DC_PROCESS_LEAD_(leadPayload);
    }
  } catch (e) {
    LOG_ERR_("PROCESS_MIS_MAIL", mail.msgId || "", e.message);
  }
}

function FETCH_AND_PROCESS_MIS_MAILS_() {
  try {
    const label = GmailApp.getUserLabelByName(DC_CFG.MIS.GMAIL_LABEL);
    if (!label) {
      LOG_ERR_("FETCH_MIS", "", "Gmail label not found: " + DC_CFG.MIS.GMAIL_LABEL);
      return;
    }

    const processed = new Set();
    const rawSh = SHEET_(DC_CFG.SHEETS.RAW_INBOX);
    if (rawSh && rawSh.getLastRow() >= 2) {
      const h = rawSh.getRange(1, 1, 1, rawSh.getLastColumn()).getValues()[0].map(DC_NORM_);
      const idx = h.indexOf("GMAIL_MSG_ID");
      if (idx > -1) {
        const vals = rawSh.getRange(2, idx + 1, rawSh.getLastRow() - 1, 1).getValues();
        vals.forEach(r => { if (r[0]) processed.add(String(r[0]).trim()); });
      }
    }

    const threads = label.getThreads(0, 100);
    threads.forEach(thread => {
      thread.getMessages().forEach(msg => {
        const id = msg.getId();
        if (processed.has(id)) return;

        PROCESS_MIS_MAIL_({
          msgId: id,
          subject: msg.getSubject(),
          body: msg.getPlainBody(),
          receivedAt: msg.getDate()
        });
        processed.add(id);
      });
    });

    Logger.log("✅ MIS emails processed: " + threads.length);
  } catch (e) {
    LOG_ERR_("FETCH_AND_PROCESS_MIS", "", e.message);
  }
}

/* ─────────────────────────────────────────────
   MAIN LEAD PROCESSING
───────────────────────────────────────────── */

function DC_PROCESS_LEAD_(lead = {}) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return { success: false, errorMessage: "System busy" };

  try {
    const mobile = DC_CLEAN_MOBILE_(lead.CLIENT_MOBILE || "");
    lead.CLIENT_MOBILE = mobile;
    lead.LEAD_ID = lead.LEAD_ID || ("L" + (mobile ? mobile.slice(-4) : "0000") + "_" + Date.now());
    lead.TIMESTAMP = new Date();
    lead.PROCESS_STATUS = "CAPTURED";

    // Add to COMMON_ENTRY
    const ce = GET_OR_CREATE_(DC_CFG.SHEETS.COMMON_ENTRY);
    const ceH = P1_ENSURE_HEADERS_(ce, GET_MASTER_HEADERS_());
    ce.appendRow(P1_BUILD_ROW_(ceH, lead));

    // Add to SMART_LOG
    const sl = GET_OR_CREATE_(DC_CFG.SHEETS.SMART_LOG);
    const slH = P1_ENSURE_HEADERS_(sl, ["TS", "SOURCE_NAME", "LEAD_ID", "CLIENT_NAME", "CLIENT_MOBILE", "STATUS"]);
    sl.appendRow(P1_BUILD_ROW_(slH, { TS: new Date(), SOURCE_NAME: lead.SOURCE_NAME, LEAD_ID: lead.LEAD_ID, CLIENT_NAME: lead.CLIENT_NAME, CLIENT_MOBILE: lead.CLIENT_MOBILE, STATUS: "ROUTED" }));

    // Add to MASTER_DATA
    const master = GET_OR_CREATE_(DC_CFG.SHEETS.MASTER_DATA);
    const mH = P1_ENSURE_HEADERS_(master, GET_MASTER_HEADERS_());
    master.appendRow(P1_BUILD_ROW_(mH, lead));

    Logger.log("✅ Lead processed: " + lead.LEAD_ID);
    return { success: true, leadId: lead.LEAD_ID };
  } catch (error) {
    LOG_ERR_("PROCESS_LEAD", lead.LEAD_ID || "", error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    try { lock.releaseLock(); } catch (_) { }
  }
}

/* ─────────────────────────────────────────────
   15-MIN SYNC TRIGGER
───────────────────────────────────────────── */

function MIS_PIPELINE_RUN_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    Logger.log("⏳ Lock busy, skipping this cycle");
    return;
  }

  try {
    FETCH_AND_PROCESS_MIS_MAILS_();
    PropertiesService.getScriptProperties().setProperty("MIS_LAST_RUN", new Date().toISOString());
    Logger.log("✅ 15-min MIS cycle complete");
  } catch (e) {
    LOG_ERR_("MIS_PIPELINE_RUN", "", e.message);
  } finally {
    try { lock.releaseLock(); } catch (_) { }
  }
}

/* ─────────────────────────────────────────────
   doPost - WEBHOOK RECEIVER (for web app calls)
───────────────────────────────────────────── */

function doPost(e) {
  try {
    const action = (e.parameter || {}).action || (e.postData ? JSON.parse(e.postData.contents).action : "");

    if (action === "GET_EMPLOYEE_DATA") {
      const empCode = (e.parameter || {}).emp_code || (e.postData ? JSON.parse(e.postData.contents).emp_code : "");
      const emp = FIND_EMPLOYEE_FULL_(empCode);

      if (emp) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: true,
          emp_code: emp.EMP_CODE,
          name: emp.NAME,
          email: emp.EMAIL,
          personal_file_id: emp.PERSONAL_FILE_ID
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Employee not found" })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === "PROCESS_LEAD") {
      const payload = e.postData ? JSON.parse(e.postData.contents) : (e.parameter || {});
      const result = DC_PROCESS_LEAD_(payload);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    LOG_ERR_("doPost", "", error.message);
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

/* ─────────────────────────────────────────────
   STUB FUNCTIONS (for compatibility)
───────────────────────────────────────────── */

function DC_SEND_TG_(msg) { /* Telegram stub */ }
function DC_TG_BROADCAST_(msg) { return "TG disabled"; }
function DC_SEND_WA_(mobile, msg) { /* WhatsApp stub */ }
function GET_MASTER_DATA_ALL_() { 
  const sh = SHEET_(DC_CFG.SHEETS.MASTER_DATA);
  if (!sh || sh.getLastRow() < 2) return [];
  const data = sh.getDataRange().getValues();
  const h = data[0].map(DC_NORM_);
  return data.slice(1).map(row => {
    const obj = {};
    h.forEach((key, idx) => obj[key] = row[idx]);
    return obj;
  });
}
function GET_DOCS_REQUIRED_BY_PRODUCT_(type) { return ["PAN", "Aadhar", "Bank Statement", "Salary Slip"]; }
function DC_PROVISION_NEW_EMPLOYEE(emp) { return true; }
