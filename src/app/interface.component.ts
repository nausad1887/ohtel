// for signUp
export interface SignUpData {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userCountryCode: string;
  userMobile: string;
  userPassword: string;
  languageID: string;
  userProfilePicture: string;
}
// for sign in
export interface SignInData {
  emailOrMobileNumber: string;
  password: string;
  languageID: string;
}

// reset password
export interface ResetPassword {
  userID: string;
  newPassword: string;
  languageID: number;
}

// forget password
export interface ForgetPassword {
  email: string;
  languageID: number;
  mobileNumber: number;
}

// password update
export interface PasswordUpdate {
  userID: string;
  currentPassword: string;
  newPassword: string;
  languageID: number;
}

// update user data
export interface UpdateUserData {
  languageID: number;
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: number;
  userProfilePicture: string;
}

// get post data
export interface GetPostData {
  userID: string;
  categoryID: string;
  cityID: string;
  subcategoryID: string;
}

// space-post form
// tslint:disable-next-line: class-name
export interface spacePostAdFormData {
  languageID: number;
  loginuserID: string;
  postType: string;
  categoryID: number;
  categorytypeID: number;
  subcategoryID: number;
  postTitle: string;
  postDescription: string;
  cityID: number;
  postMobile: number;
  postEmail: string;
  postModeOfContact: string;
  postImage: string;
  packageID: number;
  postotherOragnisation: string;
  zipID: number;
  postotherPrice: number;
  packagedetailID: number;
  packagedetailFees: number;
  postAlternateNo: number;
  postotherLocation: number;
  postotherArea: string;
  postStartDate: string;
  postEndDate: string;
  postotherContactPerson: string;
  postLatitude: string;
  postLongitude: string;
}

// usedEquipmentPostFormData
// tslint:disable-next-line: class-name
export interface usedEquipmentPostFormData {
  languageID: number;
  loginuserID: string;
  postType: string;
  categoryID: number;
  categorytypeID: number;
  subcategoryID: number;
  postTitle: string;
  postDescription: string;
  cityID: number;
  postMobile: number;
  postEmail: string;
  postModeOfContact: string;
  postImage: string;
  packageID: number;
  postotherOragnisation: string;
  zipID: number;
  postotherPrice: number;
  packagedetailID: number;
  packagedetailFees: number;
  postAlternateNo: number;
  postotherLocation: number;
  postotherArea: string;
  postStartDate: string;
  postEndDate: string;
  postotherContactPerson: string;
  postLatitude: string;
  postLongitude: string;
}

// tslint:disable-next-line: class-name
export interface jobs {
  languageID: number;
  postLevel: string;
  loginuserID: string;
  postType: string;
  categoryID: number;
  categorytypeID: number;
  subcategoryID: number;
  postTitle: string;
  postDescription: string;
  cityID: string;
  postMobile: number;
  postEmail: string;
  postModeOfContact: string;
  postImage: string;
  packageID: string;
  packagedetailID: string;
  packagedetailFees: string;
  postAlternateNo: number;
  postotherArea: string;
  postotherFirstName: string;
  postotherLastName: string;
  postotherJobRole: string;
  postotherYearExp: number;
  educationID: number;
  experianceID: number;
  postotherSalary: number;
  postotherIndia: string;
  postotherAbroad: string;
  postotherResume: any;
  postotherLocation: number;
  postStartDate: string;
  postEndDate: string;
  postLatitude: string;
  postLongitude: string;
}

// tslint:disable-next-line: class-name
export interface jobsRecruiter {
  languageID: number;
  postLevel: string;
  loginuserID: string;
  postType: string;
  categoryID: number;
  categorytypeID: number;
  subcategoryID: number;
  postTitle: string;
  postDescription: string;
  cityID: number;
  zipID: '';
  postMobile: number;
  postEmail: string;
  postModeOfContact: string;
  postotherOragnisation: '';
  postImage: string;
  packageID: number;
  packagedetailID: number;
  packagedetailFees: number;
  postAlternateNo: number;
  postotherArea: string;
  postotherLocation: number;
  postotherInterviewTime: string;
  postotherInterviewState: string;
  postotherInterviewzip: string;
  postotherInterviewCity: string;
  postotherInterviewHouse: string;
  postotherInterviewLandmark: string;
  postotherInterviewAddressDetail: string;
  postotherInterviewDate: string;
  postotherInterviewAdd: string;
  postStartDate: string;
  postEndDate: string;
  postotherContactPerson: string;
  postLatitude: string;
  postLongitude: string;
}

// deals form
// tslint:disable-next-line: class-name
export interface dealsPostAdFormData {
  languageID: number;
  loginuserID: string;
  postType: string;
  categoryID: number;
  categorytypeID: number;
  subcategoryID: number;
  postTitle: string;
  postDescription: string;
  cityID: number;
  postMobile: number;
  postEmail: string;
  postModeOfContact: string;
  postImage: string;
  packageID: number;
  postotherOragnisation: string;
  zipID: number;
  postotherPrice: number;
  packagedetailID: number;
  packagedetailFees: number;
  postAlternateNo: number;
  postotherLocation: number;
  postotherArea: string;
  postStartDate: string;
  postEndDate: string;
  postotherContactPerson: string;
}
//upload file data
export interface uploadFileData {
  file: File;
  fileName: string;
  filePath: number;
  userID: number;
}

// getPackageDetails
export interface getPackageData {
  languageID: number;
  loginuserID: string;
  subcatID: number;
  categoryID: number;
}

// email-verification-data
export interface emailVarificationData {
  languageID: number;
  loginuserID: string;
  postID: number;
  postEmail: string;
}

// contact number verification data
export interface contactNumberVerificationData {
  languageID: number;
  loginuserID: string;
  postID: number;
  postMobile: number;
}

// contact number verification data
export interface alternateNumberVerificationData {
  languageID: number;
  loginuserID: string;
  postID: number;
  postAlternateNo: number;
}

// contact number verification data
export interface contactNumberVerificationDataWithOtp {
  languageID: number;
  loginuserID: string;
  postID: number;
  postMobile: number;
  postMobileOTP: number;
}
// contact number verification data
export interface alternateNumberVerificationDataWithOtp {
  languageID: number;
  loginuserID: string;
  postID: number;
  postAlternateNo: number;
  postAlternateNoOTP: number;
}
// contact number verification data
export interface emailVerificationDataWithOtp {
  languageID: number;
  loginuserID: any;
  postID: number;
  postEmail: number;
  postEmailOTP: number;
}
