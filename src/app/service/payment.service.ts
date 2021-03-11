import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createOrder(amount: number, currency: string, receipt: string, payment_capture: boolean, notes: {}) {
    return new Promise<{ id: string, apiKey: string }>(
      (resolve, reject) => {
        this.http.post<{ id: string, apiKey: string }>(environment.apiUrl + 'createOrder', {
          amount: amount,
          currency: currency,
          receipt: receipt,
          payment_capture: payment_capture,
          notes: notes
        })
          .subscribe(
            (response: { id: string, apiKey: string }) => {
              resolve(response);
            }
          );
      }
    )
  }

  createStripeCheckout(paymentTypes: string[], amount: number, currency: string, quantity: number, email: string) {
    return new Promise<{ id: string }>(
      (resolve, reject) => {
        this.http.post<{ id: string }>(environment.apiUrl + 'checkoutStripe', { amount: amount, 
                                                                                paymentTypes: [...paymentTypes], 
                                                                                currency: currency, 
                                                                                quantity: quantity,
                                                                                email: email })
        .subscribe(
          (response: {id: string}) => {
            resolve(response);
          }
        );
      }
    );
  }
}
