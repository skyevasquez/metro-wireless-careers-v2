const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many applications submitted, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Apply rate limiting to application submissions
app.use('/api/submit-application', limiter);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) || 
                        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
        }
    }
});

// Email configuration
const createTransporter = () => {
    // Configure based on your email service
    // Example for Gmail (you'll need to set up app passwords)
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        }
    });
    
    // Alternative configuration for other SMTP services
    /*
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.your-provider.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    */
};

// Store data with district manager emails
const storeData = {
    "Florida - Tampa Bay": {
        district_manager: "tampa.dm@metrowirelessplus.com",
        stores: [
            { code: "50MPL008", name: "Florida Ave", address: "14949 N Florida Ave", city: "TAMPA" },
            { code: "50MPL005", name: "Hillsborough", address: "2513 W Hillsborough Ave Ste 105", city: "TAMPA" },
            { code: "12349439", name: "Waters", address: "4339 W Waters Ave", city: "TAMPA" },
            { code: "50MPL004", name: "22nd Ave", address: "4725 22nd Ave S", city: "ST PETERSBURG" }
        ]
    },
    "Florida - North": {
        district_manager: "north.fl.dm@metrowirelessplus.com",
        stores: [
            { code: "70851486", name: "Newberry", address: "1025 NW 76TH BLVD", city: "Gainesville" },
            { code: "70814859", name: "Hwy 441", address: "10700 US Highway 441", city: "LEESBURG" },
            { code: "70851449", name: "Brooksville", address: "13035 Cortez Blvd", city: "BROOKSVILLE" },
            { code: "70851446", name: "Inverness", address: "2103 S US Highway 41", city: "INVERNESS" },
            { code: "70814854", name: "Citrus", address: "2199 Citrus Blvd # A", city: "LEESBURG" },
            { code: "70814857", name: "Eustis", address: "2812 S Bay St", city: "EUSTIS" },
            { code: "70851487", name: "Archer", address: "3800 Sw Archer Road Ste B", city: "Gainesville" },
            { code: "70851855", name: "Wildwood", address: "334 Shopping Center Dr", city: "WILDWOOD" },
            { code: "70849049", name: "Leesburg", address: "703 E Market St Ste C", city: "LEESBURG" },
            { code: "70814858", name: "14th St", address: "716 N 14Th St", city: "LEESBURG" }
        ]
    },
    "Florida - Central": {
        district_manager: "central.fl.dm@metrowirelessplus.com",
        stores: [
            { code: "70851445", name: "Spring Hill", address: "11202 Spring Hill Dr", city: "Spring Hill" },
            { code: "70814794", name: "N Palm Beach", address: "11585 Us Highway 1 Ste 303", city: "North Palm Beach" },
            { code: "70851447", name: "Commerical", address: "4385 Commercial Way", city: "Spring Hill" },
            { code: "70851448", name: "Homosassa", address: "4524 S Suncoast Blvd", city: "Homosassa" },
            { code: "70814856", name: "Tavares", address: "460 E Burleigh Blvd", city: "Tavares" },
            { code: "70851130", name: "Pembroke Rd", address: "6776 Pembroke Rd", city: "PEMBROKE PINES" }
        ]
    },
    "Florida - South": {
        district_manager: "south.fl.dm@metrowirelessplus.com",
        stores: [
            { code: "70814798", name: "Fort Pierce '2801'", address: "2801 N US Highway 1", city: "Fort Pierce" },
            { code: "70814795", name: "Kings", address: "4856 N Kings Hwy # 20", city: "Fort Pierce" },
            { code: "70849852", name: "Miami Beach", address: "7110 Indian Creek Dr", city: "MIAMI BEACH" },
            { code: "70814797", name: "Southgate", address: "7220 Southgate Blvd", city: "NORTH LAUDERDALE" },
            { code: "70814799", name: "Flagler", address: "7795 W Flagler St. Unit M57B", city: "MIAMI" },
            { code: "70811994", name: "Park", address: "8100 Park Blvd N", city: "Pinellas Park" },
            { code: "70851131", name: "NE 62nd", address: "910 NE 62nd St", city: "OAKLAND PARK" },
            { code: "70851778", name: "17th Ave", address: "12641 NW 17th Ave", city: "Miami" },
            { code: "70852199", name: "Marlins", address: "501 Marlins Way", city: "Miami" }
        ]
    },
    "Virginia": {
        district_manager: "virginia.dm@metrowirelessplus.com",
        stores: [
            { code: "70849048", name: "Fairfax One", address: "11112 Lee Hwy", city: "Fairfax" },
            { code: "70849044", name: "Chantilly", address: "13881F Metrotech Dr", city: "CHANTILLY" },
            { code: "70849045", name: "Centreville", address: "14200C Centreville Sq", city: "Centreville" },
            { code: "70849046", name: "Dulles Sterling", address: "21100 Dulles Town Cir Ste 186", city: "Sterling" },
            { code: "70849058", name: "Weems", address: "38 Weems Ln", city: "Winchester" },
            { code: "70849042", name: "Beauregard", address: "4810 Beauregard St", city: "Alexandria" },
            { code: "70849041", name: "Rose Hill", address: "6104 Rose Hill Dr", city: "Alexandria" },
            { code: "70849043", name: "Springfield", address: "6500 Springfield Mall Spc CA202", city: "SPRINGFIELD" },
            { code: "70849052", name: "Fairfax Two", address: "9679 Fairfax Blvd", city: "Fairfax" },
            { code: "70849051", name: "Manassas", address: "9878 Liberia Ave", city: "Manassas" },
            { code: "70849059", name: "Culpeper", address: "741 Dominion Sq Shopping Ctr", city: "Culpeper" }
        ]
    },
    "Maryland": {
        district_manager: "maryland.dm@metrowirelessplus.com",
        stores: [
            { code: "70849050", name: "Valley Mall", address: "17301 Valley Mall Rd Spc SL220", city: "Hagerstown" }
        ]
    },
    "West Virginia": {
        district_manager: "wv.dm@metrowirelessplus.com",
        stores: [
            { code: "70849060", name: "Martinsburg", address: "1315 EDWIN MILLER BLVD", city: "MARTINSBURG" },
            { code: "70849054", name: "Charles Town", address: "767 E WASHINGTON ST", city: "Charles Town" }
        ]
    }
};

