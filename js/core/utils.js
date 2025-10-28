// Helper functions untuk formatting
export function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

export function formatDateTime(dateStr, timeStr) {
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
