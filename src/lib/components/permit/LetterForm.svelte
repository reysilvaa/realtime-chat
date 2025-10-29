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

<div class="mb-4 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
  <!-- Header Card -->
  <div class="bg-white rounded-[12px] p-6 mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
    <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FF9500] to-[#FF3B30] flex items-center justify-center shadow-lg">
        <i class="fas fa-file-alt text-white text-2xl"></i>
      </div>
      <h2 class="text-[22px] font-bold text-[#1C1C1E] mb-2" style="letter-spacing: -0.5px;">Buat Surat Izin</h2>
      <p class="text-[#8E8E93] text-[15px] leading-tight" style="letter-spacing: -0.24px;">Isi form di bawah untuk membuat surat izin keluar</p>
    </div>
  </div>
  
  <!-- Info Banner -->
  <div class="bg-[#007AFF]/10 rounded-[12px] px-4 py-3 mb-4 flex items-start gap-3">
    <i class="fas fa-info-circle text-[#007AFF] text-lg flex-shrink-0 mt-0.5"></i>
    <p class="text-[#007AFF] text-[13px] leading-snug" style="letter-spacing: -0.08px;">Nama pembuat dan penerima otomatis terdeteksi dari device Anda</p>
  </div>
  
  <!-- Form Card -->
  <div class="bg-white rounded-[12px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">

    <form class="space-y-4" onsubmit={handleSubmit}>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="exitDate" class="block text-[13px] font-medium text-[#3C3C43] mb-1.5" style="letter-spacing: -0.08px;">
            Tanggal Keluar
          </label>
          <input type="date" id="exitDate" bind:value={exitDate} required class="w-full px-4 py-3 rounded-[10px] bg-[#F2F2F7] border border-transparent text-[#1C1C1E] outline-none transition-all focus:bg-white focus:border-[#007AFF] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.1)]" style="font-size: 17px; letter-spacing: -0.408px;">
        </div>
        <div>
          <label for="exitTime" class="block text-[13px] font-medium text-[#3C3C43] mb-1.5" style="letter-spacing: -0.08px;">
            Jam Keluar
          </label>
          <input type="time" id="exitTime" bind:value={exitTime} required class="w-full px-4 py-3 rounded-[10px] bg-[#F2F2F7] border border-transparent text-[#1C1C1E] outline-none transition-all focus:bg-white focus:border-[#007AFF] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.1)]" style="font-size: 17px; letter-spacing: -0.408px;">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="returnDate" class="block text-[13px] font-medium text-[#3C3C43] mb-1.5" style="letter-spacing: -0.08px;">
            Tanggal Kembali
          </label>
          <input type="date" id="returnDate" bind:value={returnDate} required class="w-full px-4 py-3 rounded-[10px] bg-[#F2F2F7] border border-transparent text-[#1C1C1E] outline-none transition-all focus:bg-white focus:border-[#007AFF] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.1)]" style="font-size: 17px; letter-spacing: -0.408px;">
        </div>
        <div>
          <label for="returnTime" class="block text-[13px] font-medium text-[#3C3C43] mb-1.5" style="letter-spacing: -0.08px;">
            Jam Kembali
          </label>
          <input type="time" id="returnTime" bind:value={returnTime} required class="w-full px-4 py-3 rounded-[10px] bg-[#F2F2F7] border border-transparent text-[#1C1C1E] outline-none transition-all focus:bg-white focus:border-[#007AFF] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.1)]" style="font-size: 17px; letter-spacing: -0.408px;">
        </div>
      </div>

      <div>
        <label for="destination" class="block text-[13px] font-medium text-[#3C3C43] mb-1.5" style="letter-spacing: -0.08px;">
          Tujuan
        </label>
        <input type="text" id="destination" bind:value={destination} required placeholder="Mau pergi kemana?" class="w-full px-4 py-3 rounded-[10px] bg-[#F2F2F7] border border-transparent text-[#1C1C1E] placeholder:text-[#8E8E93] outline-none transition-all focus:bg-white focus:border-[#007AFF] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.1)]" style="font-size: 17px; letter-spacing: -0.408px;">
      </div>

      <div>
        <label for="purpose" class="block text-[13px] font-medium text-[#3C3C43] mb-1.5" style="letter-spacing: -0.08px;">
          Keperluan
        </label>
        <textarea id="purpose" bind:value={purpose} required placeholder="Jelaskan keperluan Anda..." rows="3" class="w-full px-4 py-3 rounded-[10px] bg-[#F2F2F7] border border-transparent text-[#1C1C1E] placeholder:text-[#8E8E93] outline-none transition-all focus:bg-white focus:border-[#007AFF] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.1)] resize-none" style="font-size: 17px; letter-spacing: -0.408px;"></textarea>
      </div>

      <div>
        <label for="companions" class="block text-[13px] font-medium text-[#3C3C43] mb-1.5" style="letter-spacing: -0.08px;">
          Dengan Siapa? (Opsional)
        </label>
        <input type="text" id="companions" bind:value={companions} placeholder="Nama teman/keluarga yang ikut" class="w-full px-4 py-3 rounded-[10px] bg-[#F2F2F7] border border-transparent text-[#1C1C1E] placeholder:text-[#8E8E93] outline-none transition-all focus:bg-white focus:border-[#007AFF] focus:shadow-[0_0_0_3px_rgba(0,122,255,0.1)]" style="font-size: 17px; letter-spacing: -0.408px;">
      </div>

      <div class="flex gap-3 pt-2">
        <button type="button" class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[17px] font-semibold border-none rounded-[10px] cursor-pointer min-h-[50px] bg-[#F2F2F7] text-[#007AFF] transition-all active:opacity-70 active:scale-[0.98]" style="letter-spacing: -0.408px;" onclick={handlePreviewClick}>
          <i class="fas fa-eye"></i>
          Preview
        </button>
        <button type="submit" class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[17px] font-semibold text-white border-none rounded-[10px] cursor-pointer min-h-[50px] bg-[#007AFF] transition-all active:opacity-80 active:scale-[0.98] shadow-sm" style="letter-spacing: -0.408px;">
          <i class="fas fa-paper-plane"></i>
          Buat Surat
        </button>
      </div>
    </form>
  </div>
</div>
