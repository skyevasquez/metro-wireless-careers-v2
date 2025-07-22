# 📧 Email Setup Guide - Metro Wireless Plus Career Portal

## Overview
The Metro Wireless Plus Career Portal automatically sends candidate resumes to the appropriate district managers and recruiting team when applications are submitted.

## 🔧 Email Configuration

### Step 1: Environment Variables Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your email settings in `.env`:**

#### Option A: Gmail Configuration (Recommended)
```env
EMAIL_USER=your-company-email@gmail.com
EMAIL_PASS=your-app-password
```

**To get Gmail App Password:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → App passwords
3. Generate a new app password for "Mail"
4. Use this 16-character password in `EMAIL_PASS`

#### Option B: Custom SMTP Configuration
```env
EMAIL_USER=noreply@metrowirelessplus.com
EMAIL_PASS=your-smtp-password
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Step 2: District Manager Email Configuration

The system automatically routes applications to the correct district manager based on store selection:

| District | Email | Stores Covered |
|----------|-------|----------------|
| Florida - Tampa Bay | `tampa.dm@metrowirelessplus.com` | Tampa, St Petersburg stores |
| Florida - North | `north.fl.dm@metrowirelessplus.com` | Gainesville, Leesburg, Brooksville area |
| Florida - Central | `central.fl.dm@metrowirelessplus.com` | Spring Hill, Palm Beach area |
| Florida - South | `south.fl.dm@metrowirelessplus.com` | Fort Pierce, Miami, Lauderdale area |
| Virginia | `virginia.dm@metrowirelessplus.com` | All Virginia locations |
| Maryland | `maryland.dm@metrowirelessplus.com` | Hagerstown |
| West Virginia | `wv.dm@metrowirelessplus.com` | Martinsburg, Charles Town |

**Recruiting Manager (CC on all emails):** `recruiting@metrowirelessplus.com`

## 📨 Email Flow

### When a candidate submits an application:

1. **Primary Email** → District Manager
   - **TO:** Appropriate district manager
   - **CC:** Recruiting manager
   - **Subject:** `New Job Application - [Name] - [Store]`
   - **Attachments:** Resume + Cover Letter (if provided)
   - **Content:** Complete application details with professional formatting

2. **Confirmation Email** → Candidate
   - **TO:** Candidate's email
   - **Subject:** `Application Received - Metro Wireless Plus - [Store]`
   - **Content:** Confirmation with next steps and contact information

## 🛠️ Testing Email Configuration

### Test the email setup:
```bash
curl http://localhost:3000/api/test-email
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email configuration is valid"
}
```

### If configuration fails:
```json
{
  "success": false,
  "error": "Email configuration is invalid. Please check your environment variables.",
  "details": "Error details here"
}
```

## 📋 Email Template Features

### District Manager Email Includes:
- **Applicant Information:** Name, email, phone, position, availability
- **Store Details:** Store name, code, address, area
- **Additional Information:** Any message from candidate
- **Professional Formatting:** Metro Wireless Plus branding
- **File Attachments:** Resume and cover letter with proper naming
- **Timestamp:** When application was submitted

### Candidate Confirmation Email Includes:
- **Thank you message** with personalized greeting
- **Application summary** with store and position details
- **Next steps** explaining the hiring process
- **Contact information** for questions
- **Professional branding** consistent with company image

## 🔒 Security Features

- **Rate Limiting:** Maximum 5 applications per IP per 15 minutes
- **File Validation:** Only PDF, DOC, DOCX files allowed
- **File Size Limits:** Maximum 5MB per file
- **Automatic Cleanup:** Files deleted after email sending
- **Input Sanitization:** All form data is validated and sanitized

## 📊 Monitoring & Logging

The system logs:
- Successful application submissions
- Email sending status
- File upload/deletion events
- Error conditions

**Check logs for:**
```bash
# View application logs
tail -f logs/application.log

# Check for email errors
grep "email" logs/error.log
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Email configuration is invalid"**
   - Check `.env` file exists and has correct values
   - Verify Gmail app password is correct
   - Ensure 2FA is enabled for Gmail

2. **"Authentication failed"**
   - Double-check email credentials
   - For Gmail, ensure app password (not regular password)
   - Check if account is locked or requires verification

3. **"Connection timeout"**
   - Check SMTP host and port settings
   - Verify firewall/network settings
   - Try different SMTP provider

4. **Files not attaching**
   - Check file upload directory permissions
   - Verify file size under 5MB
   - Ensure file format is PDF/DOC/DOCX

### Support Contacts:
- **Technical Issues:** IT Support
- **Email Configuration:** System Administrator
- **Recruiting Questions:** recruiting@metrowirelessplus.com

## 📈 Performance Optimization

- **File Cleanup:** Automatic deletion prevents disk space issues
- **Rate Limiting:** Prevents spam and server overload
- **Async Processing:** Email sending doesn't block form submission
- **Error Handling:** Graceful degradation if email fails

## 🔄 Maintenance

### Regular Tasks:
1. **Monitor disk space** in uploads directory
2. **Check email delivery rates** and bounce notifications
3. **Update district manager emails** as needed
4. **Review and rotate email credentials** quarterly
5. **Test email functionality** monthly

### Updating District Manager Emails:
Edit the `storeData` object in `server.js` to update email addresses for each district.

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Contact:** System Administrator