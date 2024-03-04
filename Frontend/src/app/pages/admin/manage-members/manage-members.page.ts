import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

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

  constructor(private router:Router, public alertController: AlertController, private toastController:ToastController) {
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
              return false;
            } else {
              return true;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@lau\.edu(?:\.lb)?$/;
    return emailRegex.test(email);
  }

  goToProfile(){
    this.router.navigate(["./user-profile"])
  }
}
