const nodemailer = require('nodemailer');
const multipart = require('lambda-multipart-parser');

// Create email transporter
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

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
        // Check if this is a debug test call
        const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
        
        if (contentType.includes('application/json')) {
            // This is a debug test call
            const testData = JSON.parse(event.body);
            
            if (testData.debug === true) {
                // Environment check
                const envCheck = {
                    EMAIL_USER: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'NOT SET',
                    EMAIL_PASS: process.env.EMAIL_PASS ? '***SET***' : 'NOT SET',
                    RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL ? `${process.env.RECIPIENT_EMAIL.substring(0, 3)}***` : 'NOT SET'
                };

                // Test email transporter
                let transporterStatus = 'UNKNOWN';
                try {
                    const transporter = createTransporter();
                    await transporter.verify();
                    transporterStatus = 'VERIFIED';
                } catch (transporterError) {
                    transporterStatus = `ERROR: ${transporterError.message}`;
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        debug: true,
                        message: 'Debug submit function test successful!',
                        environment: envCheck,
                        transporter: transporterStatus,
                        timestamp: new Date().toISOString()
                    })
                };
            }
        }

        // Regular form submission processing
        let formData;
        try {
            formData = await multipart.parse(event);
        } catch (parseError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Failed to parse form data',
                    details: parseError.message,
                    contentType: contentType,
                    bodyLength: event.body ? event.body.length : 0
                })
            };
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            position,
            availability,
            message,
            storeInfo
        } = formData;

        // Validate required fields
        if (!firstName || !lastName || !email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing required fields: firstName, lastName, email',
                    received: { firstName, lastName, email }
                })
            };
        }

        // Parse store information
        let store;
        try {
            store = JSON.parse(storeInfo);
        } catch (storeParseError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Failed to parse store information',
                    details: storeParseError.message,
                    storeInfo: storeInfo
                })
            };
        }

        // Get uploaded files
        const resumeFile = formData.files ? formData.files.find(f => f.fieldname === 'resume') : null;
        const coverLetterFile = formData.files ? formData.files.find(f => f.fieldname === 'coverLetter') : null;

        if (!resumeFile) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Resume is required',
                    filesReceived: formData.files ? formData.files.map(f => f.fieldname) : []
                })
            };
        }

        // Test email transporter
        let transporter;
        try {
            transporter = createTransporter();
            await transporter.verify();
        } catch (transporterError) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Email configuration error',
                    details: transporterError.message,
                    code: transporterError.code
                })
            };
        }

        // If we get here, everything looks good for a real submission
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Debug: Form data parsed successfully and email transporter verified!',
                debug: {
                    applicant: `${firstName} ${lastName}`,
                    email: email,
                    store: store.name,
                    resumeFile: resumeFile.filename,
                    coverLetterFile: coverLetterFile ? coverLetterFile.filename : 'None',
                    transporterVerified: true
                }
            })
        };

    } catch (error) {
        console.error('Debug submit error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            })
        };
    }
};