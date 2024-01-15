import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage-extensions',
  templateUrl: './manage-extensions.page.html',
  styleUrls: ['./manage-extensions.page.scss'],
})
export class ManageExtensionsPage implements OnInit {

  users: { [key: string]: any[] } = {
    'A': [{ name: 'Alice' }, { name: 'Adam' }],
    'B': [{ name: 'Bob' }, { name: 'Betty' }],
   
  };

  
filteredUsers = this.users;


  
  alphabetKeys: string[] = [];

  constructor(private router:Router) { 
    this.alphabetKeys = Object.keys(this.users).sort();
    

  }


 handleInput(event: any) {
   const searchTerm = event.target.value.toLowerCase();
   console.log('Search Term:', searchTerm);

   if (!searchTerm) {
      this.filteredUsers = this.users;
     console.log('Filtered Users Reset to Original Users:', this.filteredUsers);
     return;
   }
 
   Object.keys(this.users).forEach(key => {
     this.filteredUsers[key] = this.users[key].filter(user => user.name.toLowerCase().includes(searchTerm));
   });
 
   console.log('Filtered Users:', this.filteredUsers);
  }


  ngOnInit() {

  }

  goToAddExtension(){
    this.router.navigate(['/add-extension']);
  }

  goBack(){
    this.router.navigate(['/folder/Admin Panel']);
  }

}
