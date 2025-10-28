import { elements } from './dom.js';
import { showNotification, showFormSection, showLetterSection } from './ui.js';
import { generateLetter, getCurrentLetter } from './letter.js';
import { saveLetter } from './supabase.js';

export function validateForm() {
    const requiredFields = [
        elements.exitDate, 
        elements.exitTime, 
        elements.returnDate, 
        elements.returnTime, 
        elements.destination, 
        elements.purpose
    ];
    
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

export function validateDates() {
    const exit = new Date(elements.exitDate.value + 'T' + elements.exitTime.value);
    const returnDateTime = new Date(elements.returnDate.value + 'T' + elements.returnTime.value);
    
    if (exit >= returnDateTime) {
        showNotification('Waktu kembali harus setelah waktu keluar', 'warning');
        return false;
    }
    
    return true;
}

export function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
        return;
    }
    
    generateLetter();
    showLetterSection();
}

export function handlePreview(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
        return;
    }
    
    generateLetter();
    showLetterSection();
}

export function handleEdit() {
    showFormSection();
}

export function handlePrint() {
    window.print();
}

export async function handleSave() {
    const letter = getCurrentLetter();
    if (!letter) {
        showNotification('Tidak ada surat untuk disimpan', 'error');
        return;
    }
    
    try {
        elements.saveBtn.classList.add('loading');
        await saveLetter(letter);
        showNotification('Surat berhasil disimpan!', 'success');
    } catch (error) {
        console.error('Error saving letter:', error);
        showNotification('Gagal menyimpan surat', 'error');
    } finally {
        elements.saveBtn.classList.remove('loading');
    }
}

export function setupFormValidation() {
    [elements.exitDate, elements.exitTime, elements.returnDate, elements.returnTime, elements.destination, elements.purpose].forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    elements.exitDate.addEventListener('change', validateDates);
    elements.returnDate.addEventListener('change', validateDates);
}

export function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    elements.exitDate.value = today.toISOString().split('T')[0];
    elements.returnDate.value = tomorrow.toISOString().split('T')[0];
    elements.exitTime.value = '19:00';
    elements.returnTime.value = '22:00';
}
