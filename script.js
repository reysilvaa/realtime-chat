// Konfigurasi Supabase
const SUPABASE_URL = 'https://zomhbdgmjoczkebtslhb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbWhiZGdtam9jemtlYnRzbGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Njk2NDYsImV4cCI6MjA3NzI0NTY0Nn0.v92vqtBjxXLDM8EX6jLKn7iY2PRmJt3K2ZhU1tx1D3c';

// Inisialisasi Supabase client
let supabase;
let currentLetter = null;

// DOM Elements
const permitForm = document.getElementById('permitForm');
const formSection = document.getElementById('formSection');
const letterSection = document.getElementById('letterSection');
const letterContainer = document.getElementById('letterContainer');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');
const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const notification = document.getElementById('notification');

// Form inputs
const senderName = document.getElementById('senderName');
const recipientName = document.getElementById('recipientName');
const exitDate = document.getElementById('exitDate');
const exitTime = document.getElementById('exitTime');
const returnDate = document.getElementById('returnDate');
const returnTime = document.getElementById('returnTime');
const destination = document.getElementById('destination');
const purpose = document.getElementById('purpose');
const companions = document.getElementById('companions');

// Buttons
const previewBtn = document.getElementById('previewBtn');
const editBtn = document.getElementById('editBtn');
const printBtn = document.getElementById('printBtn');
const saveBtn = document.getElementById('saveBtn');

// Function untuk detect device dan set nama otomatis
function detectDeviceAndSetName() {
    const userAgent = navigator.userAgent.toLowerCase();
    let detectedSenderName = '';
    let detectedRecipientName = '';
    let deviceType = '';
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
        detectedSenderName = 'Annisa';
        detectedRecipientName = 'Rey';
        deviceType = 'iOS';
    } else if (userAgent.includes('android')) {
        detectedSenderName = 'Rey';
        detectedRecipientName = 'Annisa';
        deviceType = 'Android';
    } else {
        // Default untuk Windows/Desktop/device lain
        detectedSenderName = 'Rey';
        detectedRecipientName = 'Annisa';
        deviceType = 'Desktop';
    }
    
    // Set nama otomatis ke hidden fields
    senderName.value = detectedSenderName;
    recipientName.value = detectedRecipientName;
    
    // Show notification tentang device detection
    showNotification(`Device terdeteksi: ${deviceType} - ${detectedSenderName} → ${detectedRecipientName}`, 'success');
    
    return { 
        senderName: detectedSenderName, 
        recipientName: detectedRecipientName,
        device: deviceType 
    };
}

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Inisialisasi Supabase
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Test koneksi
        const { data, error } = await supabase.from('letters').select('count').limit(1);
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist
            throw error;
        }
        
        updateConnectionStatus(true);
        setupEventListeners();
        loadHistory();
        
        // Auto-detect device dan set nama
        detectDeviceAndSetName();
        
        // Set default dates
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        exitDate.value = today.toISOString().split('T')[0];
        returnDate.value = tomorrow.toISOString().split('T')[0];
        exitTime.value = '19:00';
        returnTime.value = '22:00';
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Gagal terhubung ke server. Periksa koneksi internet.', 'error');
        updateConnectionStatus(false);
    }
}

function setupEventListeners() {
    // Form submission
    permitForm.addEventListener('submit', handleFormSubmit);
    
    // Preview button
    previewBtn.addEventListener('click', handlePreview);
    
    // Letter actions
    editBtn.addEventListener('click', handleEdit);
    printBtn.addEventListener('click', handlePrint);
    saveBtn.addEventListener('click', handleSave);
    
    // History toggle
    toggleHistoryBtn.addEventListener('click', toggleHistory);
    
    // Form validation (exclude hidden fields)
    [exitDate, exitTime, returnDate, returnTime, destination, purpose].forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    // Date validation
    exitDate.addEventListener('change', validateDates);
    returnDate.addEventListener('change', validateDates);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
        return;
    }
    
    generateLetter();
    showLetterSection();
}

function handlePreview(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
        return;
    }
    
    generateLetter();
    showLetterSection();
}

function handleEdit() {
    showFormSection();
}

function handlePrint() {
    window.print();
}

