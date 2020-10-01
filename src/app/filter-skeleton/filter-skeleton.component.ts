import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-filter-skeleton',
  templateUrl: './filter-skeleton.component.html',
  styleUrls: ['./filter-skeleton.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class FilterSkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
