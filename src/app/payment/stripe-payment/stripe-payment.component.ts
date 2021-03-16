import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { take } from 'rxjs/operators';
import { User } from 'src/app/model/user.model';
import { PaymentService } from 'src/app/service/payment.service';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent  implements OnInit {
  
  paymentForm: FormGroup;
  amount: number;
  stripe: any;
  paymentTypes = ['card'];
  currency: string;
  quantity: number;
  definedAmount = [500, 1000, 1500, 2000];
  currencyAvailable = ['INR', 'USD', 'EUR', 'GBP'];
  quantityAvailable = [1, 2, 3, 4, 5];
  user: User;

  constructor(private paymentService: PaymentService,
              private userService: UserService) { }
  
  ngOnInit() {
    this.createForm();
    loadStripe(environment.stripeKey)
    .then(
      (stripe) => this.stripe = stripe
    )
    .catch(err => console.log(err));
  }

  createForm() {
    this.paymentForm = new FormGroup({
      amount: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required)
    });
  }

  createPayment() {
    this.userService.getUser()
    .pipe(take(1))
    .subscribe(
      (user: User) => {
        this.amount = this.paymentForm.value.amount;
        this.currency = this.paymentForm.value.currency;
        this.quantity = this.paymentForm.value.quantity;
        this.paymentService.createStripeCheckout(this.paymentTypes, 
          this.amount, 
          this.currency, 
          this.quantity,
          user.email)
        .then(
          (res) => {
            this.stripe.redirectToCheckout({sessionId: res.id})
            .then(
              (res) => console.log(res)
            );
          }
        )
      }
    );
  }

  onInput(value) {
    this.amount = value;
  }
}