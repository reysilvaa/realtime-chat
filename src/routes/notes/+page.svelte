<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  
  detectUser();
  
  interface Note {
    id: number;
    title: string;
    content: string;
    date: Date;
  }
  
  let notes = $state<Note[]>([
    { id: 1, title: 'Welcome', content: 'This is your notes app. Create new notes to get started!', date: new Date() }
  ]);
  
  let selectedNote = $state<Note | null>(notes[0]);
  let showNewNote = $state(false);
  let newTitle = $state('');
  let newContent = $state('');
  
  function createNote() {
    if (newTitle.trim() && newContent.trim()) {
      const note: Note = {
        id: Date.now(),
        title: newTitle,
        content: newContent,
        date: new Date()
      };
      notes = [note, ...notes];
      selectedNote = note;
      showNewNote = false;
      newTitle = '';
      newContent = '';
    }
  }
  
  function deleteNote(id: number) {
    notes = notes.filter(n => n.id !== id);
    selectedNote = notes[0] || null;
  }
</script>

<svelte:head>
  <title>Notes - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-[var(--bg-primary)]">
  <Header title="Notes" backLink="/" />
  
  <div class="flex-1 pt-[107px] pb-4 max-w-full mx-auto overflow-y-auto" style="-webkit-overflow-scrolling: touch;">
    <div class="p-4 space-y-4 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <!-- New Note Button -->
      <button 
        onclick={() => showNewNote = !showNewNote}
        class="w-full py-3 bg-[#007AFF] text-white rounded-[14px] font-semibold transition-all active:opacity-60 flex items-center justify-center gap-2"
      >
        <i class="fas fa-plus"></i>
        New Note
      </button>
      
      <!-- New Note Form -->
      {#if showNewNote}
        <div class="bg-[var(--card-bg)] rounded-[12px] p-5 border border-[var(--border-primary)] shadow-[var(--shadow-sm)]">
          <input 
            type="text" 
            bind:value={newTitle}
            placeholder="Note Title..."
            class="w-full px-4 py-3 mb-3 rounded-[12px] bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--input-focus-border)]"
          />
          <textarea 
            bind:value={newContent}
            placeholder="Start typing..."
            rows="6"
            class="w-full px-4 py-3 mb-3 rounded-[12px] bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--input-focus-border)] resize-none"
          ></textarea>
          <div class="flex gap-2">
            <button 
              onclick={createNote}
              class="flex-1 py-3 bg-[#34C759] text-white rounded-[14px] font-semibold transition-all active:opacity-60"
            >
              Save
            </button>
            <button 
              onclick={() => { showNewNote = false; newTitle = ''; newContent = ''; }}
              class="flex-1 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-[14px] font-semibold transition-all active:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      {/if}
      
      <!-- Notes List -->
      {#each notes as note (note.id)}
        <div class="bg-[var(--card-bg)] rounded-[12px] p-5 border border-[var(--border-primary)] shadow-[var(--shadow-sm)] transition-all">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-bold text-[var(--text-primary)]">{note.title}</h3>
            <button 
              onclick={() => deleteNote(note.id)}
              class="text-[#FF3B30] transition-opacity active:opacity-60"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <p class="text-[var(--text-primary)] mb-2 whitespace-pre-wrap opacity-90">{note.content}</p>
          <div class="text-xs text-[var(--text-secondary)]">
            {note.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <DevSelector />
</div>
