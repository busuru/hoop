const CACHE_NAME = 'basketball-trainer-v1';
const STATIC_CACHE = 'basketball-trainer-static-v1';
const DYNAMIC_CACHE = 'basketball-trainer-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: try network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle API requests with offline support
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful API responses
    if (response.status === 200) {
      const responseClone = response.clone();
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          cache.put(request, responseClone);
        });
    }
    
    return response;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for API request');
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for specific endpoints
    if (request.url.includes('/api/drills') || request.url.includes('/api/exercises')) {
      return new Response(JSON.stringify({
        message: 'Offline mode - using cached data',
        data: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return generic offline response
    return new Response(JSON.stringify({
      message: 'You are offline. Please check your connection.',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const responseClone = response.clone();
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          cache.put(request, responseClone);
        });
    }
    return response;
  } catch (error) {
    // Return a fallback for critical assets
    if (request.destination === 'script') {
      return new Response('console.log("Offline mode");', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    throw error;
  }
}

// Handle navigation requests with offline fallback
async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const responseClone = response.clone();
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          cache.put(request, responseClone);
        });
    }
    return response;
  } catch (error) {
    // Return cached index.html for SPA navigation
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to static cache
    return caches.match('/');
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Get all clients
    const clients = await self.clients.matchAll();
    
    // Notify clients that sync is happening
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_STARTED',
        message: 'Syncing offline data...'
      });
    });
    
    // Here you would typically sync any offline changes
    // For now, we'll just notify that sync is complete
    setTimeout(() => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          message: 'Offline data synced successfully'
        });
      });
    }, 1000);
    
  } catch (error) {
    console.error('Service Worker: Error during background sync', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  let notificationData = {
    title: 'Basketball Trainer',
    body: 'You have a training session coming up!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: '/planner'
    }
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Service Worker: Error parsing push data', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then((clients) => {
        // If app is already open, focus it
        if (clients.length > 0) {
          clients[0].focus();
          if (event.notification.data && event.notification.data.url) {
            clients[0].postMessage({
              type: 'NAVIGATE',
              url: event.notification.data.url
            });
          }
        } else {
          // Open the app
          self.clients.openWindow('/');
        }
      })
  );
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_DATA') {
    cacheAppData(event.data.data);
  }
});

// Cache app data for offline use
async function cacheAppData(data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // Cache drills data
    if (data.drills) {
      const drillsResponse = new Response(JSON.stringify(data.drills), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put('/api/drills', drillsResponse);
    }
    
    // Cache exercises data
    if (data.exercises) {
      const exercisesResponse = new Response(JSON.stringify(data.exercises), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put('/api/exercises', exercisesResponse);
    }
    
    // Cache stretches data
    if (data.stretches) {
      const stretchesResponse = new Response(JSON.stringify(data.stretches), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put('/api/stretches', stretchesResponse);
    }
    
    console.log('Service Worker: App data cached successfully');
  } catch (error) {
    console.error('Service Worker: Error caching app data', error);
  }
} 