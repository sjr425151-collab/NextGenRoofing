# Connect website leads to Google Sheets + Gmail (≈5 minutes, free)

Every inspection/estimate request from the website is added as a row in **“Lead form requests - Website”** and emailed to the NextGen Gmail inbox. The website only shows “Request received” after the script confirms the row was saved.

Do these steps **signed in to the NextGen Gmail account** (the account that owns the sheet):

1. Open the sheet **Lead form requests - Website**.
2. **Extensions → Apps Script.** Delete any starter code, paste the full contents of [`LeadIntake.gs`](LeadIntake.gs), and click **Save**.
3. **Project Settings (gear icon) → Script properties → Add script property:**
   - `TOKEN` = a long random string (for example, generate one at a password manager — 32+ characters). Keep it private.
   - `NOTIFY_EMAIL` = the NextGen Gmail address that should receive new-lead emails.
4. **Deploy → New deployment →** type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone** *(required so the website can post to it; the TOKEN keeps others out)*
   - Click **Deploy**, approve the permissions Google asks for (Sheets + send email as you), and **copy the Web app URL** (ends in `/exec`).
5. Give these two values to whoever manages the website hosting — they are set as environment variables on the host, never in the code:
   ```
   LEAD_SINKS=google-sheet
   LEAD_SHEET_WEBHOOK_URL=<the /exec URL>
   LEAD_SHEET_TOKEN=<the same TOKEN as step 3>
   ```
6. Test: open the `/exec` URL in a browser — it should show `{"ok":true,"service":"nextgen-lead-intake"}`. Then submit the website contact form; a row appears on the **Leads** tab and an email arrives.

**Columns:** Received · Lead ID · Source · Name · Phone · Email · Preferred contact · Property address · ZIP · Property type · Work · Material/system · Ballpark low/high · Result · Reported issues · Notes · Status (starts as “New” — edit it as you follow up) · Raw JSON.

**If you edit the script later**, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

Gmail sending limits for Apps Script (~100 emails/day on a free account) are far above typical lead volume.
