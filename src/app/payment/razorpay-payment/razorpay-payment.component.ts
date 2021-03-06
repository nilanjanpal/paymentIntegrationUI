import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { User } from 'src/app/model/user.model';
import { PaymentService } from 'src/app/service/payment.service';
import { UserService } from 'src/app/service/user.service';
import { WindowRefService } from 'src/app/service/window-ref.service';

@Component({
  selector: 'app-razorpay-payment',
  templateUrl: './razorpay-payment.component.html',
  styleUrls: ['./razorpay-payment.component.css']
})
export class RazorpayPaymentComponent implements OnInit {

  razorPayOptions = {
    'key': '',
    'amount': '',
    'currency': 'INR',
    'name': '',
    'description': '',
    'order_id': '',
    'prefill': {
      'name': '',
      'email': '',
      'contact': '',
      'method': ''
    },
    'handler': (res) => { console.log(res); }
  };

  paymentForm: FormGroup;
  amount: number;
  currency ='INR';
  receipt = '12345432';
  paymentCapture = false;
  notes = {};
  definedAmount = [500 , 1000, 1500, 2000];
  user: User;

  constructor(private winRef: WindowRefService,
              private paymentService: PaymentService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.paymentForm = new FormGroup({
      amount: new FormControl('', Validators.required),
    });
  }

  createRazorPayOrder() {
    this.paymentService.createOrder(this.amount*100, this.currency, this.receipt, this.paymentCapture, this.notes)
    .then(
      (response) => {
        this.userService.getUser()
        .pipe(take(1))
        .subscribe(
          (user) => {
            this.user = {...user};
            this.payWithRazor(response.id, response.apiKey);
          }
        )
      }
    );
  }

  payWithRazor(val, apiKey) {
    const options: any = {
      key: apiKey,
      amount: this.amount*100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: this.currency,
      name: '', // company name or product name
      description: '',  // product description
      image: './assets/logo.png', // company logo or product image
      order_id: val, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      },
      prefill: {
        name: this.user.name,
        email: this.user.email,
        contact: this.user.phone
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  onInput(value) {
    this.amount = value;
  }
  
}
