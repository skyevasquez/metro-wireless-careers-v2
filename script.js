// Store data organized by areas and districts
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

// Recruiting manager email (receives all applications)
const recruitingManager = "recruiting@metrowirelessplus.com";

// DOM elements
const areaSelect = document.getElementById('area');
const storeSelect = document.getElementById('store');
const applicationForm = document.getElementById('applicationForm');
const successModal = document.getElementById('successModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeAreaDropdown();
    initializeFileUploads();
    initializeFormValidation();
});

// Populate area dropdown
function initializeAreaDropdown() {
    const areas = Object.keys(storeData);
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
    });
}

// Handle area selection change
areaSelect.addEventListener('change', function() {
    const selectedArea = this.value;
    storeSelect.innerHTML = '<option value="">Select a store...</option>';
    
    if (selectedArea && storeData[selectedArea]) {
        storeSelect.disabled = false;
        const stores = storeData[selectedArea].stores;
        
        stores.forEach(store => {
            const option = document.createElement('option');
            option.value = JSON.stringify({
                code: store.code,
                name: store.name,
                address: store.address,
                city: store.city,
                area: selectedArea
            });
            option.textContent = `${store.name} - ${store.city}`;
            storeSelect.appendChild(option);
        });
    } else {
        storeSelect.disabled = true;
        storeSelect.innerHTML = '<option value="">First select an area...</option>';
    }
});

// File upload functionality
function initializeFileUploads() {
    const fileInputs = ['resume', 'coverLetter'];
    
    fileInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        const uploadArea = document.getElementById(inputId + 'Upload');
        const fileInfo = document.getElementById(inputId + 'Info');
        
        // Click to upload
        uploadArea.addEventListener('click', () => input.click());
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                handleFileSelect(input, fileInfo);
            }
        });
        
        // File selection
        input.addEventListener('change', () => handleFileSelect(input, fileInfo));
    });
}

// Handle file selection
function handleFileSelect(input, fileInfo) {
    const file = input.files[0];
    if (file) {
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PDF, DOC, or DOCX file.');
            input.value = '';
            return;
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            input.value = '';
            return;
        }
        
        // Show file info
        fileInfo.innerHTML = `
            <i class="fas fa-file-alt"></i>
            <strong>${file.name}</strong> (${formatFileSize(file.size)})
        `;
        fileInfo.classList.add('show');
    } else {
        fileInfo.classList.remove('show');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form validation
function initializeFormValidation() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'area', 'store', 'resume'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => clearFieldError(field));
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
        if (cleanPhone.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // File validation
    if (field.type === 'file' && field.hasAttribute('required')) {
        if (!field.files || field.files.length === 0) {
            isValid = false;
            errorMessage = 'Please upload your resume.';
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        fieldGroup.classList.add('success');
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group');
    fieldGroup.classList.add('error');
    fieldGroup.classList.remove('success');
    
    let errorElement = fieldGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        fieldGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Clear field error
function clearFieldError(field) {
    const fieldGroup = field.closest('.form-group');
    fieldGroup.classList.remove('error');
    const errorElement = fieldGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Form submission
applicationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'area', 'store', 'resume'];
    let isFormValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Prepare form data
        const formData = new FormData();
        
        // Add form fields
        const fields = ['firstName', 'lastName', 'email', 'phone', 'position', 'availability', 'message'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value) {
                formData.append(fieldId, field.value);
            }
        });
        
        // Add store information
        const selectedStore = JSON.parse(storeSelect.value);
        formData.append('storeInfo', JSON.stringify(selectedStore));
        
        // Add district manager email
        const districtManager = storeData[selectedStore.area].district_manager;
        formData.append('districtManager', districtManager);
        formData.append('recruitingManager', recruitingManager);
        
        // Add files
        const resumeFile = document.getElementById('resume').files[0];
        if (resumeFile) {
            formData.append('resume', resumeFile);
        }
        
        const coverLetterFile = document.getElementById('coverLetter').files[0];
        if (coverLetterFile) {
            formData.append('coverLetter', coverLetterFile);
        }
        
        // Submit form to Netlify function
        await simulateFormSubmission(formData);
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        applicationForm.reset();
        storeSelect.disabled = true;
        storeSelect.innerHTML = '<option value="">First select an area...</option>';
        document.querySelectorAll('.file-info').forEach(info => info.classList.remove('show'));
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('success', 'error');
        });
        
    } catch (error) {
        console.error('Main form submission error:', error);
        
        // Provide more specific error messages
        let errorMessage = 'There was an error submitting your application. Please try again.';
        
        if (error.message.includes('JSON')) {
            errorMessage = 'Server response error. Your application may have been submitted - please check your email for confirmation before trying again.';
        } else if (error.message.includes('Network')) {
            errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('Failed to submit application')) {
            errorMessage = error.message;
        }
        
        alert(errorMessage);
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Submit form to Netlify function
async function simulateFormSubmission(formData) {
    try {
        console.log('Starting form submission...');
        
        const response = await fetch('/.netlify/functions/submit-application', {
            method: 'POST',
            body: formData
        });

        console.log('Response received:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });

        let result;
        try {
            result = await response.json();
            console.log('Response JSON:', result);
        } catch (jsonError) {
            console.error('Failed to parse response JSON:', jsonError);
            throw new Error('Server response was not valid JSON');
        }

        if (response.ok && result.success) {
            console.log('Form submission successful!');
            
            return result;
            
        } else {
            console.error('Form submission failed:', {
                responseOk: response.ok,
                resultSuccess: result.success,
                error: result.error
            });
            throw new Error(result.error || 'Failed to submit application');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        // Re-throw to be caught by the main form handler
        throw error;
    }
}

// Show success modal
function showSuccessModal() {
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeModal();
    }
});

// Keyboard navigation for modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal.style.display === 'block') {
        closeModal();
    }
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    e.target.value = value;
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Tab navigation for file upload areas
    if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target.classList.contains('file-upload-area')) {
            e.preventDefault();
            const input = target.querySelector('input[type="file"]');
            if (input) input.click();
        }
    }
});

// Auto-save form data to localStorage (optional feature)
function saveFormData() {
    const formData = {};
    const inputs = applicationForm.querySelectorAll('input:not([type="file"]), select, textarea');
    inputs.forEach(input => {
        if (input.value) {
            formData[input.name || input.id] = input.value;
        }
    });
    localStorage.setItem('metroWirelessApplication', JSON.stringify(formData));
}

// Load saved form data
function loadFormData() {
    const savedData = localStorage.getItem('metroWirelessApplication');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            Object.keys(formData).forEach(key => {
                const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'file') {
                    field.value = formData[key];
                    if (field.id === 'area') {
                        // Trigger area change to populate stores
                        field.dispatchEvent(new Event('change'));
                    }
                }
            });
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }
}

// Save form data on input changes
applicationForm.addEventListener('input', debounce(saveFormData, 1000));

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Load saved data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Clear saved data on successful submission
function clearSavedData() {
    localStorage.removeItem('metroWirelessApplication');
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 16px;
                max-width: 400px;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 12px;
                border-left: 4px solid #007bff;
                animation: slideIn 0.3s ease-out;
            }
            .notification-success { border-left-color: #28a745; }
            .notification-error { border-left-color: #dc3545; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #666;
                padding: 4px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}