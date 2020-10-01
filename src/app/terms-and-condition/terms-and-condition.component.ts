import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss'],
})
export class TermsAndConditionComponent implements OnInit {
  public cmsPageName = 'Terms And Conditions';
  innnerHTML$: Observable<Array<any>>;
  constructor(public homeService: HomeService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.makeItFalse();
    });
    this.innnerHTML$ = this.homeService.getCmsPage(this.cmsPageName);
  }

  makeItFalse() {
    const isTrue = false;
    this.homeService.nextCountBoolean(isTrue);
  }
}
