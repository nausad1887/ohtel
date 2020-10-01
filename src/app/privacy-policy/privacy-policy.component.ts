import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  public cmsPageName = 'Privacy Policy';
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
