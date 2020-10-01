import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-post-ads-skeleton',
  templateUrl: './post-ads-skeleton.component.html',
  styleUrls: ['./post-ads-skeleton.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class PostAdsSkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
