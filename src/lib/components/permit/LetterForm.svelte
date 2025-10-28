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

<div class="mb-6 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
  <div class="bg-white/10 backdrop-blur-xl rounded-[20px] p-6 border border-white/10">
    <div class="text-center mb-6">
      <i class="fas fa-heart text-4xl text-[#0A84FF] mb-3"></i>
      <h2 class="text-2xl font-bold text-white mb-2">Buat Surat Izin Keluar</h2>
      <p class="text-white/70 mb-4">Isi form di bawah untuk membuat surat izin keluar yang resmi</p>
      <div class="flex items-center gap-2 bg-[#0A84FF]/20 text-[#0A84FF] px-4 py-3 rounded-[12px] text-sm border border-[#0A84FF]/30">
        <i class="fas fa-magic"></i>
        <span>Nama pembuat surat dan penerima akan terdeteksi otomatis berdasarkan device Anda</span>
      </div>
    </div>

    <form class="space-y-4" onsubmit={handleSubmit}>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="exitDate" class="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <i class="fas fa-calendar text-[#0A84FF]"></i>
            Tanggal Keluar
          </label>
          <input type="date" id="exitDate" bind:value={exitDate} required class="w-full px-4 py-3 rounded-[12px] bg-black/30 border border-white/10 text-white outline-none transition-all focus:border-[#0A84FF]">
        </div>
        <div>
          <label for="exitTime" class="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <i class="fas fa-clock text-[#0A84FF]"></i>
            Jam Keluar
          </label>
          <input type="time" id="exitTime" bind:value={exitTime} required class="w-full px-4 py-3 rounded-[12px] bg-black/30 border border-white/10 text-white outline-none transition-all focus:border-[#0A84FF]">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="returnDate" class="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <i class="fas fa-calendar-check text-[#0A84FF]"></i>
            Tanggal Kembali
          </label>
          <input type="date" id="returnDate" bind:value={returnDate} required class="w-full px-4 py-3 rounded-[12px] bg-black/30 border border-white/10 text-white outline-none transition-all focus:border-[#0A84FF]">
        </div>
        <div>
          <label for="returnTime" class="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <i class="fas fa-clock text-[#0A84FF]"></i>
            Jam Kembali
          </label>
          <input type="time" id="returnTime" bind:value={returnTime} required class="w-full px-4 py-3 rounded-[12px] bg-black/30 border border-white/10 text-white outline-none transition-all focus:border-[#0A84FF]">
        </div>
      </div>

      <div>
        <label for="destination" class="flex items-center gap-2 text-sm font-semibold text-white mb-2">
          <i class="fas fa-map-marker-alt text-[#0A84FF]"></i>
          Tujuan
        </label>
        <input type="text" id="destination" bind:value={destination} required placeholder="Mau pergi kemana?" class="w-full px-4 py-3 rounded-[12px] bg-black/30 border border-white/10 text-white placeholder:text-white/40 outline-none transition-all focus:border-[#0A84FF]">
      </div>

      <div>
        <label for="purpose" class="flex items-center gap-2 text-sm font-semibold text-white mb-2">
          <i class="fas fa-question-circle text-[#0A84FF]"></i>
          Keperluan
        </label>
        <textarea id="purpose" bind:value={purpose} required placeholder="Jelaskan keperluan Anda..." rows="3" class="w-full px-4 py-3 rounded-[12px] bg-black/30 border border-white/10 text-white placeholder:text-white/40 outline-none transition-all focus:border-[#0A84FF] resize-none"></textarea>
      </div>

      <div>
        <label for="companions" class="flex items-center gap-2 text-sm font-semibold text-white mb-2">
          <i class="fas fa-users text-[#0A84FF]"></i>
          Dengan Siapa? (Opsional)
        </label>
        <input type="text" id="companions" bind:value={companions} placeholder="Nama teman/keluarga yang ikut" class="w-full px-4 py-3 rounded-[12px] bg-black/30 border border-white/10 text-white placeholder:text-white/40 outline-none transition-all focus:border-[#0A84FF]">
      </div>

      <div class="flex gap-3 pt-2">
        <button type="button" class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[17px] font-semibold border-none rounded-[14px] cursor-pointer min-h-[52px] bg-white/10 text-white transition-all active:opacity-60 active:scale-95" onclick={handlePreviewClick}>
          <i class="fas fa-eye"></i>
          Preview Surat
        </button>
        <button type="submit" class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[17px] font-semibold text-white border-none rounded-[14px] cursor-pointer min-h-[52px] bg-[#0A84FF] transition-all active:opacity-60 active:scale-95">
          <i class="fas fa-file-alt"></i>
          Buat Surat
        </button>
      </div>
    </form>
  </div>
</div>
