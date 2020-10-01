import { Component, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-price-range-slider',
  templateUrl: './price-range-slider.component.html',
  styleUrls: ['./price-range-slider.component.scss'],
})
export class PriceRangeSliderComponent implements OnInit {
  @Output() price = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    // for price
    // tslint:disable-next-line: deprecation
    $(document).ready(() => {
      ($('#demo_1') as any).ionRangeSlider({
        type: 'double',
        grid: true,
        min: 1,
        max: 500000,
        from: 1000,
        to: 400000,
        prefix: `<span class='iconify' data-icon='fa-inr' data-inline='false'></span>`,
        onFinish: this.saveResult,
      });
    });

    // Filter Mobile
    // tslint:disable-next-line: deprecation
    $('#fiter-shomobile').click(function () {
      $('.filter-section-left').toggleClass('d-block');
    });
  }
  saveResult = (data: any) => {
    this.price.emit(data);
  };
}
