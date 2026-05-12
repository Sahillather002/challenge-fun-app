// Sound effects service
// This is a simplified version for the demo

interface SoundConfig {
  enabled: boolean;
  volume: number;
}

class SoundEffectsManager {
  private config: SoundConfig = {
    enabled: true,
    volume: 0.5,
  };

  constructor() {
    // In a real app, you would initialize a sound library like Expo AV
    // For this demo, we'll just log when sounds should be played
  }

  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
  }

  setVolume(volume: number) {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }

  playSound(type: 'click' | 'success' | 'warning' | 'error' | 'notification') {
    if (!this.config.enabled) {
      return;
    }

    // In a real app, you would use a sound library like Expo AV
    // For this demo, we'll just log to the console
    
    const sounds = {
      click: { name: 'Click', duration: 100 },
      success: { name: 'Success', duration: 300 },
      warning: { name: 'Warning', duration: 400 },
      error: { name: 'Error', duration: 500 },
      notification: { name: 'Notification', duration: 250 },
    };

    const sound = sounds[type];
    console.log(`Playing sound: ${sound.name} (${sound.duration}ms)`);
    
    // In a real app, you might play a small beep or click sound
    // using a library like react-native-sound or expo-av
  }

  playClick() {
    this.playSound('click');
  }

  playSuccess() {
    this.playSound('success');
  }

  playWarning() {
    this.playSound('warning');
  }

  playError() {
    this.playSound('error');
  }

  playNotification() {
    this.playSound('notification');
  }
}

export const soundEffects = new SoundEffectsManager();
