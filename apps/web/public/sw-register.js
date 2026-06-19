if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[FitBattle] Service Worker registered:', registration.scope);
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('[FitBattle] New service worker found');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[FitBattle] New content available, please refresh');
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.log('[FitBattle] Service Worker registration failed:', error);
      });
  });
}

function showUpdateNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('FitBattle Update Available', {
      body: 'A new version of FitBattle is available. Refresh to update.',
      icon: '/icons/icon-192x192.png'
    });
  }
}

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission().then((permission) => {
    console.log('[FitBattle] Notification permission:', permission);
  });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[FitBattle] Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

window.addEventListener('appinstalled', () => {
  console.log('[FitBattle] App installed successfully');
  deferredPrompt = null;
});

function showInstallButton() {
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[FitBattle] User choice:', outcome);
        deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });
  }
}
