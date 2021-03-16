import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Address, User } from '../model/user.model';
import { PaymentService } from '../service/payment.service';
import { UserService } from '../service/user.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  saveUserSubscription: Subscription;

  constructor(private utilService: UtilService,
              public paymentService: PaymentService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.createForm();
    this.saveUserSubscription = this.userService.createUserEvent
    .subscribe(
      () => {
        const address: Address = {
          street: this.userForm.value.street,
          city: this.userForm.value.city,
          state: this.userForm.value.state,
          zip: this.userForm.value.zip
        }
    
        const user: User = {
          name: this.userForm.value.name,
          email: this.userForm.value.email,
          phone: this.userForm.value.phone,
          paymentGatewaySelected: this.userForm.value.paymentGateway,
          address: {...address}
        };
        this.userService.createUser(user);
      }
    );
  }

  createForm() {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      paymentGateway: new FormControl('', Validators.required)
    });
  }

  populateAddress() {
    this.utilService.getAddress();
    this.utilService.addressFetchEvent
    .pipe(take(1))
    .subscribe(address => {
      this.userForm.patchValue({
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip
      });
    })
  }

  ngOnDestroy() {
    this.saveUserSubscription.unsubscribe();
  }

}
