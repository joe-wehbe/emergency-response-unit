import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { DatePipe } from '@angular/common'; 
import { IonModal } from '@ionic/angular';


@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
})
export class AnnouncementsPage implements OnInit {
@ViewChild('modal') modal: IonModal | undefined;
  announcements: any[] = [];

  constructor(
    private userService: UserService,
    private datePipe: DatePipe 
  ) {}
  ngOnInit() {
    this.getAllAnnouncements();
  }

  getAllAnnouncements(){
    this.userService.getAllAnnouncements()
      .subscribe({
        next: (response) => {
          if(response && response.hasOwnProperty("announcements")){
            console.log("Fetched all announcements: ", response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            this.announcements = [].concat.apply([], Object.values(parsedResponse['announcements']));
          }
          else{
            console.log("No announcements");
          }
        },
        error: (error) => {
          console.error("Error retrieving announcements:", error);
        }
      });
  }

  truncateDescription(description: string, limit: number): string {
    if (description.length > limit) {
      return description.slice(0, limit) + '...';
    } else {
      return description;
    }
  }

  formatDate(created_at: string): string {
    const currentDate = new Date();
    const postDate = new Date(created_at);

    const difference = currentDate.getTime() - postDate.getTime();
    const minutesDifference = Math.round(difference / (1000 * 60));
    const secondsDifference = Math.round(difference / 1000);

    if (secondsDifference < 60) {
      return secondsDifference === 1 ? '1 second ago' : `${secondsDifference} seconds ago`;
    }

    if (minutesDifference < 60) {
      return minutesDifference === 1 ? '1 minute ago' : `${minutesDifference} minutes ago`;
    }

    const hoursDifference = Math.round(minutesDifference / 60);

    if (hoursDifference < 24) {
      return hoursDifference === 1 ? '1 hour ago' : `${hoursDifference} hours ago`;
    }

    const daysDifference = Math.round(hoursDifference / 24);
    return daysDifference === 1 ? '1 day ago' : `${daysDifference} days ago`;
  }

  openModal(id: number){
    this.modal?.present();
  }

}
