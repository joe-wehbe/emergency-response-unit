import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

interface Shift {
  name: string;
  coveredBy: string;
  isAttended: string;
  date: string;
  timeRange: string;
}

@Component({
  selector: 'app-attendance-records',
  templateUrl: './attendance-records.page.html',
  styleUrls: ['./attendance-records.page.scss'],
})
export class AttendanceRecordsPage implements OnInit {

  shifts: Shift[] = [];
  groupedShifts: { [date: string]: Shift[] } = {};
  selectedMonth: string = '';

  constructor(private router:Router, private modalController:ModalController) {
    this.selectedMonth = this.getCurrentMonth();
    this.shifts = [
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '22/01/2024', timeRange: "9:00 - 10:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Gholib', date: '22/01/2024', timeRange: "8:00 - 9:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '22/01/2024', timeRange: "10:00 - 11:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '22/01/2024', timeRange: "11:00 - 12:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '22/01/2024', timeRange: "12:00 - 13:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '22/01/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},

      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '22/02/2024', timeRange: "8:00 - 9:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '22/02/2024', timeRange: "9:00 - 10:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '22/02/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '22/02/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},

      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '23/02/2024', timeRange: "8:00 - 9:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '23/02/2024', timeRange: "9:00 - 10:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '23/02/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '23/02/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},


      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '02/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '02/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '02/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '02/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '02/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},

      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '03/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '03/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '03/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '03/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '03/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},

      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '04/03/2024', timeRange: "10:00 - 12:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '04/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '04/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '04/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},
      {name: 'Joe Wehbe',  coveredBy: 'Roula Ghaleb', date: '04/03/2024', timeRange: "15:00 - 16:00", isAttended: 'yes'},


    ];
    this.groupedShifts = this.groupShiftsByDate(this.shifts);
  }

  ngOnInit() {
    this.fetch();
  }

  back() {
    this.router.navigate(['/admin-panel']);
  }

  dismiss(){
    this.modalController.dismiss();
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.detail.value;
  }

  getCurrentMonth(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  }
  
  async fetch() {
    if (this.selectedMonth) {
      const [selectedYear, selectedMonth] = this.selectedMonth.split('-');
      const filteredShifts = this.shifts.filter(shift => {
        const [shiftDay, shiftMonth, shiftYear] = shift.date.split('/');
        return shiftMonth === selectedMonth && shiftYear === selectedYear;
      });
      this.groupedShifts = this.groupShiftsByDate(filteredShifts);
    }
    await this.modalController.dismiss();
  }
  
  search(event: any) {
    const searchTerm: string = event.target.value.trim();
    if (searchTerm === '') {
      this.groupedShifts = this.groupShiftsByDate(this.shifts.filter(shift => {
        const [selectedYear, selectedMonth] = this.selectedMonth.split('-');
        const [shiftDay, shiftMonth, shiftYear] = shift.date.split('/');
        return shiftMonth === selectedMonth && shiftYear === selectedYear;
      }));
    } else {
      this.groupedShifts = this.groupShiftsByDate(this.shifts.filter(shift => {
        const [selectedYear, selectedMonth] = this.selectedMonth.split('-');
        const [shiftDay, shiftMonth, shiftYear] = shift.date.split('/');
        return (
          shiftMonth === selectedMonth &&
          shiftYear === selectedYear &&
          shift.date.includes(searchTerm)
        );
      }));
    }
  }
  
  groupShiftsByDate(shifts: Shift[]): { [date: string]: Shift[] } {
    const grouped: { [date: string]: Shift[] } = {};
  
    const allTimeRanges = [
      "8:00 - 9:00", "9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
      "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00"
    ];
  
    shifts.forEach(shift => {
      if (!grouped[shift.date]) {
        grouped[shift.date] = [];
      }
      grouped[shift.date].push(shift);
    });
  
    Object.keys(grouped).forEach(date => {
      const shiftsForDate = grouped[date];
      const existingTimeRanges = shiftsForDate.map(shift => shift.timeRange);
  
      allTimeRanges.forEach(timeRange => {
        if (!existingTimeRanges.includes(timeRange)) {
          grouped[date].push({
            name: "-",
            coveredBy: "-",
            date: date,
            timeRange: timeRange,
            isAttended: "-"
          });
        }
      });
  
      grouped[date].sort((a, b) => {
        const timeA = a.timeRange.split(" - ")[0];
        const timeB = b.timeRange.split(" - ")[0];
        return new Date("1970/01/01 " + timeA).getTime() - new Date("1970/01/01 " + timeB).getTime();
      });
    });
    return grouped;
  }
  Object = Object;  
}
