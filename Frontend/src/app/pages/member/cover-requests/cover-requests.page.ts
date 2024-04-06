import { Component, OnInit } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-cover-requests',
  templateUrl: './cover-requests.page.html',
  styleUrls: ['./cover-requests.page.scss'],
})
export class CoverRequestsPage implements OnInit {

  coverRequests: any[] = [];

  constructor(private userService: UserService, private alertController: AlertController) { }

  ngOnInit() {
    this.getAllCoverRequests();
  }

  getAllCoverRequests(){
    this.userService.getAllCoverRequests()
    .subscribe({
      next: (response) => {
        if(response && response.hasOwnProperty("coverRequests")){
          console.log("Fetched all cover requests: ", response);
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.coverRequests = [].concat.apply([], Object.values(parsedResponse['coverRequests']));
          // Convert time format for display
          this.coverRequests.forEach(cover_request => {
            cover_request.shift.time_start = this.formatTime(cover_request.shift.time_start);
            cover_request.shift.time_end = this.formatTime(cover_request.shift.time_end);
          });
        }
        else{
          console.log("No cover requests");
        }
      },
      error: (error) => {
        console.error("Error retrieving cover requests:", error);
      }
    });
  }

  formatTime(time: string): string {
    // Split the time string by ":" and get the hour and minute parts
    const [hours, minutes] = time.split(':');
    // Return formatted time in "HH:mm" format
    return `${hours}:${minutes}`;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Accept cover request',
      subHeader: 'Failing to cover this member’s shift will affect their attendance!',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Accept',
          cssClass: 'alert-button-ok-green'
        },
      ],
    });
    await alert.present();
  }
}
