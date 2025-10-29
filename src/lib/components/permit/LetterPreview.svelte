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

<div class="mb-4">
  <div class="flex gap-2 mb-3">
    <button class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-[17px] font-semibold border-none rounded-[10px] cursor-pointer min-h-[50px] bg-white text-[#007AFF] transition-all active:opacity-70 active:scale-[0.98] shadow-[0_1px_3px_rgba(0,0,0,0.1)]" style="letter-spacing: -0.408px;" onclick={onEdit}>
      <i class="fas fa-pencil"></i>
      Edit
    </button>
    <button class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-[17px] font-semibold text-white border-none rounded-[10px] cursor-pointer min-h-[50px] bg-[#007AFF] transition-all active:opacity-80 active:scale-[0.98] shadow-sm" style="letter-spacing: -0.408px;" onclick={onPrint}>
      <i class="fas fa-print"></i>
      Print
    </button>
    <button class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-[17px] font-semibold text-white border-none rounded-[10px] cursor-pointer min-h-[50px] bg-[#34C759] transition-all active:opacity-80 active:scale-[0.98] shadow-sm" style="letter-spacing: -0.408px;" onclick={onSave}>
      <i class="fas fa-check"></i>
      Simpan
    </button>
  </div>

  <div class="bg-white rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]" id="letterContainer">
    <div>
      <div class="text-center mb-6 pb-4 border-b border-[#E5E5EA]">
        <div class="text-[22px] font-bold text-[#1C1C1E] mb-1" style="letter-spacing: -0.5px;">Surat Izin Keluar</div>
        <div class="text-[15px] text-[#8E8E93] italic" style="letter-spacing: -0.24px;">Kepada Yang Tercinta</div>
      </div>
      
      <div class="space-y-4 text-[#1C1C1E] leading-relaxed" style="font-size: 15px; letter-spacing: -0.24px;">
        <p>Kepada {letter.recipient_name} tersayang,</p>
        
        <p>Dengan hormat, melalui surat ini saya bermaksud untuk meminta izin keluar kepada Anda. Adapun rincian keperluan saya adalah sebagai berikut:</p>
        
        <div class="bg-[#F2F2F7] rounded-[10px] p-4 space-y-2.5 my-5">
          <div class="flex justify-between items-start border-b border-[#E5E5EA] pb-2">
            <span class="font-medium text-[#8E8E93] text-[13px]">Nama Pemohon:</span>
            <span class="text-[#1C1C1E] font-semibold text-right text-[15px]">{letter.sender_name}</span>
          </div>
          <div class="flex justify-between items-start border-b border-[#E5E5EA] pb-2">
            <span class="font-medium text-[#8E8E93] text-[13px]">Tanggal & Waktu Keluar:</span>
            <span class="text-[#1C1C1E] font-semibold text-right text-[15px]">{formatDateTime(letter.exit_date, letter.exit_time)}</span>
          </div>
          <div class="flex justify-between items-start border-b border-[#E5E5EA] pb-2">
            <span class="font-medium text-[#8E8E93] text-[13px]">Tanggal & Waktu Kembali:</span>
            <span class="text-[#1C1C1E] font-semibold text-right text-[15px]">{formatDateTime(letter.return_date, letter.return_time)}</span>
          </div>
          <div class="flex justify-between items-start border-b border-[#E5E5EA] pb-2">
            <span class="font-medium text-[#8E8E93] text-[13px]">Tujuan:</span>
            <span class="text-[#1C1C1E] font-semibold text-right text-[15px]">{letter.destination}</span>
          </div>
          <div class="flex justify-between items-start border-b border-[#E5E5EA] pb-2">
            <span class="font-medium text-[#8E8E93] text-[13px]">Keperluan:</span>
            <span class="text-[#1C1C1E] font-semibold text-right text-[15px]">{letter.purpose}</span>
          </div>
          {#if letter.companions}
            <div class="flex justify-between items-start border-b border-[#E5E5EA] pb-2">
              <span class="font-medium text-[#8E8E93] text-[13px]">Dengan:</span>
              <span class="text-[#1C1C1E] font-semibold text-right text-[15px]">{letter.companions}</span>
            </div>
          {/if}
        </div>
        
        <p>Saya berjanji akan kembali tepat waktu sesuai dengan yang telah disebutkan di atas. Saya juga berjanji akan menjaga diri dengan baik dan tidak melakukan hal-hal yang dapat merugikan atau mengecewakan Anda.</p>
        
        <p>Demikian surat izin ini saya buat dengan sebenar-benarnya. Atas perhatian dan izin yang diberikan, saya ucapkan terima kasih.</p>
      </div>
      
      <div class="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-[#E5E5EA]">
        <div class="text-center">
          <p class="text-[#8E8E93] text-[13px] mb-2">Mengetahui,</p>
          <div class="w-full h-[1px] bg-[#E5E5EA] my-12"></div>
          <div class="font-bold text-[#1C1C1E] text-[17px]">{letter.recipient_name}</div>
          <small class="text-[#8E8E93] text-[13px]">(Yang Memberikan Izin)</small>
        </div>
        
        <div class="text-center">
          <p class="text-[#8E8E93] text-[13px] mb-2">{currentDate}</p>
          <div class="w-full h-[1px] bg-[#E5E5EA] my-12"></div>
          <div class="font-bold text-[#1C1C1E] text-[17px]">{letter.sender_name}</div>
          <small class="text-[#8E8E93] text-[13px]">(Pemohon Izin)</small>
        </div>
      </div>
    </div>
  </div>
</div>