async function handleSave() {
    if (!currentLetter) {
        showNotification('Tidak ada surat untuk disimpan', 'error');
        return;
    }
    
    try {
        saveBtn.classList.add('loading');
        
        const letterData = {
            sender_name: currentLetter.senderName,
            recipient_name: currentLetter.recipientName,
            exit_date: currentLetter.exitDate,
            exit_time: currentLetter.exitTime,
            return_date: currentLetter.returnDate,
            return_time: currentLetter.returnTime,
            destination: currentLetter.destination,
            purpose: currentLetter.purpose,
            companions: currentLetter.companions || null,
            created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
            .from('letters')
            .insert([letterData]);
        
        if (error) throw error;
        
        showNotification('Surat berhasil disimpan!', 'success');
        loadHistory();
        
    } catch (error) {
        console.error('Error saving letter:', error);
        showNotification('Gagal menyimpan surat', 'error');
    } finally {
        saveBtn.classList.remove('loading');
    }
}

function generateLetter() {
    const letterData = {
        senderName: senderName.value.trim(),
        recipientName: recipientName.value.trim(),
        exitDate: exitDate.value,
        exitTime: exitTime.value,
        returnDate: returnDate.value,
        returnTime: returnTime.value,
        destination: destination.value.trim(),
        purpose: purpose.value.trim(),
        companions: companions.value.trim()
    };
    
    currentLetter = letterData;
    
    const letterHTML = createLetterHTML(letterData);
    letterContainer.innerHTML = letterHTML;
}

function createLetterHTML(data) {
    const exitDateTime = formatDateTime(data.exitDate, data.exitTime);
    const returnDateTime = formatDateTime(data.returnDate, data.returnTime);
    const currentDate = formatDate(new Date());
    
    return `
        <div class="letter-content">
            <div class="letter-header">
                <div class="letter-title">Surat Izin Keluar</div>
                <div class="letter-subtitle">Kepada Yang Tercinta</div>
            </div>
            
            <div class="letter-body">
                <p>Kepada ${data.recipientName} tersayang,</p>
                
                <p>Dengan hormat, melalui surat ini saya bermaksud untuk meminta izin keluar kepada Anda. Adapun rincian keperluan saya adalah sebagai berikut:</p>
                
                <div class="letter-details">
                    <div class="detail-row">
                        <span class="detail-label">Nama Pemohon:</span>
                        <span class="detail-value">${data.senderName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal & Waktu Keluar:</span>
                        <span class="detail-value">${exitDateTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal & Waktu Kembali:</span>
                        <span class="detail-value">${returnDateTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tujuan:</span>
                        <span class="detail-value">${data.destination}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Keperluan:</span>
                        <span class="detail-value">${data.purpose}</span>
                    </div>
                    ${data.companions ? `
                    <div class="detail-row">
                        <span class="detail-label">Dengan:</span>
                        <span class="detail-value">${data.companions}</span>
                    </div>
                    ` : ''}
                </div>
                
                <p>Saya berjanji akan kembali tepat waktu sesuai dengan yang telah disebutkan di atas. Saya juga berjanji akan menjaga diri dengan baik dan tidak melakukan hal-hal yang dapat merugikan atau mengecewakan Anda.</p>
                
                <p>Demikian surat izin ini saya buat dengan sebenar-benarnya. Atas perhatian dan izin yang diberikan, saya ucapkan terima kasih.</p>
            </div>
            
            <div class="letter-footer">
                <div class="signature-section">
                    <p>Mengetahui,</p>
                    <div class="signature-line"></div>
                    <div class="signature-name">${data.recipientName}</div>
                    <small>(Yang Memberikan Izin)</small>
                </div>
                
                <div class="signature-section">
                    <p>${currentDate}</p>
                    <div class="signature-line"></div>
                    <div class="signature-name">${data.senderName}</div>
                    <small>(Pemohon Izin)</small>
                </div>
            </div>
        </div>
    `;
}

function showFormSection() {
    formSection.style.display = 'block';
    letterSection.style.display = 'none';
    formSection.classList.add('fade-in');
}

function showLetterSection() {
    formSection.style.display = 'none';
    letterSection.style.display = 'block';
    letterSection.classList.add('fade-in');
    
    // Scroll to letter
    letterSection.scrollIntoView({ behavior: 'smooth' });
}

function validateForm() {
    // Hidden fields (senderName, recipientName) selalu valid karena auto-detect
    const requiredFields = [exitDate, exitTime, returnDate, returnTime, destination, purpose];
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ff4757';
            isValid = false;
        } else {
            field.style.borderColor = '#e1e8ed';
        }
    });
    
    return isValid;
}

