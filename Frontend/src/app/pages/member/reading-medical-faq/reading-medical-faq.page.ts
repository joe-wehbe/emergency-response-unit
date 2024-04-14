import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';

interface MedicalFaq {
  id: number;
  type: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-reading-medical-faq',
  templateUrl: './reading-medical-faq.page.html',
  styleUrls: ['./reading-medical-faq.page.scss'],
})
export class ReadingMedicalFaqPage implements OnInit {
  allMedicalFaqs: any[] = [];
  type: string = '';
  medicalFaqs: MedicalFaq[] = [];
  allFAQs: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getMedicalFAQs();
  }

  getMedicalFAQs() {
    this.route.params.subscribe((params) => {
      this.type = params['type'];
      
      this.userService.getMedicalFAQs(this.type).subscribe({
        next: (response) => {
          if (response && response.hasOwnProperty('medicalFAQ')) {
            console.log('Fetched all medical FAQs: ', response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            this.allFAQs = [].concat.apply([], Object.values(parsedResponse['medicalFAQ']));
            this.allFAQs.forEach((faq) => {
              this.medicalFaqs.push({
                id: faq.id,
                type: faq.type,
                question: faq.question,
                answer: faq.answer,
              });
              this.type = faq.type;
            });
          } else {
            console.log('No users');
          }
        },
        error: (error) => {
          console.error('Error retrieving users:', error);
        },
      });
    });
  }

  back() {
    this.router.navigate(['./medical-faqs']);
  }
}
