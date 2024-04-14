import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

interface Extension {
  id: number;
  name: string;
  number: string;
}

@Component({
  selector: 'app-manage-extensions',
  templateUrl: './manage-extensions.page.html',
  styleUrls: ['./manage-extensions.page.scss'],
})
export class ManageExtensionsPage implements OnInit {

  name: string = '';
  number: string = '';
  extensions: Extension[] = [];
  groupedExtensions: { letter: string, extensions: Extension[] }[] = [];
  filteredGroupedExtensions: { letter: string, extensions: Extension[] }[] = [];

  constructor(
    private toastController:ToastController, 
    private adminService:AdminService, 
    private router:Router, 
    private modalController:ModalController, 
    private alertController:AlertController,
    private userService:UserService,
  ) {}

  ngOnInit() {
    this.getExtensions();
  }

  getExtensions(){
    this.userService.getExtensions().subscribe(response => {
      const extensions = Object.values(response).reduce((acc: any[], curr: any[]) => acc.concat(curr), []); 
      this.extensions = extensions.map((extension: { id: number, name: string, number: string }) => ({ 
        id : extension.id,
        name: extension.name,
        number: extension.number,
      }));
      this.groupExtensions();
      this.filteredGroupedExtensions = [...this.groupedExtensions];
    });
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

  addExtension() {
    this.adminService.addExtension(this.name, this.number)
    .subscribe({
      next: (response) => {
        console.log('Added extension successfully:', response);
        this.presentToast("Extension added");
        this.name = '';
        this.number = '';
        this.dismiss();
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error adding extension:', error);
      },
    });
  }

  async deleteAlert(id: number) {
    const alert = await this.alertController.create({
      header: 'Delete Extension',
      subHeader: 'Are you sure you want to permanently delete this extension?',
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
            this.deleteExtension(id);
          }
        },
      ],
    });
    await alert.present();
  }

  deleteExtension(id:number){
    this.adminService.deleteExtension(id)
    .subscribe({
      next: (response) => {
        console.log('Deleted extension successfully:', response);
        this.presentToast("Extension deleted");
        this.dismiss();
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error deleting exntesion:', error);
      },
    });
  }

  async presentToast(message:string){
    const toast = await this.toastController.create({
         message: message,
         duration: 2000, 
         position: 'bottom'
    });
    toast.present();
  }

  dismiss(){
    this.modalController.dismiss();
  }

  back(){
    this.router.navigate(['/admin-panel']);
  }
}
