import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-related-ads-skeleton',
  templateUrl: './related-ads-skeleton.component.html',
  styleUrls: ['./related-ads-skeleton.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class RelatedAdsSkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
