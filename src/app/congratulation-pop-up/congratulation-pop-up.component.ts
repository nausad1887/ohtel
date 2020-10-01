import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-congratulation-pop-up',
  templateUrl: './congratulation-pop-up.component.html',
  styleUrls: ['./congratulation-pop-up.component.scss'],
})
export class CongratulationPopUpComponent implements OnInit {
  @Input() data: any;
  public expiryTime: any;
  public expiryDate: any;
  constructor(public activeModal: NgbActiveModal, public router: Router) { }
  ngOnInit(): void {
    const dataSpace = this.data.postCreatedDate.split(' ');
    this.expiryDate = this.data.postEndDate;
    this.expiryTime = this.tConvert(dataSpace[1]);
    setTimeout(() => {
      this.activeModal.close();
      this.router.navigate(['/home']);
    }, 5000);
  }

  public onClose = () => {
    this.activeModal.close();
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000);
  }

  public tConvert(time: any) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    time[0] < 10 ? (time[0] = '0' + time[0]) : (time[0] = time[0]);
    return time[0] + '' + time[1] + '' + time[2] + ' ' + time[5]; // return adjusted time or original string
  }
}
