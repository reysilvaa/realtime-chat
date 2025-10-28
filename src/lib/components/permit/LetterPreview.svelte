<script lang="ts">
  import { formatDate, formatTime } from '$lib/utils/formatters';
  import type { Letter } from '$lib/types';
  
  interface Props {
    letter: Letter;
    onEdit: () => void;
    onPrint: () => void;
    onSave: () => void;
  }
  
  let { letter, onEdit, onPrint, onSave }: Props = $props();
  
  function formatDateTime(date: string, time: string): string {
    const dateObj = new Date(date);
    return `${formatDate(date)}, Pukul ${formatTime(time)} WIB`;
  }
  
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
</script>

<div class="letter-section">
  <div class="letter-actions">
    <button class="btn-secondary" onclick={onEdit}>
      <i class="fas fa-edit"></i>
      Edit
    </button>
    <button class="btn-primary" onclick={onPrint}>
      <i class="fas fa-print"></i>
      Print
    </button>
    <button class="btn-success" onclick={onSave}>
      <i class="fas fa-save"></i>
      Simpan
    </button>
  </div>

  <div class="letter-container" id="letterContainer">
    <div class="letter-content">
      <div class="letter-header">
        <div class="letter-title">Surat Izin Keluar</div>
        <div class="letter-subtitle">Kepada Yang Tercinta</div>
      </div>
      
      <div class="letter-body">
        <p>Kepada {letter.recipient_name} tersayang,</p>
        
        <p>Dengan hormat, melalui surat ini saya bermaksud untuk meminta izin keluar kepada Anda. Adapun rincian keperluan saya adalah sebagai berikut:</p>
        
        <div class="letter-details">
          <div class="detail-row">
            <span class="detail-label">Nama Pemohon:</span>
            <span class="detail-value">{letter.sender_name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tanggal & Waktu Keluar:</span>
            <span class="detail-value">{formatDateTime(letter.exit_date, letter.exit_time)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tanggal & Waktu Kembali:</span>
            <span class="detail-value">{formatDateTime(letter.return_date, letter.return_time)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tujuan:</span>
            <span class="detail-value">{letter.destination}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Keperluan:</span>
            <span class="detail-value">{letter.purpose}</span>
          </div>
          {#if letter.companions}
            <div class="detail-row">
              <span class="detail-label">Dengan:</span>
              <span class="detail-value">{letter.companions}</span>
            </div>
          {/if}
        </div>
        
        <p>Saya berjanji akan kembali tepat waktu sesuai dengan yang telah disebutkan di atas. Saya juga berjanji akan menjaga diri dengan baik dan tidak melakukan hal-hal yang dapat merugikan atau mengecewakan Anda.</p>
        
        <p>Demikian surat izin ini saya buat dengan sebenar-benarnya. Atas perhatian dan izin yang diberikan, saya ucapkan terima kasih.</p>
      </div>
      
      <div class="letter-footer">
        <div class="signature-section">
          <p>Mengetahui,</p>
          <div class="signature-line"></div>
          <div class="signature-name">{letter.recipient_name}</div>
          <small>(Yang Memberikan Izin)</small>
        </div>
        
        <div class="signature-section">
          <p>{currentDate}</p>
          <div class="signature-line"></div>
          <div class="signature-name">{letter.sender_name}</div>
          <small>(Pemohon Izin)</small>
        </div>
      </div>
    </div>
  </div>
</div>
