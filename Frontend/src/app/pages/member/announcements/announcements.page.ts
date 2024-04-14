import { Component, OnInit, ViewChild} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
})
export class AnnouncementsPage implements OnInit {

  userId = localStorage.getItem("user_id");
  userRank = localStorage.getItem('rank');
  announcements: any[] = [];
  visibleAnnouncements: any[] = [];
  selectedAnnouncement: any;

  @ViewChild('modal') modal: IonModal | undefined;
  constructor(private userService: UserService) {}

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

          // Admins can always see all announcements
          this.announcements.forEach(announcement =>{
             // Announcement to (Dipatcher) or (Dispatcher & Admin), not visible to (Medic)
            if((announcement.visible_to == 1 || announcement.visible_to == 5) && this.userRank != 'Medic'){
              this.visibleAnnouncements.push(announcement);
            }
            // Announcement to (Medic) or (Medic & Admin), not visible to (Dispatcher)
            if((announcement.visible_to == 2 || announcement.visible_to == 4) && this.userRank != 'Dispatcher'){
              this.visibleAnnouncements.push(announcement);
            }
            // Announcement to (Admin), visible only to (Admin) and (Medic & Admin) and (Dispatcher & Admin) 
            if(announcement.visible_to == 3 && (this.userRank == 'Admin' || this.userRank == 'Medic & Admin' || this.userRank == 'Dispatcher & Admin')){
              this.visibleAnnouncements.push(announcement);
            }
            // Announcement to (Dispatcher & Medic) or to everyone, visible to everyone
            if(announcement.visible_to == 6 || announcement.visible_to == 0){
              this.visibleAnnouncements.push(announcement);
            }
          })
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
    const hoursDifference = Math.round(minutesDifference / 60);

    if (secondsDifference < 60) {
      return secondsDifference === 1 ? '1 second ago' : `${secondsDifference} seconds ago`;
    }
    if (minutesDifference < 60) {
      return minutesDifference === 1 ? '1 minute ago' : `${minutesDifference} minutes ago`;
    }
    if (hoursDifference < 24) {
      return hoursDifference === 1 ? '1 hour ago' : `${hoursDifference} hours ago`;
    }
    const daysDifference = Math.round(hoursDifference / 24);
    return daysDifference === 1 ? '1 day ago' : `${daysDifference} days ago`;
  }

  openModal(announcement: any){
    this.selectedAnnouncement = announcement;
    this.modal?.present();
  }
}
