const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Log for debugging
    console.log('Test email function called with method:', event.httpMethod);
    console.log('Environment variables check:', {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS
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
        // Create email transporter
        const transporter = createTransporter();

        // Test email configuration
        await transporter.verify();

        // Send test email
        const testMailOptions = {
            from: process.env.EMAIL_USER || 'noreply@metrowirelessplus.com',
            to: process.env.EMAIL_USER || 'test@example.com',
            subject: 'Email Configuration Test - Metro Wireless Plus',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #e91e63, #ad1457); color: white; padding: 20px; text-align: center;">
                        <h1>Email Test Successful!</h1>
                        <p>Metro Wireless Plus Career Portal</p>
                    </div>
                    
                    <div style="padding: 20px;">
                        <h2 style="color: #333;">Configuration Status</h2>
                        <p>✅ Email service is working correctly</p>
                        <p>✅ SMTP connection established</p>
                        <p>✅ Authentication successful</p>
                        
                        <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; color: #2e7d32;">
                                <strong>Test completed at:</strong> ${new Date().toLocaleString()}
                            </p>
                        </div>
                    </div>
                    
                    <div style="background: #333; color: white; padding: 15px; text-align: center;">
                        <p style="margin: 0;">Metro Wireless Plus - Email System Test</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(testMailOptions);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Email configuration test successful!' 
            })
        };

    } catch (error) {
        console.error('Email test failed:', error);
        
        // Provide more detailed error information
        let errorDetails = error.message;
        let troubleshooting = '';
        
        if (error.code === 'EAUTH') {
            troubleshooting = 'Authentication failed. Check EMAIL_USER and EMAIL_PASS environment variables.';
        } else if (error.code === 'ENOTFOUND') {
            troubleshooting = 'Network error. Check internet connection.';
        } else if (error.message.includes('Invalid login')) {
            troubleshooting = 'Invalid Gmail credentials. Verify app password is correct.';
        } else if (error.message.includes('Less secure')) {
            troubleshooting = 'Enable 2FA and use app password instead of regular password.';
        }
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Email configuration test failed',
                details: errorDetails,
                troubleshooting: troubleshooting,
                envCheck: {
                    hasEmailUser: !!process.env.EMAIL_USER,
                    hasEmailPass: !!process.env.EMAIL_PASS,
                    emailUserValue: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '***' : 'not set'
                }
            })
        };
    }
};