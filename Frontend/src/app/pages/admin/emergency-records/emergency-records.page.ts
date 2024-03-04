import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';

interface Item {
  medicName: string;
  patientName: string;
  date: string;
  location: string;
}

@Component({
  selector: 'app-emergency-records',
  templateUrl: './emergency-records.page.html',
  styleUrls: ['./emergency-records.page.scss'],
})

export class EmergencyRecordsPage {

  items: Item[] = [];
  groupedItems: { [date: string]: Item[] } = {};
  selectedOption: string = 'all-time';

  HeartRate: number = 80;
  RespirationRate: number = 15;
  BloodSaturation: number = 96;
  CapillaryRefill: number = 2;
  Temperature: number = 37;
  HemoGlucoTest: number = 80;
  Systolic: number = 100;
  Diastolic: number = 70;

  @ViewChild('detailsModal') modal: IonModal | undefined;

  fromDateElement: HTMLIonDatetimeElement | null = null;
  toDateElement: HTMLIonDatetimeElement | null = null;

  constructor(private router: Router, private modalController: ModalController) {
    this.items = [
      { medicName: 'bro Doe', patientName:"joj", date: '22/01/2022', location: 'science 404' },
      { medicName: 'bro Doe', patientName:"joj", date: '22/02/2022', location: 'science 404' },
      { medicName: 'man Doe', patientName:"joj", date: '22/03/2022', location: 'Zakhem 404' },
      { medicName: 'lol Doe', patientName:"joe", date: '22/04/2022', location: 'hall 404' },
      { medicName: 'lol Doe', patientName:"joe", date: '22/05/2022', location: 'hall 404' },
      { medicName: 'lol Doe', patientName:"joe", date: '22/06/2022', location: 'hall 404' },
      { medicName: 'lol Doe', patientName:"joe", date: '22/07/2022', location: 'hall 404' },
      { medicName: 'lol Doe', patientName:"joe", date: '22/08/2022', location: 'hall 404' },
      { medicName: 'lol Doe', patientName:"joe", date: '22/09/2022', location: 'hall 404' },
      { medicName: 'lol Doe', patientName:"joe", date: '22/10/2022', location: 'hall 404' },
      { medicName: 'lol Doe', patientName:"joe", date: '22/11/2022', location: 'hall 404' },
      { medicName: 'lol Doe', patientName:"joe", date: '22/12/2022', location: 'hall 404' },

      { medicName: 'John Doe', patientName:"hi", date: '22/01/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/02/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/03/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/04/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/05/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/06/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/07/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/08/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/09/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/10/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/11/2023', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/12/2023', location: 'Zakhem 204' },

      { medicName: 'John Doe', patientName:"hi", date: '22/01/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/02/2024', location: 'Zakhem 204' },
      { medicName: 'lol Doe', patientName:"hi", date: '22/02/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/02/2024', location: 'hall 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/02/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/02/2024', location: 'Zakhem 204' },

      { medicName: 'John Doe', patientName:"hi", date: '22/03/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/04/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/05/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/06/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/07/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/08/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/09/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/10/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/11/2024', location: 'Zakhem 204' },
      { medicName: 'John Doe', patientName:"hi", date: '22/12/2024', location: 'Zakhem 204' },

    ];
    this.groupedItems = this.groupItemsByDate(this.items);
  }

  back() {
    this.router.navigate(['/admin-panel']);
  }

  dismiss(){
    this.modalController.dismiss();
  }

  openModal() {
    this.modal?.present();
  }

  async fetch() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
  
    let fromDate = new Date(currentYear, currentMonth - 1, 1);
    let toDate = new Date(currentYear, currentMonth, 0);
  
    switch (this.selectedOption) {
      case 'all-time':
        this.groupedItems = this.groupItemsByDate(this.items);
        break;

      case 'this-month':
        const filteredThisMonth = this.items.filter(item => {
          const [itemMonth, itemYear] = item.date.split('/').slice(1).map(Number);
          return itemMonth === currentMonth && itemYear === currentYear;
        });
        this.groupedItems = this.groupItemsByDate(filteredThisMonth);
        break;

      case 'select-time':
        this.fromDateElement = document.getElementById('from-date') as HTMLIonDatetimeElement;
        this.toDateElement = document.getElementById('to-date') as HTMLIonDatetimeElement;
        
        if (this.fromDateElement && this.toDateElement) {
          const fromDateValue = this.fromDateElement.value;
          const toDateValue = this.toDateElement.value;
  
          if (typeof fromDateValue === 'string') {
            fromDate = new Date(fromDateValue);
          }
  
          fromDate.setDate(1); 
          fromDate.setHours(0, 0, 0, 0); 
  
          if (typeof toDateValue === 'string') {
            toDate = new Date(toDateValue);
          } else {
            toDate = new Date(currentYear, currentMonth, 0);
          }
  
          toDate.setHours(23, 59, 59, 999);
  
          if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
            const filteredByTimeFrame = this.items.filter(item => {
              const [itemDay, itemMonth, itemYear] = item.date.split('/').map(Number);
              const itemDate = new Date(itemYear, itemMonth - 1, itemDay);
              return itemDate >= fromDate && itemDate <= toDate;
            });
            this.groupedItems = this.groupItemsByDate(filteredByTimeFrame);
          }
        }
        break;
        
      default:
        break;
    }  
    await this.modalController.dismiss();
  }
  
  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Selected option:', this.selectedOption);
    console.log('Search term:', searchTerm);
    let filteredItems: Item[] = [];

    let currentDate: Date;
    let currentMonth: number;
    let currentYear: number;
  
    switch (this.selectedOption) {
      case 'all-time':
        filteredItems = this.items.filter(item =>
          this.itemContainsSearchTerm(item, searchTerm)
        );
        break;
        
      case 'this-month':
        currentDate = new Date();
        currentMonth = currentDate.getMonth() + 1;
        currentYear = currentDate.getFullYear();

        filteredItems = this.items.filter(item => {
          const [itemMonth, itemYear] = item.date.split('/').slice(1).map(Number);
          return itemMonth === currentMonth && itemYear === currentYear;
        }).filter(item =>
          this.itemContainsSearchTerm(item, searchTerm)
        );
        break;

      case 'select-time':
        currentDate = new Date();
        currentMonth = currentDate.getMonth() + 1;
        currentYear = currentDate.getFullYear();

        let fromDate = new Date(currentYear, currentMonth - 1, 1);
        let toDate = new Date(currentYear, currentMonth, 0);

        if (this.fromDateElement && this.toDateElement) {
          console.log('From date value:', this.fromDateElement);
          console.log('To date value:', this.toDateElement);

          const fromDateValue = this.fromDateElement.value;
          const toDateValue = this.toDateElement.value;

          if (typeof fromDateValue === 'string') {
            fromDate = new Date(fromDateValue);
          }

          if (typeof toDateValue === 'string') {
            toDate = new Date(toDateValue);
          } else {
            toDate = new Date(currentYear, currentMonth, 0);
          }

          fromDate.setDate(1);
          fromDate.setHours(0, 0, 0, 0);

          toDate.setHours(23, 59, 59, 999);

          if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
            const filteredByTimeFrame = this.items.filter(item => {
              const [itemDay, itemMonth, itemYear] = item.date.split('/').map(Number);
              const itemDate = new Date(itemYear, itemMonth - 1, itemDay);
              return itemDate >= fromDate && itemDate <= toDate;
            });
            filteredItems = filteredByTimeFrame.filter(item =>
              this.itemContainsSearchTerm(item, searchTerm)
            );
          }
        }
        break;
      default:
        break;
    }
    this.groupedItems = this.groupItemsByDate(filteredItems);
  }

  itemContainsSearchTerm(item: Item, searchTerm: string): boolean {
    return item.medicName.toLowerCase().includes(searchTerm) ||
           item.patientName.toLowerCase().includes(searchTerm) ||
           item.date.includes(searchTerm) ||
           item.location.toLowerCase().includes(searchTerm);
  }
  
  groupItemsByDate(items: Item[]): { [date: string]: Item[] } {
    const grouped: { [date: string]: Item[] } = {};
    items.forEach(item => {
      if (!grouped[item.date]) {
        grouped[item.date] = [];
      }
      grouped[item.date].push(item);
    });
    return grouped;
  }
  Object = Object;
}
