import { Component, OnInit } from '@angular/core';

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

  constructor() {
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
}
