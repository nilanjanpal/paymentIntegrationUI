import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

  createUser() {
    this.userService.createUserEvent.next();
  }

}
