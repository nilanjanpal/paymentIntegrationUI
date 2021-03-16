import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Address } from "../model/user.model";

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    addressFetchEvent= new Subject<Address>();
    constructor(private http: HttpClient) {}

    getAddress() {
        const address: Address = {street:'', city: '', state: '', zip: ''};
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => { 
                    this.http.post<any>(environment.apiUrl+'fetchAddress', {latitude: position.coords.latitude, longitude: position.coords.longitude})
                    .pipe(map(
                        (res) => {
                            if (res.results && res.results.length > 0) {
                                console.log(res.results[0]);
                                address.street = res.results[0].street;
                                address.city = res.results[0].city;
                                address.state = res.results[0].state;
                                address.zip = res.results[0].pincode;
                            }
                            return address;
                        }
                    ))
                    .subscribe(
                        (address) => {
                            this.addressFetchEvent.next(address);
                        }
                    );
                },
                (err) => { console.log(err); return address; }
            )
        };
    }
}