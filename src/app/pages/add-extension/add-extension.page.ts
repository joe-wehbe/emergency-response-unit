import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-extension',
  templateUrl: './add-extension.page.html',
  styleUrls: ['./add-extension.page.scss'],
})
export class AddExtensionPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['manage-extensions']);
  }

}
