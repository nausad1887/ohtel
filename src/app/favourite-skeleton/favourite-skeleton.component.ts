import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../details/animation';

@Component({
  selector: 'app-favourite-skeleton',
  templateUrl: './favourite-skeleton.component.html',
  styleUrls: ['./favourite-skeleton.component.scss'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class FavouriteSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
