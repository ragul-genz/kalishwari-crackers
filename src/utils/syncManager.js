// Real-time Cross-Tab & Same-Tab Event Sync Manager

const BROADCAST_CHANNEL_NAME = 'kalishwari_live_sync_channel';

let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not available:', e);
  }
}

/**
 * Dispatch a sync event both locally in current tab and across all open tabs
 */
export const notifyDataSync = (eventName, dataKey = null) => {
  if (typeof window === 'undefined') return;

  // 1. Dispatch locally in current window/tab
  window.dispatchEvent(new CustomEvent(eventName, { detail: { dataKey, timestamp: Date.now() } }));

  // 2. Broadcast to other open tabs via BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ eventName, dataKey, timestamp: Date.now() });
    } catch (e) {
      console.error('Error posting to BroadcastChannel:', e);
    }
  }
};

/**
 * Global initialization for cross-tab event bridge
 */
export const initGlobalRealtimeSync = () => {
  if (typeof window === 'undefined') return;

  // Listen to BroadcastChannel messages from other tabs
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.eventName) {
        window.dispatchEvent(new CustomEvent(event.data.eventName, { detail: event.data }));
      }
    };
  }

  // Listen to native browser window 'storage' events from other tabs
  window.addEventListener('storage', (e) => {
    if (!e.key) return;

    if (e.key === 'kalishwari_products_db' || e.key === 'kalishwari_categories_db' || e.key === 'kalishwari_deleted_categories_db') {
      window.dispatchEvent(new CustomEvent('productsUpdated'));
    } else if (e.key === 'kalishwari_stored_offers') {
      window.dispatchEvent(new CustomEvent('offersUpdated'));
    } else if (e.key === 'kalishwari_blogs_db') {
      window.dispatchEvent(new CustomEvent('blogsUpdated'));
    } else if (e.key === 'kalishwari_site_settings_v2') {
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
    }
  });

  // Listen to window focus / visibility changes for immediate catch-up
  window.addEventListener('focus', () => {
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    window.dispatchEvent(new CustomEvent('offersUpdated'));
    window.dispatchEvent(new CustomEvent('blogsUpdated'));
    window.dispatchEvent(new CustomEvent('settingsUpdated'));
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      window.dispatchEvent(new CustomEvent('productsUpdated'));
      window.dispatchEvent(new CustomEvent('offersUpdated'));
      window.dispatchEvent(new CustomEvent('blogsUpdated'));
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
    }
  });
};

// Initialize bridge immediately upon import
initGlobalRealtimeSync();
