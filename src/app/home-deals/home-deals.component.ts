import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-home-deals',
  templateUrl: './home-deals.component.html',
  styleUrls: ['./home-deals.component.scss'],
})
export class HomeDealsComponent implements OnInit {
  public deals = [];

  constructor(public homeService: HomeService, public toastr: ToastrManager) {}

  ngOnInit(): void {
    // this.getDeals();
  }

  // public getDeals: any = () => {
  //   return this.homeService.getDeal().subscribe(
  //     (response) => {
  //       this.deals = response[0].Banners;
  //       console.log(response);
  //       console.log(this.deals);
  //     },
  //     (error) => {
  //       this.toastr.errorToastr('Some error occured ' + error);
  //     }
  //   );
  // };
}
