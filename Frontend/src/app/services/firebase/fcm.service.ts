import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { BehaviorSubject, forkJoin } from 'rxjs';

export const FCM_TOKEN = 'push_notification_token';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private baseUrl:string = "http://10.0.2.2:8000/api/v0.1/fcm/";
  private fcmUrl:string = "https://fcm.googleapis.com/fcm/send";
  private serverKey:string = "AAAA2JYAb0s:APA91bFGsDePgAPQIpny5NcTRxhEEYOVAKFb9Gg14X7EqAwP_Yv7Orv2leUY03MFdbd5d_Wdz-ItALW95KURJJTfeUK_0Zi1v8Ojn-wpO5_N5wgxbgNLWdGaun8ONTAA4xjXVib2Z7at";
  private userId = localStorage.getItem("user_id");

  constructor(private http: HttpClient) {}

  /****************** PUSH NOTIFICATIONS IMPLEMENTATION ******************/

  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }

  initializePushNotifications() {
    if(Capacitor.getPlatform() !== 'web') {
      this.registerPush();
      // this.getDeliveredNotifications();
    }
  }

  private async registerPush() {
    try {
      await this.addListeners();
      let permStatus = await PushNotifications.checkPermissions();
  
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
  
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }
  
      await PushNotifications.register();
    } catch(e) {
      console.log(e);
    }
  }
  
  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }
  
  addListeners() {
    PushNotifications.addListener(
      'registration',
      async(token: Token) => {
        console.log('My token: ', token);
        const fcm_token = token?.value;
        let go = 1;
        const saved_token = JSON.parse(localStorage.getItem('FCM_TOKEN') || 'null');
        if(saved_token) {
          if(fcm_token == saved_token) {
            console.log('same token');
            go = 0;
          } else {
            go = 2;
          }
        }
        if(go == 1) {
          // save token
          localStorage.setItem('FCM_TOKEN', JSON.stringify(fcm_token));
          this.saveFcmToken(JSON.stringify(fcm_token));
        } else if(go == 2) {
          // update token
          const data = {
            expired_token: saved_token,
            refreshed_token: fcm_token
          };
          localStorage.setItem('FCM_TOKEN', JSON.stringify(fcm_token));
          this.saveFcmToken(JSON.stringify(fcm_token));
        }
      }
    );
  
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
  
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        const data = notification?.data;
        if(data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        console.log('push data: ', data);
        if(data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  }
  
  async removeFcmToken() {
    try {
      const saved_token = JSON.parse(localStorage.getItem('FCM_TOKEN') || 'null');
      localStorage.removeItem('FCM_TOKEN');
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }
  

  /****************** APIs IMPLEMENTATION ******************/

  private saveFcmToken(fcmToken: string) {
    this.http.put(this.baseUrl + "save-fcm-token", { id: localStorage.getItem("user_id"), fcm_token: fcmToken })
    .subscribe({
      next: (response: any) => {
        console.log('FCM token saved successfully:', response);
      },
      error: (error: any) => {
        console.error('Error saving FCM token:', error);
      },
    });
  }

  notifyFirstResponders(location: string, description: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'key=' + this.serverKey
    }); 
    forkJoin([
      this.http.get<{ medicsTokens: string[] }>(this.baseUrl + "get-medics-fcm-tokens/" + this.userId),
      this.http.get<{ onShiftTokens: string[] }>(this.baseUrl + "get-on-shift-fcm-tokens/" + this.userId)
    ]).subscribe({
      next: ([medicsResponse, onShiftResponse]: [any, any]) => {
        const medicsTokens: string[] = medicsResponse?.medicsTokens || [];
        const onShiftTokens: string[] = onShiftResponse.onShiftTokens;
        const allTokens: string[] = [...medicsTokens, ...onShiftTokens];
  
        if (allTokens.length > 0) {
          allTokens.forEach(token => {
            if (token != null){
              const notificationPayload = {
                to: token,
                notification: {
                  title: "Emergency Alert",
                  body: location + ': ' + description,
                  sound: "alarm1.mp3"
                },
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
            }
          });
        } else {
          console.error('No valid tokens received');
        }        
      },
      error: (error: any) => {
        console.error('Error getting tokens:', error);
      },
    });
  }

  notifyAnnouncementReceivers(firstName:string, lastName:string, importance: string, description: string, visibility: number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'key=' + this.serverKey
    }); 

    if(importance == "Very important"){
      if(visibility == 1 || visibility == 5){
        forkJoin([
          this.http.get<{ dispatchersTokens: string[] }>(this.baseUrl + "get-dispatchers-fcm-tokens/" + this.userId),
          this.http.get<{ adminsTokens: string[] }>(this.baseUrl + "get-admins-fcm-tokens/" + this.userId)
        ]).subscribe({
          next: ([dispatchersResponse, adminsResponse]: [any, any]) => {
            const dispatchersTokens: string[] = dispatchersResponse?.dispatchersTokens || [];
            const adminsTokens: string[] = adminsResponse?.adminsTokens || [];
            const allTokens: string[] = [...dispatchersTokens, ...adminsTokens];
            const allUniqueTokens: string[] = Array.from(new Set(allTokens));
  
            if (allUniqueTokens.length > 0) {
              allUniqueTokens.forEach(token => {
                if (token != null){
                  const notificationPayload = {
                    to: token,
                    notification: {
                      title: "New Announcement",
                      body: firstName + ' ' + lastName + ': ' + description
                    },
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
                }
              });
            } else {
              console.error('No valid tokens received');
            }        
          },
          error: (error: any) => {
            console.error('Error getting tokens:', error);
          },
        });
      }
  
      if(visibility == 2 || visibility == 4){
        forkJoin([
          this.http.get<{ medicsTokens: string[] }>(this.baseUrl + "get-medics-fcm-tokens/" + this.userId),
          this.http.get<{ adminsTokens: string[] }>(this.baseUrl + "get-admins-fcm-tokens/" + this.userId)
        ]).subscribe({
          next: ([medicsResponse, adminsResponse]: [any, any]) => {
            const medicsTokens: string[] = medicsResponse?.medicsTokens || [];
            const adminsTokens: string[] = adminsResponse?.adminsTokens || [];
            const allTokens: string[] = [...medicsTokens, ...adminsTokens];
            const allUniqueTokens: string[] = Array.from(new Set(allTokens));
  
            if (allUniqueTokens.length > 0) {
              allUniqueTokens.forEach(token => {
                if (token != null){
                  const notificationPayload = {
                    to: token,
                    notification: {
                      title: "New Announcement",
                      body: firstName + ' ' + lastName + ':' + description
                    },
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
                }
              });
            } else {
              console.error('No valid tokens received');
            }        
          },
          error: (error: any) => {
            console.error('Error getting tokens:', error);
          },
        });
      }
  
      if (visibility == 3) {
        this.http.get<{ adminsTokens: string[] }>(this.baseUrl + "get-admins-fcm-tokens/" + this.userId)
        .subscribe({
          next: (response: { adminsTokens: string[] }) => {
            const adminsTokens: string[] = response?.adminsTokens || [];
    
            if (adminsTokens.length > 0) {
              adminsTokens.forEach(token => {
                if (token != null) {
                  const notificationPayload = {
                    to: token,
                    notification: {
                      title: "New Announcement",
                      body: firstName + ' ' + lastName + ':' + description
                    },
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
                }
              });
            } else {
              console.error('No valid tokens received');
            }
          },
          error: (error) => {
            console.error('Error getting tokens:', error);
          },
        });
      }
      
      if(visibility == 6 || visibility == 0){
        this.http.get<{ tokens: string[] }>(this.baseUrl + "get-all-fcm-tokens/" + this.userId)
        .subscribe({
          next: (response: { tokens: string[] }) => {
            const tokens: string[] = response?.tokens || [];
    
            if (tokens.length > 0) {
              tokens.forEach(token => {
                if (token != null) {
                  const notificationPayload = {
                    to: token,
                    notification: {
                      title: "New Announcement",
                      body: firstName + ' ' + lastName + ':' + description
                    },
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
                }
              });
            } else {
              console.error('No valid tokens received');
            }
          },
          error: (error) => {
            console.error('Error getting tokens:', error);
          },
        });
      }
    }
  }

  notifyForCoverRequest(firstName: string, lastName: string, startTime: string, endTime: string, day: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'key=' + this.serverKey
    });
    this.http.get<{ tokens: string[] }>(this.baseUrl + "get-all-fcm-tokens/" + this.userId)
    .subscribe({
      next: (response: { tokens: string[] }) => {
        const tokens: string[] = response?.tokens || [];

        if (tokens.length > 0) {
          tokens.forEach(token => {
            if (token != null) {
              const notificationPayload = {
                to: token,
                notification: {
                  title: firstName + ' ' + lastName + " requested cover",
                  body: day + ' from ' + startTime + ' to ' + endTime
                },
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
            }
          });
        } else {
          console.error('No valid tokens received');
        }
      },
      error: (error) => {
        console.error('Error getting tokens:', error);
      },
    });
  }
  
  notifyForRegistrationRequest(firstName: string, lastName: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'key=' + this.serverKey
    }); 

    this.http.get<{ adminsTokens: string[] }>(this.baseUrl + "get-admins-fcm-tokens/" + this.userId)
    .subscribe({
      next: (response: { adminsTokens: string[] }) => {
        const adminsTokens: string[] = response?.adminsTokens || [];

        if (adminsTokens.length > 0) {
          adminsTokens.forEach(token => {
            if (token != null) {
              const notificationPayload = {
                to: token,
                notification: {
                  title: "New Application",
                  body: firstName + ' ' + lastName + " would like to join the unit",
                },
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
            }
          });
        } else {
          console.error('No valid tokens received');
        }
      },
      error: (error) => {
        console.error('Error getting tokens:', error);
      },
    });
  }
}
