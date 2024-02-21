import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface User {
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

  constructor(private router:Router, public alertController: AlertController) {
    this.groupUsers();
    this.filteredGroupedUsers = [...this.groupedUsers];
  }

  ngOnInit() {
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
      header: 'Add member?',
      subHeader: 'Enter their LAU email, they will be able to login as an ERU member.',
      cssClass: "alert-dialog",

      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: 'Email...',
          cssClass: 'location-input',
        },

      ],

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Cancelled');
          },
        },
        {
          text: 'Add',
          cssClass: 'alert-button-ok-red',
        },
      ],
    });
    await alert.present();
  }

  goToProfile(){
    this.router.navigate(["./profile"])
  }
}
