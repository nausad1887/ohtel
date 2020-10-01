import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-subscription-skeleton',
  templateUrl: './subscription-skeleton.component.html',
  styleUrls: ['./subscription-skeleton.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class SubscriptionSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
