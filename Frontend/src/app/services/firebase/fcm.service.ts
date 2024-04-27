import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';

export const FCM_TOKEN = 'push_notification_token';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private baseUrl:string = "http://10.0.2.2:8000/api/v0.1/fcm/";
  private fcmUrl:string = "https://fcm.googleapis.com/fcm/send";
  private serverKey:string = "AAAA2JYAb0s:APA91bFGsDePgAPQIpny5NcTRxhEEYOVAKFb9Gg14X7EqAwP_Yv7Orv2leUY03MFdbd5d_Wdz-ItALW95KURJJTfeUK_0Zi1v8Ojn-wpO5_N5wgxbgNLWdGaun8ONTAA4xjXVib2Z7at";
  private userId = localStorage.getItem("user_id");
  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }

  constructor(private http: HttpClient) { }

  /****************** PUSH NOTIFICATIONS IMPLEMENTATION ******************/

  // Initializes push notifications when the user logs in
  initializePushNotifications() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerToPushNotifications();
    }
  }

  // Requests permission from the user and registers for push notifications if permission is granted
  private async registerToPushNotifications() {
    try {
      await this.addListeners();
      let permissionStatus = await PushNotifications.checkPermissions();

      if (permissionStatus.receive === 'prompt') {
        permissionStatus = await PushNotifications.requestPermissions();
      }

      if (permissionStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    } catch (exception) {
      console.log(exception);
    }
  }

  // Listens to push notification events
  addListeners() {
    
    // Registration event: checks if incoming token != than saved token and updates the localstorage and database accordingly
    PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        console.log('My token: ', token);
        const fcmToken = token?.value;
        const savedToken = localStorage.getItem(FCM_TOKEN);

        if (fcmToken && savedToken !== JSON.stringify(fcmToken)) {
          localStorage.setItem(FCM_TOKEN, JSON.stringify(fcmToken));
          this.saveFcmToken(fcmToken);
        }
      }
    );

    // Registration error event: displays the registration error in the console
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error registering: ' + JSON.stringify(error));
    });

    // Notification receival event
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        const data = notification?.data;
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );

    // Performing action event
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        console.log('push data: ', data);
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  }

  // Saves a user's fcm token in the database
  private saveFcmToken(fcmToken: string) {
    this.http.put(this.baseUrl + "save-fcm-token", { id: this.userId, fcm_token: fcmToken })
    .subscribe({
      next: (response: any) => {
        console.log('FCM token saved successfully:', response);
      },
      error: (error: any) => {
        console.error('Error saving FCM token:', error);
      },
    });
  }

  /****************** APIs IMPLEMENTATION ******************/

  // report & report-emergency 
  notifyMedics(location: string, description: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'key=' + this.serverKey
    });

    this.http.get<{ medicsToken: string[] }>(this.baseUrl + "get-medics-fcm-tokens/" + this.userId)
    .subscribe({
      next: (response: any) => {
        const tokens: string[] = response.medicsToken;

        if (tokens.length > 0) {
          tokens.forEach(token => {
            const notificationPayload = {
              to: token,
              notification: {
                title: location,
                body: description,
                sound: "alarm1.mp3"
              }
            };
            this.http.post(this.fcmUrl, notificationPayload, { headers })
              .subscribe({
                next: (response: any) => {
                  console.log('Notification sent successfully to', token, ':', response);
                },
                error: (error: any) => {
                  console.error('Error sending notification to', token, ':', error);
                },
              });
          });
        } else {
          console.error('No valid tokens received');
        }        
      },
      error: (error: any) => {
        console.error('Error getting medic tokens:', error);
      },
    });
  }
}
