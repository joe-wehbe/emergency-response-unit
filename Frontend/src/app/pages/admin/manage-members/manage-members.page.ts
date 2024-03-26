import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AdminService } from '../../../services/admin/admin.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';

interface User {
  id: number,
  firstName: string;
  lastName: string;
  role: string;
}

@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.page.html',
  styleUrls: ['./manage-members.page.scss'],
})

export class ManageMembersPage implements OnInit {

  users: User[] =  [ ];
  users_all : User[] = [];
  AllUsers : User[] = [];
  ongoing: User[] = [];
  admins: User[] = [];
  groupedUsers: { letter: string, users: User[] }[] = [];
  filteredGroupedUsers: { letter: string, users: User[] }[] = [];

  selectedFilter: string = '';

  @ViewChild('modal') modal: IonModal | undefined;

  constructor(private sharedService:SharedService, private http:HttpClient, private adminService:AdminService, private router:Router, public alertController: AlertController, private toastController:ToastController) {
    
  }

  ngOnInit() {
    this.adminService.get_eru_members().subscribe(response => {
      const usersArray = Object.values(response);


    this.users = usersArray.map(user => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      role: this.getRole(user.user_rank)
    }));
   
    this.AllUsers = this.users;
    this.groupUsers();
    this.filteredGroupedUsers = [...this.groupedUsers];

    });
    
  }

  getRole(roleNumber: number | string): string {
    switch (Number(roleNumber)) {
      case 1:case 5: 
        return 'Dispatcher';
      case 2:case 4:
        return 'Medic';
      case 3:
        return 'Admin';
      case 6:
        return 'Dispatcher & Medic';
       
      default:
        return 'Unknown';
    }
  }

  groupUsers() {
    this.users.sort((a, b) => a.firstName.localeCompare(b.firstName));
  
    const groups: any = {};
    this.users.forEach(user => {
      const firstLetter = user.firstName.charAt(0).toUpperCase();
      groups[firstLetter] = groups[firstLetter] || [];
      groups[firstLetter].push(user);
    });
  
    this.groupedUsers = Object.keys(groups).map(letter => ({
      letter,
      users: groups[letter]
    }));
  }

  handleInput(event: any) {
    const query = event.target.value.trim().toLowerCase();

    if (query === '') {
      this.filteredGroupedUsers = [...this.groupedUsers];
      return;
    }

    this.filteredGroupedUsers = this.groupedUsers.map(group => ({
      letter: group.letter,
      users: group.users.filter(user =>
        (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).includes(query)
      )
    })).filter(filteredGroup => filteredGroup.users.length > 0);
  }

  back(){
    this.router.navigate(["./admin-panel"])
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Add member',
      subHeader: 'Enter their LAU email, they will be able to login as an ERU member.',
      cssClass: "alert-dialog",
      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: 'Email...',
          cssClass: 'location-input',
          attributes: {
            required: true,
          },
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            return true;
          },
        },
        {
          text: 'Add',
          cssClass: 'alert-button-ok-green',
          handler: async (data) => {
            if (!data.email || !this.isValidEmail(data.email)) {
              const message = !data.email ? 'Email field cannot be empty' : 'Please enter a valid LAU email';
              const toast = await this.toastController.create({
                message: message,
                duration: 2000, 
                position: 'bottom'
              });
              toast.present();
            } else {
              this.handleAddMember(data.email);
            }
          },
        },
      ],
    });
    await alert.present();
  }
  
  async handleAddMember(email: string) {
    try {
      const response = await this.http.put<any>('http://localhost:8000/api/v0.1/admin/add-member', { lau_email: email }).toPromise();
      const message = response.message;
      const toast = await this.toastController.create({
        message: message,
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
      window.location.reload();
      
    } catch (error) {
      console.error('Error occurred while adding member:', error);
      const toast = await this.toastController.create({
        message: 'Failed to add member',
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@lau\.edu(?:\.lb)?$/;
    return emailRegex.test(email);
  }

  goToProfile(id : number){
    this.sharedService.setVariableValue(id);
    this.router.navigate(['/user-profile']);
  }

  applyFilter(filter: string) {
    this.selectedFilter = filter;
    if (filter === 'All members') {
      this.users = this.AllUsers;
      this.groupUsers();
      this.filteredGroupedUsers = [...this.groupedUsers];
    } else {
      this.filteredGroupedUsers = this.groupedUsers.map(group => ({
        letter: group.letter,
        users: group.users.filter(user => user.role === filter)
      })).filter(filteredGroup => filteredGroup.users.length > 0);
    }
  }

  getOngoing(){
    this.adminService.get_ongoing_shifts().subscribe(response => {
      if (response) {
        const ongoingUsersArray = Object.values(response).reduce((acc: any[], curr: any[]) => acc.concat(curr), []); 
        this.ongoing = ongoingUsersArray.map((user: { id: number, first_name: string, last_name: string, user_rank: string, profile_picture: any }) => ({ 
          id : user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          role: this.getRole(user.user_rank)
        }));

        
        this.users = this.ongoing; 
        this.groupUsers(); 
        this.filteredGroupedUsers = [...this.groupedUsers];
      }
    });

  }

  getAdmins(){
    this.adminService.get_admins().subscribe(response => {
      if (response) {
        const adminsArray = Object.values(response).reduce((acc: any[], curr: any[]) => acc.concat(curr), []); 
        this.admins = adminsArray.map((user: { id: number, first_name: string, last_name: string, user_rank: string, profile_picture: any }) => ({ 
          id : user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          role: this.getRole(user.user_rank)
        }));

        this.users = this.admins; 
        this.groupUsers(); 
        this.filteredGroupedUsers = [...this.groupedUsers];
      }
    });

  }

 
}
