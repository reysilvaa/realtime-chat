<script lang="ts">
  import { detectUser } from '$lib/utils/userDetection';
  import type { User } from '$lib/types';
  import { 
    messages, 
    loadMessages, 
    sendMessage, 
    subscribeToMessages, 
    unsubscribeFromMessages,
    connectionStatus,
    markMessagesAsRead
  } from '$lib/stores/messages';
  import { showNotification } from '$lib/stores/notifications';
  import { getRecipientName } from '$lib/utils/userDetection';
  import { logDevInfo } from '$lib/utils/devTools';
  import Header from '$lib/components/shared/Header.svelte';
  import DevSelector from '$lib/components/shared/DevSelector.svelte';
  import MessageList from '$lib/components/chat/MessageList.svelte';
  import MessageInput from '$lib/components/chat/MessageInput.svelte';
  
  let user = $state<User | null>(detectUser());
  let recipientName = $state('');
  let messagesContainer = $state<HTMLDivElement | undefined>();
  
  $effect(() => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
  
  $effect(() => {
    if (!user) return;
    
    (async () => {
      try {
        logDevInfo(user);
        recipientName = getRecipientName(user.userName);
        
        await loadMessages();
        subscribeToMessages(user.userName);
        await markMessagesAsRead(user.userName);
        
        connectionStatus.set('connected');
      } catch (error) {
        console.error('Error initializing chat:', error);
        showNotification('Gagal terhubung ke server', 'error');
        connectionStatus.set('error');
      }
    })();
    
    return () => {
      unsubscribeFromMessages();
    };
  });
  
  async function handleSendMessage(messageText: string) {
    if (!user) return;
    await sendMessage(messageText, user.userName);
  }
</script>

<svelte:head>
  <title>Chat - ReyNisa App</title>
</svelte:head>

<div class="min-h-full h-full flex flex-col bg-[var(--bg-primary)]">
  <Header 
    title={recipientName} 
    backLink="/" 
    showStatus={true}
    status={$connectionStatus}
  />
  
  <div 
    class="flex-1 overflow-y-auto px-4 animate-[fade-in_0.4s_cubic-bezier(0.4,0,0.2,1)]"
    style="padding-top: calc(91px + 16px); padding-bottom: calc(80px + 16px); -webkit-overflow-scrolling: touch;"
    bind:this={messagesContainer}
  >
    {#if user}
      <MessageList currentUserName={user.userName} />
    {/if}
  </div>
  
  <MessageInput onSend={handleSendMessage} />
  
  <DevSelector />
</div>
