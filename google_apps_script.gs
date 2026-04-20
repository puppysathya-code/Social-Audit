/**
 * Google Apps Script for "Maanbumigu Makkal" Social Audit Website
 * 
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Click "New Project"
 * 3. Delete all code and paste this script.
 * 4. Click "Deploy" > "New Deployment"
 * 5. Select type "Web App"
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Authorize the permissions.
 * 9. Copy the "Web App URL" and paste it into your React code.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const recipient = "puppysathya@gmail.com";
    const subject = "Social Audit Report - " + (data.office_name || "New Submission");

    let htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #0d1f3c; border-bottom: 2px solid #c9922a; padding-bottom: 10px;">
          மாண்புமிகு மக்கள் – அரசு அலுவலக சமூக தணிக்கை
        </h2>
        
        <div style="background: #fdf6ec; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color: #0d1f3c; margin-top: 0;">தன்னார்வலர் மற்றும் அலுவலக விவரங்கள் (Volunteer & Office Details)</h3>
          <p><strong>தன்னார்வலர்:</strong> ${data.vol_name} (ID: ${data.vol_id})</p>
          <p><strong>தணிக்கை நாள்/நேரம்:</strong> ${data.audit_date} at ${data.audit_time}</p>
          <p><strong>மாவட்டம்:</strong> ${data.district}</p>
          <p><strong>வட்டம்/தாலுக்கா:</strong> ${data.block}</p>
          <p><strong>அலுவலகம்:</strong> ${data.office_name}</p>
          <p><strong>தலைவர்:</strong> ${data.head_name} (${data.head_phone})</p>
        </div>

        <div style="margin-top: 25px;">
          <h3>தணிக்கை முடிவுகள் (Audit Findings)</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #0d1f3c; color: white;">
              <th style="padding: 10px; border: 1px solid #ddd;">Section</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Item #</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Response</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Notes</th>
            </tr>
    `;

    // Process all fields starting with a prefix (b_, c_, etc.)
    const prefixes = ['b', 'c', 'd', 'e', 'f'];
    prefixes.forEach(p => {
      // Find all keys for this section
      const keys = Object.keys(data).filter(k => k.startsWith(p + '_') && !k.endsWith('_notes'));
      keys.forEach(k => {
        const index = k.split('_')[1];
        const notes = data[k + '_notes'] || '';
        htmlBody += `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; text-transform: uppercase;">Part ${p}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">Item ${index}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: ${data[k] === 'yes' ? 'green' : data[k] === 'no' ? 'red' : 'gray'}">${data[k].toUpperCase()}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${notes}</td>
          </tr>
        `;
      });
    });

    htmlBody += `
          </table>
        </div>

        <div style="margin-top: 25px; background: #f0f7ff; padding: 15px; border-radius: 8px;">
          <h3>கூடுதல் கண்டறிதல்கள் (Additional Findings)</h3>
          <p><strong>நல்ல நடைமுறைகள்:</strong> ${data.good1}, ${data.good2}</p>
          <p><strong>முன்னேற்றம் தேவை:</strong> ${data.improve1}, ${data.improve2}, ${data.improve3}</p>
          <p><strong>பரிந்துரைகள்:</strong> ${data.rec1}, ${data.rec2}</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
          Sent via Maanbumigu Makkal Social Audit Web Portal
        </p>
      </div>
    `;

    GmailApp.sendEmail(recipient, subject, "", {
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
