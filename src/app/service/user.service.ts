import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { User } from "../model/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private user: User;
    createUserEvent = new Subject<void>();

    createUser(user: User) {
        this.user = {...user};
    }

    getUser() {
        return of(this.user);
    }

    isStripeSelected(): Observable<boolean> {
        if(this.user && this.user!=undefined) {
            return of(this.user.paymentGatewaySelected == 'Stripe');
        }
        else {
            return of(false);
        }
    }

    isRazorpaySelected(): Observable<boolean> {
        if(this.user && this.user!=undefined) {
            return of(this.user.paymentGatewaySelected == 'Razorpay');
        }
        else {
            return of(false);
        }
    }

}