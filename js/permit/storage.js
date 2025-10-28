import { elements } from './dom.js';

export function saveFormData() {
    const formData = {
        destination: elements.destination.value,
        purpose: elements.purpose.value,
        companions: elements.companions.value
    };
    
    localStorage.setItem('letterFormData', JSON.stringify(formData));
}

export function loadFormData() {
    const savedData = localStorage.getItem('letterFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        elements.destination.value = formData.destination || '';
        elements.purpose.value = formData.purpose || '';
        elements.companions.value = formData.companions || '';
    }
}

export function setupAutoSave() {
    [elements.destination, elements.purpose, elements.companions].forEach(input => {
        input.addEventListener('input', saveFormData);
    });
}
