import { elements } from './dom.js';
import { formatDate, formatDateTime } from '../core/utils.js';

export let currentLetter = null;

export function generateLetter() {
    const letterData = {
        senderName: elements.senderName.value.trim(),
        recipientName: elements.recipientName.value.trim(),
        exitDate: elements.exitDate.value,
        exitTime: elements.exitTime.value,
        returnDate: elements.returnDate.value,
        returnTime: elements.returnTime.value,
        destination: elements.destination.value.trim(),
        purpose: elements.purpose.value.trim(),
        companions: elements.companions.value.trim()
    };
    
    currentLetter = letterData;
    
    const letterHTML = createLetterHTML(letterData);
    elements.letterContainer.innerHTML = letterHTML;
}

export function createLetterHTML(data) {
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

export function getCurrentLetter() {
    return currentLetter;
}
