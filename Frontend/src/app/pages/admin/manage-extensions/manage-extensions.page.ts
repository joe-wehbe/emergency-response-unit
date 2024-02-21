import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

interface User {
  name: string;
  extension: string;
}

@Component({
  selector: 'app-manage-extensions',
  templateUrl: './manage-extensions.page.html',
  styleUrls: ['./manage-extensions.page.scss'],
})
export class ManageExtensionsPage implements OnInit {

  users: User[] = [
    { name: 'Alice', extension: '2920' },
    { name: 'Alice', extension: '2301' },
    { name: 'Alice', extension: '3021' },
    { name: 'Bob', extension: '2102' },
    { name: 'Bob', extension: '2102' },
    { name: 'Bob', extension: '2102' },
    { name: 'Bob', extension: '2102' },
    { name: 'Bob', extension: '2013' },
    { name: 'Joe', extension: '4031' },
    { name: 'Joe', extension: '2321' },
    { name: 'Joe', extension: '2341' },
  ];

  groupedUsers: { letter: string, users: User[] }[] = [];
  filteredGroupedUsers: { letter: string, users: User[] }[] = [];

  constructor(private router:Router, private modalController:ModalController) {
    this.groupUsers();
    this.filteredGroupedUsers = [...this.groupedUsers];
  }

  groupUsers() {
    this.users.sort((a, b) => a.name.localeCompare(b.name));
  
    const groups: any = {};
    this.users.forEach(user => {
      const firstLetter = user.name.charAt(0).toUpperCase();
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
        (user.name.toLowerCase()).includes(query)
      )
    })).filter(filteredGroup => filteredGroup.users.length > 0);
  }

  ngOnInit() {}

  back(){
    this.router.navigate(['/admin-panel']);
  }

  alphabet: string[] = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));

  @ViewChild(IonContent, { static: true })
  content!: IonContent;
  scrollTo(letter: string) {
    const element = document.getElementById('header-' + letter);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const offsetTop = rect.top + scrollTop;
      this.content.scrollToPoint(0, offsetTop, 500);
    }
  }  

  add(){
    this.modalController.dismiss();
  }
}
