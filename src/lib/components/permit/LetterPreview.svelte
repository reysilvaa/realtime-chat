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

<div class="mb-6">
  <div class="flex gap-3 mb-4">
    <button class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[17px] font-semibold border-none rounded-[14px] cursor-pointer min-h-[52px] bg-white/10 text-white transition-all active:opacity-60 active:scale-95" onclick={onEdit}>
      <i class="fas fa-edit"></i>
      Edit
    </button>
    <button class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[17px] font-semibold text-white border-none rounded-[14px] cursor-pointer min-h-[52px] bg-[#0A84FF] transition-all active:opacity-60 active:scale-95" onclick={onPrint}>
      <i class="fas fa-print"></i>
      Print
    </button>
    <button class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[17px] font-semibold text-white border-none rounded-[14px] cursor-pointer min-h-[52px] bg-[#30D158] transition-all active:opacity-60 active:scale-95" onclick={onSave}>
      <i class="fas fa-save"></i>
      Simpan
    </button>
  </div>

  <div class="bg-white/10 backdrop-blur-xl rounded-[20px] p-8 border border-white/10" id="letterContainer">
    <div>
      <div class="text-center mb-8 pb-4 border-b-2 border-[#0A84FF]">
        <div class="text-3xl font-bold text-white mb-2">Surat Izin Keluar</div>
        <div class="text-lg text-[#0A84FF] italic">Kepada Yang Tercinta</div>
      </div>
      
      <div class="space-y-4 text-white/90 leading-relaxed">
        <p>Kepada {letter.recipient_name} tersayang,</p>
        
        <p>Dengan hormat, melalui surat ini saya bermaksud untuk meminta izin keluar kepada Anda. Adapun rincian keperluan saya adalah sebagai berikut:</p>
        
        <div class="bg-black/30 rounded-[12px] p-5 space-y-3 my-6 border border-white/10">
          <div class="flex justify-between items-start border-b border-white/10 pb-2">
            <span class="font-semibold text-white/70 min-w-[180px]">Nama Pemohon:</span>
            <span class="text-white font-medium text-right">{letter.sender_name}</span>
          </div>
          <div class="flex justify-between items-start border-b border-white/10 pb-2">
            <span class="font-semibold text-white/70 min-w-[180px]">Tanggal & Waktu Keluar:</span>
            <span class="text-white font-medium text-right">{formatDateTime(letter.exit_date, letter.exit_time)}</span>
          </div>
          <div class="flex justify-between items-start border-b border-white/10 pb-2">
            <span class="font-semibold text-white/70 min-w-[180px]">Tanggal & Waktu Kembali:</span>
            <span class="text-white font-medium text-right">{formatDateTime(letter.return_date, letter.return_time)}</span>
          </div>
          <div class="flex justify-between items-start border-b border-white/10 pb-2">
            <span class="font-semibold text-white/70 min-w-[180px]">Tujuan:</span>
            <span class="text-white font-medium text-right">{letter.destination}</span>
          </div>
          <div class="flex justify-between items-start border-b border-white/10 pb-2">
            <span class="font-semibold text-white/70 min-w-[180px]">Keperluan:</span>
            <span class="text-white font-medium text-right">{letter.purpose}</span>
          </div>
          {#if letter.companions}
            <div class="flex justify-between items-start border-b border-white/10 pb-2">
              <span class="font-semibold text-white/70 min-w-[180px]">Dengan:</span>
              <span class="text-white font-medium text-right">{letter.companions}</span>
            </div>
          {/if}
        </div>
        
        <p>Saya berjanji akan kembali tepat waktu sesuai dengan yang telah disebutkan di atas. Saya juga berjanji akan menjaga diri dengan baik dan tidak melakukan hal-hal yang dapat merugikan atau mengecewakan Anda.</p>
        
        <p>Demikian surat izin ini saya buat dengan sebenar-benarnya. Atas perhatian dan izin yang diberikan, saya ucapkan terima kasih.</p>
      </div>
      
      <div class="grid grid-cols-2 gap-8 mt-12 pt-6 border-t border-white/10">
        <div class="text-center">
          <p class="text-white/90">Mengetahui,</p>
          <div class="w-full h-[1px] bg-white/20 my-16"></div>
          <div class="font-bold text-white">{letter.recipient_name}</div>
          <small class="text-white/60">(Yang Memberikan Izin)</small>
        </div>
        
        <div class="text-center">
          <p class="text-white/90">{currentDate}</p>
          <div class="w-full h-[1px] bg-white/20 my-16"></div>
          <div class="font-bold text-white">{letter.sender_name}</div>
          <small class="text-white/60">(Pemohon Izin)</small>
        </div>
      </div>
    </div>
  </div>
</div>
