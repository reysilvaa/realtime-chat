<script lang="ts">
  import type { Letter } from '$lib/types';
  
  interface Props {
    onPreview: (letter: Letter) => void;
    onSubmit: (letter: Letter) => void;
    senderName: string;
    recipientName: string;
  }
  
  let { onPreview, onSubmit, senderName, recipientName }: Props = $props();
  
  let exitDate = $state('');
  let exitTime = $state('');
  let returnDate = $state('');
  let returnTime = $state('');
  let destination = $state('');
  let purpose = $state('');
  let companions = $state('');
  
  function setDefaultDates() {
    const now = new Date();
    exitDate = now.toISOString().split('T')[0];
    exitTime = now.toTimeString().slice(0, 5);
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    returnDate = tomorrow.toISOString().split('T')[0];
    returnTime = now.toTimeString().slice(0, 5);
  }
  
  $effect(() => {
    setDefaultDates();
  });
  
  function getLetterData(): Letter {
    return {
      sender_name: senderName,
      recipient_name: recipientName,
      exit_date: exitDate,
      exit_time: exitTime,
      return_date: returnDate,
      return_time: returnTime,
      destination,
      purpose,
      companions: companions || undefined
    };
  }
  
  function handlePreviewClick() {
    onPreview(getLetterData());
  }
  
  function handleSubmit(e: Event) {
    e.preventDefault();
    onSubmit(getLetterData());
  }
</script>

<div class="form-section fade-in">
  <div class="form-card">
    <div class="form-header">
      <i class="fas fa-heart"></i>
      <h2>Buat Surat Izin Keluar</h2>
      <p>Isi form di bawah untuk membuat surat izin keluar yang resmi</p>
      <div class="auto-detect-info">
        <i class="fas fa-magic"></i>
        <span>Nama pembuat surat dan penerima akan terdeteksi otomatis berdasarkan device Anda</span>
      </div>
    </div>

    <form class="permit-form" onsubmit={handleSubmit}>
      <div class="form-row">
        <div class="form-group">
          <label for="exitDate">
            <i class="fas fa-calendar"></i>
            Tanggal Keluar
          </label>
          <input type="date" id="exitDate" bind:value={exitDate} required>
        </div>
        <div class="form-group">
          <label for="exitTime">
            <i class="fas fa-clock"></i>
            Jam Keluar
          </label>
          <input type="time" id="exitTime" bind:value={exitTime} required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="returnDate">
            <i class="fas fa-calendar-check"></i>
            Tanggal Kembali
          </label>
          <input type="date" id="returnDate" bind:value={returnDate} required>
        </div>
        <div class="form-group">
          <label for="returnTime">
            <i class="fas fa-clock"></i>
            Jam Kembali
          </label>
          <input type="time" id="returnTime" bind:value={returnTime} required>
        </div>
      </div>

      <div class="form-group">
        <label for="destination">
          <i class="fas fa-map-marker-alt"></i>
          Tujuan
        </label>
        <input type="text" id="destination" bind:value={destination} required placeholder="Mau pergi kemana?">
      </div>

      <div class="form-group">
        <label for="purpose">
          <i class="fas fa-question-circle"></i>
          Keperluan
        </label>
        <textarea id="purpose" bind:value={purpose} required placeholder="Jelaskan keperluan Anda..." rows="3"></textarea>
      </div>

      <div class="form-group">
        <label for="companions">
          <i class="fas fa-users"></i>
          Dengan Siapa? (Opsional)
        </label>
        <input type="text" id="companions" bind:value={companions} placeholder="Nama teman/keluarga yang ikut">
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" onclick={handlePreviewClick}>
          <i class="fas fa-eye"></i>
          Preview Surat
        </button>
        <button type="submit" class="btn-primary">
          <i class="fas fa-file-alt"></i>
          Buat Surat
        </button>
      </div>
    </form>
  </div>
</div>
