import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-my-ads-skeleton',
  templateUrl: './my-ads-skeleton.component.html',
  styleUrls: ['./my-ads-skeleton.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class MyAdsSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
