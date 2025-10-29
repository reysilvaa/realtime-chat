<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import type { User } from '$lib/types';
  import { letters, loadLetters, saveLetter, deleteLetter } from '$lib/stores/letters';
  import { showNotification } from '$lib/stores/notifications';
  import { getRecipientName } from '$lib/utils/userDetection';
  import { logDevInfo } from '$lib/utils/devTools';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  import LetterForm from '$lib/components/permit/LetterForm.svelte';
  import LetterPreview from '$lib/components/permit/LetterPreview.svelte';
  import LetterHistory from '$lib/components/permit/LetterHistory.svelte';
  import type { Letter } from '$lib/types';
  
  let user = $state<User | null>(detectUser());
  let recipientName = $state('');
  let showPreview = $state(false);
  let currentLetter = $state<Letter | null>(null);
  
  $effect(() => {
    if (!user) return;
    
    logDevInfo(user);
    recipientName = getRecipientName(user.userName);
    
    loadLetters().catch(error => {
      console.error('Error loading letters:', error);
    });
  });
  
  function handlePreview(letter: Letter) {
    currentLetter = letter;
    showPreview = true;
  }
  
  function handleSubmit(letter: Letter) {
    currentLetter = letter;
    showPreview = true;
  }
  
  function handleEdit() {
    showPreview = false;
  }
  
  function handlePrint() {
    window.print();
  }
  
  async function handleSave() {
    if (!currentLetter) return;
    
    try {
      await saveLetter(currentLetter);
      showNotification('Surat berhasil disimpan!', 'success');
    } catch (error) {
      console.error('Error saving letter:', error);
      showNotification('Gagal menyimpan surat', 'error');
    }
  }
  
  function handleLoadLetter(letter: Letter) {
    currentLetter = letter;
    showPreview = true;
  }
  
  async function handleDeleteLetter(id: number) {
    if (!confirm('Yakin ingin menghapus surat ini?')) return;
    
    try {
      await deleteLetter(id);
      showNotification('Surat berhasil dihapus', 'success');
    } catch (error) {
      console.error('Error deleting letter:', error);
      showNotification('Gagal menghapus surat', 'error');
    }
  }
</script>

<svelte:head>
  <title>Izin Keluar - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-[var(--bg-primary)]">
  <Header title="Izin Keluar" backLink="/" />
  
  <div class="flex-1 p-4 pt-[107px] pb-6 max-w-full mx-auto overflow-y-auto" style="-webkit-overflow-scrolling: touch;">
    {#if !showPreview}
      {#if user}
        <LetterForm 
          onPreview={handlePreview}
          onSubmit={handleSubmit}
          senderName={user.userName}
          {recipientName}
        />
      {/if}
    {:else if currentLetter}
      <LetterPreview 
        letter={currentLetter}
        onEdit={handleEdit}
        onPrint={handlePrint}
        onSave={handleSave}
      />
    {/if}
    
    <LetterHistory 
      letters={$letters}
      onLoad={handleLoadLetter}
      onDelete={handleDeleteLetter}
    />
  </div>
  
  <DevSelector />
</div>
