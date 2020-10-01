import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { DealsComponent } from './deals/deals.component';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { SpacesListComponent } from './spaces-list/spaces-list.component';
import { UsedEquipmentComponent } from './used-equipment/used-equipment.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeService } from './home.service';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ng6-toastr-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeDealsComponent } from './home-deals/home-deals.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyAdsComponent } from './my-ads/my-ads.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { NotificationComponent } from './notification/notification.component';
import { PostAdsComponent } from './post-ads/post-ads.component';
import { NgSelect2Module } from 'ng-select2';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedCategoryComponent } from './shared-category/shared-category.component';
import { RouteGuardService } from './route-guard.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { TruncatePipe } from './spaces-list/truncate.pipe';
import { DetailsComponent } from './details/details.component';
import { SpacesPostAdsFormComponent } from './spaces-post-ads-form/spaces-post-ads-form.component';
import { MatRadioModule } from '@angular/material/radio';
import { PreviewComponent } from './preview/preview.component';
import { OtpVerifyComponent } from './otp-verify/otp-verify.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from './payment/payment.component';
import { VerificationPopUpComponent } from './verification-pop-up/verification-pop-up.component';
import { UsedEquipmentsPostFormComponent } from './used-equipments-post-form/used-equipments-post-form.component';
import { CongratulationPopUpComponent } from './congratulation-pop-up/congratulation-pop-up.component';
import { DealsPostFormComponent } from './deals-post-form/deals-post-form.component';
import { JobPostFormComponent } from './job-post-form-applicant/job-post-form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JobPostFormRecruiterComponent } from './job-post-form-recruiter/job-post-form-recruiter.component';
import { JobsApplicantPreviewComponent } from './jobs-applicant-preview/jobs-applicant-preview.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RecruiterPreviewComponent } from './jobs-recruiter-preview/recruiter-preview.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { RecruiterDetailsComponent } from './recruiter-details/recruiter-details.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { SignUpModalComponent } from './sign-up-modal/sign-up-modal.component';
import { ForgetPasswordModalComponent } from './forget-password-modal/forget-password-modal.component';
import { VerificationModalComponent } from './verification-modal/verification-modal.component';
import { ResetPasswordModalComponent } from './reset-password-modal/reset-password-modal.component';
import { UsersNavbarComponent } from './users-navbar/users-navbar.component';
import { UserUpdateModalComponent } from './user-update-modal/user-update-modal.component';
import * as $ from 'jquery';
import { SearchPipe } from './custom.search.pipe';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { FilterSkeletonComponent } from './filter-skeleton/filter-skeleton.component';
import { RelatedAdsSkeletonComponent } from './related-ads-skeleton/related-ads-skeleton.component';
import { PostAdsSkeletonComponent } from './post-ads-skeleton/post-ads-skeleton.component';
import { PriceRangeSliderComponent } from './price-range-slider/price-range-slider.component';
import { SortPipe } from './sort.pipe';
import { SubscriptionPipe } from './subscription.pipe';
import { SubscriptionSkeletonComponent } from './subscription-skeleton/subscription-skeleton.component';
import { MyAdsSkeletonComponent } from './my-ads-skeleton/my-ads-skeleton.component';
import { MyAdsDetailsComponent } from './my-ads-details/my-ads-details.component';
import { FavouriteListsPipe } from './favourite-lists.pipe';
import { FavouriteSkeletonComponent } from './favourite-skeleton/favourite-skeleton.component';
import { PrivacyPipe } from './privacy-policy/privacy.pipe';
import { SortSubCatPipe } from './sort-sub-cat.pipe';
import { JobsCatPipe } from './jobs-list/jobs-cat.pipe';
import { ViewpostPipe } from './jobs-list/viewpost.pipe';
import { FilterByPricePipe } from './filter-by-price.pipe';
import { HomePipe } from './home/home.pipe';
import { CatLabelPipe } from './home/cat-label.pipe';
import { DetailsPipe } from './details/details.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AboutUsComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionComponent,
    DealsComponent,
    JobsListComponent,
    SpacesListComponent,
    UsedEquipmentComponent,
    HomeDealsComponent,
    MyAccountComponent,
    MyAdsComponent,
    SubscriptionComponent,
    NotificationComponent,
    PostAdsComponent,
    SharedCategoryComponent,
    TruncatePipe,
    DetailsComponent,
    SpacesPostAdsFormComponent,
    PreviewComponent,
    OtpVerifyComponent,
    PaymentComponent,
    VerificationPopUpComponent,
    UsedEquipmentsPostFormComponent,
    CongratulationPopUpComponent,
    DealsPostFormComponent,
    JobPostFormComponent,
    JobPostFormRecruiterComponent,
    JobsApplicantPreviewComponent,
    RecruiterPreviewComponent,
    ApplicantDetailsComponent,
    RecruiterDetailsComponent,
    FavouritesComponent,
    LoginModalComponent,
    SearchPipe,
    SignUpModalComponent,
    ForgetPasswordModalComponent,
    VerificationModalComponent,
    ResetPasswordModalComponent,
    UsersNavbarComponent,
    UserUpdateModalComponent,
    SkeletonComponent,
    FilterSkeletonComponent,
    RelatedAdsSkeletonComponent,
    PostAdsSkeletonComponent,
    PriceRangeSliderComponent,
    SortPipe,
    SubscriptionPipe,
    SubscriptionSkeletonComponent,
    MyAdsSkeletonComponent,
    MyAdsDetailsComponent,
    FavouriteListsPipe,
    FavouriteSkeletonComponent,
    PrivacyPipe,
    SortSubCatPipe,
    JobsCatPipe,
    ViewpostPipe,
    FilterByPricePipe,
    HomePipe,
    CatLabelPipe,
    DetailsPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    NgSelect2Module,
    NgxSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    NgbModule,
    MatSelectModule,
    MatRadioModule,
    RouterModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    CarouselModule,
    NgSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [
    VerificationPopUpComponent,
    CongratulationPopUpComponent,
    OtpVerifyComponent,
    LoginModalComponent,
    SignUpModalComponent,
    ResetPasswordModalComponent,
    ForgetPasswordModalComponent,
    VerificationModalComponent,
    UserUpdateModalComponent,
    PriceRangeSliderComponent,
  ],
  exports: [PriceRangeSliderComponent],
  providers: [HomeService, RouteGuardService, NgbActiveModal],
  bootstrap: [AppComponent],
})
export class AppModule { }
