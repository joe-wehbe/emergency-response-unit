import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

interface User {
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  studentId: string;
  major: string;
  bio: string;
  tags: string;
}

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})

export class CommunityPage implements OnInit {

  groupedUsers: { letter: string, users: User[] }[] = [];
  filteredGroupedUsers: { letter: string, users: User[] }[] = [];

  @ViewChild('modal') modal: IonModal | undefined;

  allUsers: any[] = [];
  users: User[] = [];

  selectedUser: any;
  constructor(private userService:UserService) {

  }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers(){
    this.userService.getAllUsers()
      .subscribe({
        next: (response) => {
          if(response && response.hasOwnProperty("users")){
            console.log("Fetched all users: ", response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            this.allUsers = [].concat.apply([], Object.values(parsedResponse['users']));

            //looping through allUsers and our goal is to move everything from allUsers to fill the info in interface
            this.allUsers.forEach(user =>{
              this.users.push({
                firstName: user.first_name, 
                lastName: user.last_name, 
                role: this.getRole(user.user_rank),
                phoneNumber: user.phone_number,
                studentId: user.student_id,
                major: user.major,
                bio: user.bio,
                tags: user.tags,
              })
            })
            this.groupUsers();
            this.filteredGroupedUsers = [...this.groupedUsers];
          }
          else{
            console.log("No users");
          }
        },
        error: (error) => {
          console.error("Error retrieving users:", error);
        }
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
        return '';
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

  openModal(user: any) {
    this.selectedUser = user;
    this.modal?.present();
  }
}