function validateDates() {
    const exit = new Date(exitDate.value + 'T' + exitTime.value);
    const returnTime = new Date(returnDate.value + 'T' + returnTime.value);
    
    if (exit >= returnTime) {
        showNotification('Waktu kembali harus setelah waktu keluar', 'warning');
        return false;
    }
    
    return true;
}

async function loadHistory() {
    try {
        const { data: letters, error } = await supabase
            .from('letters')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (error) {
            console.log('History table might not exist yet:', error);
            return;
        }
        
        displayHistory(letters);
        
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

function displayHistory(letters) {
    if (!letters || letters.length === 0) {
        historyList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Belum ada riwayat surat</div>';
        return;
    }
    
    const historyHTML = letters.map(letter => {
        const date = formatDate(new Date(letter.created_at));
        const exitDate = formatDate(new Date(letter.exit_date));
        
        return `
            <div class="history-item" onclick="loadLetter('${letter.id}')">
                <div class="history-meta">
                    <span class="history-date">${date}</span>
                    <span class="history-status status-approved">Tersimpan</span>
                </div>
                <div class="history-preview">
                    <strong>${letter.sender_name}</strong> → ${letter.recipient_name}<br>
                    ${exitDate} • ${letter.destination}
                </div>
            </div>
        `;
    }).join('');
    
    historyList.innerHTML = historyHTML;
}

async function loadLetter(letterId) {
    try {
        const { data: letter, error } = await supabase
            .from('letters')
            .select('*')
            .eq('id', letterId)
            .single();
        
        if (error) throw error;
        
        // Fill form with letter data (nama akan auto-detect ulang)
        exitDate.value = letter.exit_date;
        exitTime.value = letter.exit_time;
        returnDate.value = letter.return_date;
        returnTime.value = letter.return_time;
        destination.value = letter.destination;
        purpose.value = letter.purpose;
        companions.value = letter.companions || '';
        
        // Re-detect nama untuk konsistensi
        detectDeviceAndSetName();
        
        // Generate and show letter
        generateLetter();
        showLetterSection();
        
        showNotification('Surat berhasil dimuat');
        
    } catch (error) {
        console.error('Error loading letter:', error);
        showNotification('Gagal memuat surat', 'error');
    }
}

function toggleHistory() {
    const isVisible = historyList.style.display !== 'none';
    
    if (isVisible) {
        historyList.style.display = 'none';
        toggleHistoryBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    } else {
        historyList.style.display = 'block';
        toggleHistoryBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        loadHistory();
    }
}

function updateConnectionStatus(isConnected) {
    if (isConnected) {
        statusDot.classList.add('online');
        statusText.textContent = 'Ready';
    } else {
        statusDot.classList.remove('online');
        statusText.textContent = 'Offline';
    }
}

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

function formatDateTime(dateStr, timeStr) {
    const date = new Date(dateStr + 'T' + timeStr);
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    
    return date.toLocaleDateString('id-ID', dateOptions) + ' pukul ' + date.toLocaleTimeString('id-ID', timeOptions);
}

// Auto-save form data to localStorage (exclude hidden fields karena auto-detect)
function saveFormData() {
    const formData = {
        destination: destination.value,
        purpose: purpose.value,
        companions: companions.value
    };
    
    localStorage.setItem('letterFormData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('letterFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        // senderName dan recipientName tidak di-load karena auto-detect
        destination.value = formData.destination || '';
        purpose.value = formData.purpose || '';
        companions.value = formData.companions || '';
    }
}

// Save form data on input (exclude hidden fields karena auto-detect)
[destination, purpose, companions].forEach(input => {
    input.addEventListener('input', saveFormData);
});

// Load saved form data on page load
setTimeout(loadFormData, 100);

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page is visible - check connection
        if (supabase) {
            supabase.from('letters').select('count').limit(1)
                .then(() => updateConnectionStatus(true))
                .catch(() => updateConnectionStatus(false));
        }
    }
});

// Connection check
setInterval(async function() {
    if (supabase) {
        try {
            await supabase.from('letters').select('count').limit(1);
            updateConnectionStatus(true);
        } catch (error) {
            updateConnectionStatus(false);
        }
    }
}, 30000); // Check every 30 seconds