const recruitingManager = "recruiting@metrowirelessplus.com";

// Additional recipients from environment variables
const getAdditionalRecipients = () => {
    const recipients = process.env.RECIPIENT_EMAIL;
    if (recipients) {
        return recipients.split(',').map(email => email.trim()).filter(email => email);
    }
    return [];
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get store data
app.get('/api/stores', (req, res) => {
    try {
        res.json({
            success: true,
            data: storeData
        });
    } catch (error) {
        console.error('Error fetching store data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch store data'
        });
    }
});

// API endpoint to test email configuration
app.get('/api/test-email', async (req, res) => {
    try {
        const transporter = createTransporter();
        
        // Verify email configuration
        await transporter.verify();
        
        res.json({
            success: true,
            message: 'Email configuration is valid'
        });
    } catch (error) {
        console.error('Email configuration error:', error);
        res.status(500).json({
            success: false,
            error: 'Email configuration is invalid. Please check your environment variables.',
            details: error.message
        });
    }
});

// API endpoint for form submission
app.post('/api/submit-application', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            position,
            availability,
            message,
            storeInfo,
            districtManager
        } = req.body;

        // Parse store information
        const store = JSON.parse(storeInfo);
        
        // Get uploaded files
        const resumeFile = req.files['resume'] ? req.files['resume'][0] : null;
        const coverLetterFile = req.files['coverLetter'] ? req.files['coverLetter'][0] : null;

        if (!resumeFile) {
            return res.status(400).json({ error: 'Resume is required' });
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
                filename: `Resume_${firstName}_${lastName}_${resumeFile.originalname}`,
                path: resumeFile.path
            }
        ];

        if (coverLetterFile) {
            attachments.push({
                filename: `CoverLetter_${firstName}_${lastName}_${coverLetterFile.originalname}`,
                path: coverLetterFile.path
            });
        }

        // Send email to specified recipients (skye.v@metrowirelessplus.com, abbie.thompson@metrowirelessplus.com)
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

        // Clean up uploaded files after sending email
        setTimeout(() => {
            if (resumeFile && fs.existsSync(resumeFile.path)) {
                fs.unlinkSync(resumeFile.path);
            }
            if (coverLetterFile && fs.existsSync(coverLetterFile.path)) {
                fs.unlinkSync(coverLetterFile.path);
            }
        }, 5000); // Delete files after 5 seconds

        res.json({ 
            success: true, 
            message: 'Application submitted successfully! Check your email for confirmation.' 
        });

    } catch (error) {
        console.error('Error processing application:', error);
        
        // Clean up files on error
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to submit application. Please try again.' 
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
    }
    
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Metro Wireless Plus Career Portal running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

module.exports = app;