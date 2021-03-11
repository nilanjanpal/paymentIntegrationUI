import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from 'src/app/service/payment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent  implements OnInit {
  
  paymentForm: FormGroup;
  amount: number;
  name: string;
  stripe: any;
  paymentTypes = ['card'];
  currency: string;
  quantity: number;
  email: string;
  definedAmount = [500 , 1000, 1500, 2000];
  currencyAvailable = ['INR', 'USD', 'EUR', 'GBP'];
  quantityAvailable = [1, 2, 3, 4, 5];

  constructor(private paymentService: PaymentService) { }
  
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
      name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  createPayment() {
    this.amount = this.paymentForm.value.amount * 100;
    this.name = this.paymentForm.value.name;
    this.currency = this.paymentForm.value.currency;
    this.quantity = this.paymentForm.value.quantity;
    this.email = this.paymentForm.value.email;
    this.paymentService.createStripeCheckout(this.paymentTypes, 
                                             this.amount, 
                                             this.currency, 
                                             this.quantity,
                                             this.email)
    .then(
      (res) => {
        this.stripe.redirectToCheckout({sessionId: res.id});
      }
    )
  }

  onInput(value) {
    this.amount = value;
  }

  onRadioChange(value) {
    console.log(value);
  }
}