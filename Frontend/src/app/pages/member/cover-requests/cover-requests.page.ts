import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-cover-requests',
  templateUrl: './cover-requests.page.html',
  styleUrls: ['./cover-requests.page.scss'],
})
export class CoverRequestsPage implements OnInit {
  coverRequests: any[] = [];
  coverRequestCount: any;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.getAllCoverRequests();
  }

  getAllCoverRequests() {
    this.isLoading = true;
    this.userService.getAllCoverRequests().subscribe({
      next: (response) => {
        if (response && response.hasOwnProperty('coverRequests')) {

          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.coverRequests = [].concat.apply(
            [],
            Object.values(parsedResponse['coverRequests'])
          );
          this.coverRequests.forEach((cover_request) => {
            cover_request.shift.time_start = this.formatTime(
              cover_request.shift.time_start
            );
            cover_request.shift.time_end = this.formatTime(
              cover_request.shift.time_end
            );
          });
        } else {
          console.log('No cover requests');
        }
      },
      error: (error) => {
        console.error('Error retrieving cover requests:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  async presentAlert(coverRequestId: number) {
    const alert = await this.alertController.create({
      header: 'Accept cover request',
      subHeader:
        'Failing to cover this member’s shift will affect their attendance!',
      cssClass: 'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Accept',
          cssClass: 'alert-button-ok-green',
          handler: async () => {
            this.userService.acceptCoverRequest(coverRequestId).subscribe({
              next: (response) => {
               
                this.ngOnInit();
              },
              error: (error) => {
                console.error('Error applying:', error);
              },
            });
            return true;
          },
        },
      ],
    });
    await alert.present();
  }
}
