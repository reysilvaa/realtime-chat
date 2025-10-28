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

<div class="min-h-full h-full flex flex-col bg-black">
  <Header title="Notes" backLink="/" />
  
  <div class="flex-1 pt-[107px] pb-4 max-w-full mx-auto bg-black overflow-y-auto" style="-webkit-overflow-scrolling: touch;">
    <div class="p-4 space-y-4 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
      <!-- New Note Button -->
      <button 
        onclick={() => showNewNote = !showNewNote}
        class="w-full py-3 bg-[#0A84FF] text-white rounded-[14px] font-semibold transition-all active:opacity-60 flex items-center justify-center gap-2"
      >
        <i class="fas fa-plus"></i>
        New Note
      </button>
      
      <!-- New Note Form -->
      {#if showNewNote}
        <div class="bg-white/10 backdrop-blur-xl rounded-[20px] p-5 border border-white/10">
          <input 
            type="text" 
            bind:value={newTitle}
            placeholder="Note Title..."
            class="w-full px-4 py-3 mb-3 rounded-[12px] bg-black/30 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-[#0A84FF]"
          />
          <textarea 
            bind:value={newContent}
            placeholder="Start typing..."
            rows="6"
            class="w-full px-4 py-3 mb-3 rounded-[12px] bg-black/30 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-[#0A84FF] resize-none"
          ></textarea>
          <div class="flex gap-2">
            <button 
              onclick={createNote}
              class="flex-1 py-3 bg-[#30D158] text-white rounded-[14px] font-semibold transition-all active:opacity-60"
            >
              Save
            </button>
            <button 
              onclick={() => { showNewNote = false; newTitle = ''; newContent = ''; }}
              class="flex-1 py-3 bg-white/10 text-white rounded-[14px] font-semibold transition-all active:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      {/if}
      
      <!-- Notes List -->
      {#each notes as note (note.id)}
        <div class="bg-white/10 backdrop-blur-xl rounded-[20px] p-5 border border-white/10 transition-all hover:bg-white/15">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-bold text-white">{note.title}</h3>
            <button 
              onclick={() => deleteNote(note.id)}
              class="text-red-400 hover:text-red-300 transition-colors"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <p class="text-white/80 mb-2 whitespace-pre-wrap">{note.content}</p>
          <div class="text-xs text-white/50">
            {note.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <DevSelector />
</div>
