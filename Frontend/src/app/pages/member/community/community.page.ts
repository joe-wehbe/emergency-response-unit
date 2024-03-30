import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

interface User {
  firstName: string;
  lastName: string;
  role: string;
}

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  users: User[] = [
    { firstName: 'Alice', lastName: 'Johnson', role: 'Medic' },
    { firstName: 'Alice', lastName: 'Johnson', role: 'Medic' },
    { firstName: 'Alice', lastName: 'Johnson', role: 'Medic' },
    { firstName: 'Bob', lastName: 'Smith', role: 'Board' },
    { firstName: 'Bob', lastName: 'Smith', role: 'Board' },
    { firstName: 'Joe', lastName: 'Smith', role: 'Board' },
    { firstName: 'Joe', lastName: 'Smith', role: 'Board' },
    { firstName: 'Joe', lastName: 'Smith', role: 'Board' },
  ];

  groupedUsers: { letter: string, users: User[] }[] = [];
  filteredGroupedUsers: { letter: string, users: User[] }[] = [];

  @ViewChild('modal') modal: IonModal | undefined;

  constructor(private userService:UserService) {
    this.groupUsers();
    this.filteredGroupedUsers = [...this.groupedUsers];
  }

  ngOnInit() {
  }

  getAllUsers(){
    this.userService.getAllUsers()
      .subscribe({
        next: (response) => {
          if(response && response.hasOwnProperty("users")){
            console.log("Fetched all users: ", response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            // this.ongoingEmergencies = [].concat.apply([], Object.values(parsedResponse['emergencies']));
          }
          else{
            console.log("No ongoing emergencies");
          }
        },
        error: (error) => {
          console.error("Error retrieving ongoing emergencies:", error);
        }
      });
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

  openModal() {
    this.modal?.present();
  }
}
