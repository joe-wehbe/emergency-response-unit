import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin/admin.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  extension: string;
}

@Component({
  selector: 'app-manage-extensions',
  templateUrl: './manage-extensions.page.html',
  styleUrls: ['./manage-extensions.page.scss'],
})
export class ManageExtensionsPage implements OnInit {
  name: string = '';
  number: string = '';
  users: User[] = [
  ];

  groupedUsers: { letter: string, users: User[] }[] = [];
  filteredGroupedUsers: { letter: string, users: User[] }[] = [];

  constructor(private toastController:ToastController, private http:HttpClient, private adminService:AdminService, private router:Router, private modalController:ModalController, private alertController:AlertController) {
    
    
  }
  ngOnInit() {

    this.adminService.get_extensions().subscribe(response => {
      const extensions = Object.values(response).reduce((acc: any[], curr: any[]) => acc.concat(curr), []); 
      this.users = extensions.map((user: { id: number, name: string, number: string }) => ({ 
        id : user.id,
        name: user.name,
        number: user.number,
      }));

    this.groupUsers();
    this.filteredGroupedUsers = [...this.groupedUsers];

    });

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

  dismiss(){
    this.modalController.dismiss();
  }

   add() {
    this.adminService.add_extension(this.name, this.number).subscribe(response => {
      this.handleResponse(response);
    });
  }
  
  async handleResponse(response: any) {
    const str = JSON.stringify(response);
    const result = JSON.parse(str);
    const status = result['status'];
    if (status == "Success") {
      window.location.reload();
    } else {
      const toast = await this.toastController.create({
        message: 'Failed to add extension',
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
    }
  }

  async deleteAlert(id: number) {
    const alert = await this.alertController.create({
      header: 'Delete Extension',
      subHeader: 'Are you sure you want to delete this extension?',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            // Call your API here
            this.deleteExtension(id);
          }
        },
      ],
    });
    await alert.present();
  }


  async deleteExtension(ext_id: number){
    try {
      await this.http.delete<any>(`http://localhost:8000/api/v0.1/admin/delete-extension/${ext_id}`).pipe(
        catchError(async (error) => {
          console.error('Error occurred while deleting extension:', error);
          const toast = await this.toastController.create({
            message: 'Failed to delete extension',
            duration: 2000, 
            position: 'bottom'
          });
          toast.present();
          throw error;
        })
      ).toPromise();
  
      const toast = await this.toastController.create({
        message: 'Extension deleted successfully',
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
      window.location.reload();
      
    } catch (error) {
      console.error('Error occurred while deleting extension:', error);
      const toast = await this.toastController.create({
        message: 'Failed to delete extension',
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
    }
  }
}
