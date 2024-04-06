import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-reading-medical-faq',
  templateUrl: './reading-medical-faq.page.html',
  styleUrls: ['./reading-medical-faq.page.scss'],
})
export class ReadingMedicalFaqPage implements OnInit {

  allMedicalFaqs: any[] = [];

  constructor(private router:Router, private userService: UserService) { }

  ngOnInit() {
    this.getMedicalFaqs()
  }

  back(){
    this.router.navigate(["./medical-faqs"])
  }

  getMedicalFaqs(){
    this.userService.getMedicalFAQs()
      .subscribe({
        next: (response) => {
          if(response && response.hasOwnProperty("medicalFAQ")){
            console.log("Fetched all extensions: ", response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            this.allMedicalFaqs = [].concat.apply([], Object.values(parsedResponse['medicalFAQ']));

          }
          else{
            console.log("No medical faqs");
          }
        },
        error: (error) => {
          console.error("Error retrieving medical faqs:", error);
        }
      });
  }

}
