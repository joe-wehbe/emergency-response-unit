import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

interface Extension {
  name: string;
  number: string;
}

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.page.html',
  styleUrls: ['./extensions.page.scss'],
})
export class ExtensionsPage implements OnInit {

  extensions: Extension[] = [];
  allExtensions: any[] = [];

  groupedExtensions: { letter: string, extensions: Extension[] }[] = [];
  filteredGroupedExtensions: { letter: string, extensions: Extension[] }[] = [];

  constructor(private router:Router, private userService: UserService) {
  }

  groupExtensions() {
    this.extensions.sort((a, b) => a.name.localeCompare(b.name));
  
    const groups: any = {};
    this.extensions.forEach(extension => {
      const firstLetter = extension.name.charAt(0).toUpperCase();
      groups[firstLetter] = groups[firstLetter] || [];
      groups[firstLetter].push(extension);
    });
  
    this.groupedExtensions = Object.keys(groups).map(letter => ({
      letter,
      extensions: groups[letter]
    }));
  }

  handleInput(event: any) {
    const query = event.target.value.trim().toLowerCase();

    if (query === '') {
      this.filteredGroupedExtensions = [...this.groupedExtensions];
      return;
    }

    this.filteredGroupedExtensions = this.groupedExtensions.map(group => ({
      letter: group.letter,
      extensions: group.extensions.filter(extension =>
        (extension.name.toLowerCase()).includes(query)
      )
    })).filter(filteredGroup => filteredGroup.extensions.length > 0);
  }

  ngOnInit() {
    this.getExtensions();
  }

  getExtensions(){
    this.userService.getExtensions()
      .subscribe({
        next: (response) => {
          if(response && response.hasOwnProperty("extensions")){
            console.log("Fetched all extensions: ", response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            this.allExtensions = [].concat.apply([], Object.values(parsedResponse['extensions']));

            this.allExtensions.forEach(extension =>{
              this.extensions.push({
                name: extension.name, 
                number: extension.number, 
              })
            })
            this.groupExtensions();
            this.filteredGroupedExtensions = [...this.groupedExtensions];
          }
          else{
            console.log("No extensions");
          }
        },
        error: (error) => {
          console.error("Error retrieving extensions:", error);
        }
      });
  }

  back(){
    this.router.navigate(['/admin-panel']);
  }
}
