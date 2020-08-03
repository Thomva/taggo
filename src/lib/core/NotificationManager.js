/**
 * Notification Manager
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

export default class NotificationManager {
  constructor() {
    Notification.requestPermission();
  }

  async notifyUser(message, vibPattern = null, tag) {
    try {
      if (window.Notification) {
        await Notification.requestPermission();
        if (Notification.permission === 'granted') {
          try {
            const SWRegistration = await navigator.serviceWorker.ready;
            if (vibPattern) {
              SWRegistration.showNotification(message, {
                tag,
                renotify: true,
                vibrate: vibPattern,
              });
            } else {
              SWRegistration.showNotification(message, {
                tag,
                renotify: true,
              });
            }
          } catch (error2) {
            console.log(`Error making notification via SW: ${error2}`);
          }
        }
      }
    } catch (error) {
      console.log(`Error making notification: ${error}`);
    }
  }
}
