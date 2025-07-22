const nodemailer = require('nodemailer');
const multipart = require('lambda-multipart-parser');

// Email configuration
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Additional recipients from environment variables
const getAdditionalRecipients = () => {
    const recipients = process.env.RECIPIENT_EMAIL;
    if (recipients) {
        return recipients.split(',').map(email => email.trim()).filter(email => email);
    }
    return [];
};

const recruitingManager = "recruiting@metrowirelessplus.com";

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Log for debugging
    console.log('Function called with method:', event.httpMethod);
    console.log('Environment variables check:', {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
        hasRecipientEmail: !!process.env.RECIPIENT_EMAIL
    });

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse multipart form data
        const result = await multipart.parse(event);
        
        const {
            firstName,
            lastName,
            email,
            phone,
            position,
            availability,
            message,
            storeInfo
        } = result;

        // Parse store information
        const store = JSON.parse(storeInfo);
        
        // Get uploaded files
        const resumeFile = result.files.find(f => f.fieldname === 'resume');
        const coverLetterFile = result.files.find(f => f.fieldname === 'coverLetter');

        if (!resumeFile) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Resume is required' })
            };
        }

        // Create email transporter
        const transporter = createTransporter();

        // Prepare email content
        const emailSubject = `New Job Application - ${firstName} ${lastName} - ${store.name}`;
        
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #e91e63, #ad1457); color: white; padding: 20px; text-align: center;">
                    <h1>New Job Application</h1>
                    <p>Metro Wireless Plus Career Portal</p>
                </div>
                
                <div style="padding: 20px; background: #f9f9f9;">
                    <h2 style="color: #333;">Applicant Information</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${firstName} ${lastName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Position:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${position || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Availability:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${availability || 'Not specified'}</td>
                        </tr>
                    </table>
                    
                    <h2 style="color: #333; margin-top: 30px;">Store Information</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Store:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${store.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Code:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${store.code}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Address:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${store.address}, ${store.city}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Area:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${store.area}</td>
                        </tr>
                    </table>
                    
                    ${message ? `
                    <h2 style="color: #333; margin-top: 30px;">Additional Information</h2>
                    <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #e91e63;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    ` : ''}
                    
                    <div style="margin-top: 30px; padding: 15px; background: #e8f5e8; border-radius: 5px;">
                        <p style="margin: 0; color: #2e7d32;">
                            <strong>Attachments:</strong> Resume${coverLetterFile ? ' and Cover Letter' : ''} attached to this email.
                        </p>
                    </div>
                </div>
                
                <div style="background: #333; color: white; padding: 15px; text-align: center;">
                    <p style="margin: 0;">Metro Wireless Plus - Career Application System</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
                        Application submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>
        `;

        // Prepare attachments
        const attachments = [
            {
                filename: `Resume_${firstName}_${lastName}_${resumeFile.filename}`,
                content: resumeFile.content,
                contentType: resumeFile.contentType
            }
        ];

        if (coverLetterFile) {
            attachments.push({
                filename: `CoverLetter_${firstName}_${lastName}_${coverLetterFile.filename}`,
                content: coverLetterFile.content,
                contentType: coverLetterFile.contentType
            });
        }

        // Send email to specified recipients
        const additionalRecipients = getAdditionalRecipients();
        const primaryRecipients = additionalRecipients.length > 0 ? additionalRecipients : [recruitingManager];
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@metrowirelessplus.com',
            to: primaryRecipients.join(', '),
            subject: emailSubject,
            html: emailBody,
            attachments: attachments
        };

        // Send email to specified recipients
        await transporter.sendMail(mailOptions);

        // Send confirmation email to applicant
        const confirmationEmailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #e91e63, #ad1457); color: white; padding: 20px; text-align: center;">
                    <h1>Application Received!</h1>
                    <p>Metro Wireless Plus</p>
                </div>
                
                <div style="padding: 20px;">
                    <h2 style="color: #333;">Thank you, ${firstName}!</h2>
                    <p>We have successfully received your application for a position at our <strong>${store.name}</strong> location.</p>
                    
                    <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #e91e63; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #e91e63;">Application Summary:</h3>
                        <p><strong>Position:</strong> ${position || 'General Application'}</p>
                        <p><strong>Store:</strong> ${store.name} (${store.code})</p>
                        <p><strong>Location:</strong> ${store.address}, ${store.city}</p>
                        <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    </div>
                    
                    <h3 style="color: #333;">What's Next?</h3>
                    <ul style="line-height: 1.6;">
                        <li>Your application has been forwarded to our recruiting team</li>
                        <li>Our team will review your qualifications</li>
                        <li>If you're a good fit, we'll contact you within 3-5 business days</li>
                        <li>Please keep an eye on your email and phone for updates</li>
                    </ul>
                    
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #2e7d32;">
                            <strong>📧 Questions?</strong> Contact our recruiting team at 
                            <a href="mailto:recruiting@metrowirelessplus.com" style="color: #e91e63;">recruiting@metrowirelessplus.com</a>
                        </p>
                    </div>
                </div>
                
                <div style="background: #333; color: white; padding: 15px; text-align: center;">
                    <p style="margin: 0;">Thank you for your interest in Metro Wireless Plus!</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
                        This is an automated confirmation email.
                    </p>
                </div>
            </div>
        `;

        const confirmationMailOptions = {
            from: process.env.EMAIL_USER || 'noreply@metrowirelessplus.com',
            to: email,
            subject: `Application Received - Metro Wireless Plus - ${store.name}`,
            html: confirmationEmailBody
        };

        // Send confirmation email (don't fail the whole process if this fails)
        try {
            await transporter.sendMail(confirmationMailOptions);
            console.log(`Confirmation email sent to ${email}`);
        } catch (confirmationError) {
            console.error('Failed to send confirmation email:', confirmationError);
            // Continue processing - confirmation email failure shouldn't break the application
        }

        // Log successful application
        console.log(`Application received from ${firstName} ${lastName} (${email}) for ${store.name}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Application submitted successfully! Check your email for confirmation.' 
            })
        };

    } catch (error) {
        console.error('Error processing application:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to submit application. Please try again.' 
            })
        };
    }
};