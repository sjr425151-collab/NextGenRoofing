/**
 * NextGen Roofing — website lead intake (Google Apps Script)
 *
 * Bound to the Google Sheet "Lead form requests - Website" in the NextGen
 * Gmail account. Every website request is appended as a row and emailed to
 * the NextGen inbox. Setup steps: integrations/google-sheets/README.md
 *
 * Script Properties (Project Settings → Script properties):
 *   TOKEN         long random string; must equal LEAD_WEBHOOK_SECRET on the website host
 *   NOTIFY_EMAIL  address that receives new-lead emails (the NextGen Gmail)
 */

var SHEET_NAME = "Leads";
var HEADERS = [
  "Received", "Lead ID", "Source", "Name", "Phone", "Email", "Preferred contact",
  "Property address", "ZIP", "Property type", "Work", "Material / system",
  "Ballpark low", "Ballpark high", "Result", "Reported issues", "Notes", "Status", "Raw JSON"
];

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty("TOKEN");
    if (!token || body.token !== token) return json_({ ok: false, error: "unauthorized" });

    var lead = body.lead;
    if (!lead || !lead.id || !lead.contact) return json_({ ok: false, error: "invalid payload" });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = getSheet_();
      // Idempotency: skip if this lead ID is already recorded.
      var ids = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().map(function (r) { return r[0]; });
      if (ids.indexOf(lead.id) === -1) sheet.appendRow(row_(lead));
    } finally {
      lock.releaseLock();
    }

    var to = props.getProperty("NOTIFY_EMAIL");
    if (to) {
      MailApp.sendEmail({
        to: to,
        replyTo: lead.contact.email,
        subject: subject_(lead),
        body: body.text || summary_(lead),
      });
    }
    return json_({ ok: true, id: lead.id });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Visiting the web-app URL in a browser shows this — useful to confirm the deployment is live. */
function doGet() {
  return json_({ ok: true, service: "nextgen-lead-intake" });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function row_(lead) {
  var c = lead.contact, est = lead.estimate || {}, r = lead.estimateResult || {};
  var sys = est.sector === "commercial" ? est.system : est.material;
  return [
    new Date(lead.createdAt), lead.id, lead.source, c.name, "'" + c.phone, c.email, c.preferredContact,
    c.address || "", est.zip || "", est.sector || lead.topic || "", est.scope || "", sys || "",
    r.kind === "estimate" ? r.low : "", r.kind === "estimate" ? r.high : "",
    r.kind === "estimate" ? "Ballpark range shown" : (r.reason ? "Inspection recommended" : ""),
    (lead.issues || []).join(", "), c.notes || "", "New", JSON.stringify(lead)
  ];
}

function subject_(lead) {
  if (lead.source === "contact") return "New website inspection request — " + lead.contact.name;
  return "New " + (lead.estimate.sector === "commercial" ? "commercial" : "residential") + " estimate request — " + lead.contact.name;
}

function summary_(lead) {
  var c = lead.contact;
  return ["Name: " + c.name, "Phone: " + c.phone, "Email: " + c.email, "Preferred contact: " + c.preferredContact,
    "Address: " + (c.address || "—"), "Notes: " + (c.notes || "—"), "", "Lead ID: " + lead.id].join("\n");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
