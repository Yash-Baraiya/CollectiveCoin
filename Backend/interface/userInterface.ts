import { Document } from "mongoose";
export interface UserIn extends Document {
  name: string;
  email: string;
  photo: string;
  role: "user" | "admin";
  isEarning: boolean;
  password: string;
  passwordConfirm: string;
  familycode: string;
  deleteduser: any[];
  permittedadmin: any[];
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  forgotpasswordotp?: string;
  loggedInAt?: Date;

  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}
