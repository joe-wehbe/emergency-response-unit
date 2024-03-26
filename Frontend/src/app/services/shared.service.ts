import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

   private id: any;

  constructor() { }

  setVariableValue(value: any) {
    this.id = value;
  }

  getVariableValue() {
    return this.id;
  }
}
