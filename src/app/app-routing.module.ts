import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DealsComponent } from './deals/deals.component';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { SpacesListComponent } from './spaces-list/spaces-list.component';
import { UsedEquipmentComponent } from './used-equipment/used-equipment.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyAdsComponent } from './my-ads/my-ads.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { NotificationComponent } from './notification/notification.component';
import { PostAdsComponent } from './post-ads/post-ads.component';
import { RouteGuardService } from './route-guard.service';
import { DetailsComponent } from './details/details.component';
import { SpacesPostAdsFormComponent } from './spaces-post-ads-form/spaces-post-ads-form.component';
import { PreviewComponent } from './preview/preview.component';
import { PaymentComponent } from './payment/payment.component';
import { UsedEquipmentsPostFormComponent } from './used-equipments-post-form/used-equipments-post-form.component';
import { DealsPostFormComponent } from './deals-post-form/deals-post-form.component';
import { JobPostFormComponent } from './job-post-form-applicant/job-post-form.component';
import { JobsApplicantPreviewComponent } from './jobs-applicant-preview/jobs-applicant-preview.component';
import { JobPostFormRecruiterComponent } from './job-post-form-recruiter/job-post-form-recruiter.component';
import { RecruiterPreviewComponent } from './jobs-recruiter-preview/recruiter-preview.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { RecruiterDetailsComponent } from './recruiter-details/recruiter-details.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { MyAdsDetailsComponent } from './my-ads-details/my-ads-details.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'AboutUs', component: AboutUsComponent },
  { path: 'ContactUs', component: ContactUsComponent },
  { path: 'Terms-And-Condition', component: TermsAndConditionComponent },
  { path: 'Privacy-Policy', component: PrivacyPolicyComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'Deals/:dealsID', component: DealsComponent },
  { path: 'Spaces/:spaceID', component: SpacesListComponent },
  {
    path: 'Used-Equipments/:usedEquipmentsID',
    component: UsedEquipmentComponent,
  },
  { path: 'Jobs/:jobsID', component: JobsListComponent },
  {
    path: 'my-account',
    component: MyAccountComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'my-ads',
    component: MyAdsComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
    canActivate: [RouteGuardService],
  },
  { path: 'notification', component: NotificationComponent },
  {
    path: 'post-ads',
    component: PostAdsComponent,
  },
  { path: 'post-details', component: DetailsComponent },
  { path: 'ads-details', component: MyAdsDetailsComponent, canActivate: [RouteGuardService] },
  {
    path: 'post-form',
    component: SpacesPostAdsFormComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'review-ad',
    component: PreviewComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'used-equipment-form',
    component: UsedEquipmentsPostFormComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'deals-form',
    component: DealsPostFormComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'job-post',
    component: JobPostFormComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'applicant-preview',
    component: JobsApplicantPreviewComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'jobs-recruiter-form',
    component: JobPostFormRecruiterComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'recruiter-preview',
    component: RecruiterPreviewComponent,
    canActivate: [RouteGuardService],
  },
  { path: 'applicant-details', component: ApplicantDetailsComponent },
  { path: 'recruiter-details', component: RecruiterDetailsComponent },
  {
    path: 'favourites',
    component: FavouritesComponent,
    canActivate: [RouteGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
