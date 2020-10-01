import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class SkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
