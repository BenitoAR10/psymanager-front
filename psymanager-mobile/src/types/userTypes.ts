export interface UserProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  identityGender: string;
  address: string;
  ciNumber: string;
}

export interface UserProfileUpdateDto {
  phoneNumber: string;
  address: string;
  identityGender: string;
}
