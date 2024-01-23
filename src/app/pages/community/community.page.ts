import { Component, OnInit } from '@angular/core';

interface Member {
  name: string;
  avatar: string;
  role: string;
  isOnShift: boolean;
}

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  members: Member[] = [];
  filteredMembers: Member[] = [];
  groups: any;

  constructor() {}

  ngOnInit() {
    // Generate some fake data
    this.members = this.generateFakeMembers();
    this.filteredMembers = this.members;

    // Group members by the first letter of their name
    this.groups = this.groupMembersByLetter();
  }

  filterMembers(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredMembers = this.members.filter((member) =>
      member.name.toLowerCase().includes(searchTerm)
    );
  }

  // Function to generate fake members data
  generateFakeMembers(): Member[] {
    const fakeMembers: Member[] = [];

    for (let i = 0; i < 100; i++) {
      const fakeMember: Member = {
        name: `User ${i}`,
        avatar: 'path/to/avatar.png',
        role: 'Member', // You can adjust roles as needed
        isOnShift: i % 2 === 0, // Assigns 'true' to every even index
      };

      fakeMembers.push(fakeMember);
    }

    return fakeMembers;
  }

  // Function to group members by the first letter of their name
  groupMembersByLetter() {
    const groups: any[] = [];

    this.filteredMembers.forEach((member) => {
      const firstLetter = member.name.charAt(0).toUpperCase();

      let group = groups.find((g) => g.letter === firstLetter);

      if (!group) {
        group = { letter: firstLetter, members: [] };
        groups.push(group);
      }

      group.members.push(member);
    });

    return groups;
  }

  openSideMenu(event: any) {}

  filterByLetter(event: any) {}

  alphabets = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  scrollToLetter(letter: string) {
    const element = document.getElementById(`group-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
