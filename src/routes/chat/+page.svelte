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

<div class="app-container">
  <Header 
    title={recipientName} 
    backLink="/" 
    showStatus={true}
    status={$connectionStatus}
  />
  
  <div class="messages-container fade-in" bind:this={messagesContainer}>
    {#if user}
      <MessageList currentUserName={user.userName} />
    {/if}
  </div>
  
  <MessageInput onSend={handleSendMessage} />
  
  <DevSelector />
</div>
