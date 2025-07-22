# Metro Wireless Plus - Career Application Portal

A modern, responsive web application for job applications at Metro Wireless Plus locations across Florida, Virginia, Maryland, and West Virginia.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Store Location Integration**: Dynamic store selection based on geographic areas
- **File Upload Support**: Resume and cover letter upload with drag-and-drop functionality
- **Email System**: Automated email notifications to recruiting team and applicants
- **Form Validation**: Client-side and server-side validation for data integrity
- **Security**: Rate limiting, CORS protection, and secure file handling

## Deployment (Netlify)

This application is designed to run on Netlify using serverless functions.

### Prerequisites

1. Node.js (version 18 or higher)
2. Netlify account
3. Gmail account for email service

### Environment Variables

Configure the following environment variables in your Netlify dashboard:

```
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
RECIPIENT_EMAIL=skye.v@metrowirelessplus.com,abbie.thompson@metrowirelessplus.com
NODE_ENV=production
```

### Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**: 
   - Build command: `npm install`
   - Publish directory: `.` (root directory)
3. **Environment Variables**: Add the required environment variables in Netlify dashboard
4. **Deploy**: Netlify will automatically deploy your application

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables
4. Install Netlify CLI: `npm install -g netlify-cli`
5. Run locally: `netlify dev`

## Email System

### 📧 **Automated Email Routing**
The application features a sophisticated email system that automatically routes candidate applications to the appropriate district managers:

- **Primary Email**: Sent to district manager based on selected store
- **CC Copy**: Recruiting manager receives all applications
- **Confirmation Email**: Candidates receive immediate confirmation
- **File Attachments**: Resume and cover letter automatically attached
- **Professional Templates**: Branded HTML email templates

### 📨 **Email Flow Process**
1. Candidate submits application with resume/cover letter
2. System validates files and form data
3. Email sent to district manager with attachments
4. Recruiting manager receives CC copy
5. Candidate receives confirmation email
6. Files automatically cleaned up after sending

### 🎯 **District Manager Routing**
| District | Email | Coverage |
|----------|-------|----------|
| Florida - Tampa Bay | `tampa.dm@metrowirelessplus.com` | Tampa, St Petersburg |
| Florida - North | `north.fl.dm@metrowirelessplus.com` | Gainesville, Leesburg, Brooksville |
| Florida - Central | `central.fl.dm@metrowirelessplus.com` | Spring Hill, Palm Beach |
| Florida - South | `south.fl.dm@metrowirelessplus.com` | Fort Pierce, Miami, Lauderdale |
| Virginia | `virginia.dm@metrowirelessplus.com` | All Virginia stores |
| Maryland | `maryland.dm@metrowirelessplus.com` | Hagerstown |
| West Virginia | `wv.dm@metrowirelessplus.com` | Martinsburg, Charles Town |

**Recruiting Manager (CC):** `recruiting@metrowirelessplus.com`

### ✅ **Email Testing**
Test your email configuration:
```bash
curl http://localhost:3000/api/test-email
```

For detailed email setup instructions, see <mcfile name="EMAIL_SETUP_GUIDE.md" path="/Users/skyevasquez/1Projects/hire page/EMAIL_SETUP_GUIDE.md"></mcfile>

## File Structure

```
metro-wireless-careers/
├── index.html          # Main application page
├── styles.css          # Styling and responsive design
├── script.js           # Frontend functionality
├── server.js           # Backend server and email handling
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (create this)
├── uploads/           # Temporary file storage (auto-created)
└── README.md          # This file
```

## Security Features

- **Rate Limiting**: Prevents spam submissions (5 applications per 15 minutes per IP)
- **File Validation**: Only PDF, DOC, and DOCX files allowed
- **File Size Limits**: Maximum 5MB per file
- **Input Sanitization**: All form inputs are validated and sanitized
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet Security**: Additional security headers

## Customization

### Branding
- Update the logo SVG in `index.html`
- Modify colors in `styles.css` (search for `#e91e63` for the primary brand color)
- Customize email templates in `server.js`

### Store Data
- Update store information in both `script.js` (frontend) and `server.js` (backend)
- Add new districts or modify existing ones as needed

### Form Fields
- Add or modify form fields in `index.html`
- Update validation logic in `script.js`
- Modify email templates in `server.js` to include new fields

## Deployment

### Production Deployment
1. Set up a production server (AWS, DigitalOcean, etc.)
2. Configure environment variables
3. Set up a reverse proxy (nginx recommended)
4. Configure SSL certificates
5. Set up email service (SendGrid, AWS SES, etc.)

### Environment Variables for Production
```env
NODE_ENV=production
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-password
PORT=3000
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus indicators for all interactive elements

## Support

For technical support or questions about the career portal, contact:
- **Technical Issues**: IT Support
- **Hiring Questions**: recruiting@metrowirelessplus.com

## License

© 2024 Metro Wireless Plus. All rights reserved.

---

**Note**: Remember to update all email addresses and configure your email service before deploying to production.