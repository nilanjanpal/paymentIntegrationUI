import { Component, OnInit } from '@angular/core';
import { UtilService } from './service/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Payment Integration';

  constructor(private utilService: UtilService) {}

  ngOnInit() { }

}
