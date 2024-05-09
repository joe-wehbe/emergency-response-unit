import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

interface User {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
  studentId: string;
  major: string;
  profilePicture: string;
  bio: string;
  tags: string;
  hasShift: boolean;
}

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {

  allUsers: any[] = [];
  users: User[] = [];
  groupedUsers: { letter: string, users: User[] }[] = [];
  filteredGroupedUsers: { letter: string, users: User[] }[] = [];
  selectedUser: any;
  selectedFilter: string = '';
  placeholder: string = '';
  isLoading: boolean = false;

  @ViewChild('modal') modal: IonModal | undefined;
  constructor(private userService:UserService) {}

  ngOnInit() {
    this.getAllMembers();
    this.updatePlaceholder();
  }

  getAllMembers(){
    this.isLoading = true;
    this.userService.getAllMembers()
    .subscribe({
      next: (response) => {
        if(response && response.hasOwnProperty("users")){
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.allUsers = [].concat.apply([], Object.values(parsedResponse['users']));

          this.allUsers.forEach(user =>{
            this.users.push({
              firstName: user.first_name, 
              lastName: user.last_name, 
              role: user.rank.rank_name,
              email: user.lau_email,
              phoneNumber: user.phone_number,
              studentId: user.student_id,
              major: user.major,
              profilePicture: user.profile_picture,
              bio: user.bio,
              tags: user.tags,
              hasShift: user.has_shift
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
      },
      complete: () => {
        this.isLoading = false;
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
      if(this.selectedFilter){
        this.applyFilter(this.selectedFilter);
      }
      else{
        this.filteredGroupedUsers = [...this.groupedUsers];
      }
      return;
    }
    this.filteredGroupedUsers = this.filteredGroupedUsers.map(group => ({
      letter: group.letter,
      users: group.users.filter(user =>
        (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).includes(query)
      )
    })).filter(filteredGroup => filteredGroup.users.length > 0);
  } 
  
  applyFilter(filter: string) {
    this.selectedFilter = filter;
    if (filter === 'All members') {
      this.filteredGroupedUsers = [...this.groupedUsers];
    } else if (filter === 'On shift') {
      this.filteredGroupedUsers = [{
        letter: 'On Shift',
        users: this.users.filter(user => user.hasShift === true)
      }];
    } else {
      this.filteredGroupedUsers = this.groupedUsers.map(group => ({
        letter: group.letter,
        users: group.users.filter(user => {
          return user.role.split('&').map(role => role.trim()).includes(filter);
        })
      })).filter(filteredGroup => filteredGroup.users.length > 0);
    }
    this.updatePlaceholder();
  }

  updatePlaceholder(){
    if (this.selectedFilter == '' || this.selectedFilter == 'All members'){
      this.placeholder = "all members..."
    }
    if (this.selectedFilter == 'Dispatcher'){
      this.placeholder = "dispatchers..."
    }
    if (this.selectedFilter == 'Medic'){
      this.placeholder = "medics..."
    }
    if (this.selectedFilter == 'Admin'){
      this.placeholder = "admins..."
    }
    if (this.selectedFilter == 'Admin'){
      this.placeholder = "admins..."
    }
    if (this.selectedFilter == 'On shift'){
      this.placeholder = "users on shift..."
    }
  }

  openModal(user: any) {
    this.selectedUser = user;
    this.modal?.present();
  }
}
