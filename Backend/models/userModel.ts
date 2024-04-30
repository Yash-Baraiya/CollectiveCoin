import { Schema, model } from "mongoose";
import validator from "validator";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { UserIn } from "../interface/userInterface";

const userSchema = new Schema<UserIn>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "admin",
  },
  isEarning: {
    type: Boolean,
    required: [true, "Please provide earning status"],
    default: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,

    minlength: 8,
    select: false,
  },
  familycode: {
    type: String,
    required: [
      true,
      "You have to enter code to share account with your family",
    ],
    minlength: 5,
    maxlength: 5,
  },
  deleteduser: {
    type: [String],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  forgotpasswordotp: String,
  priority: Number,
});

//method for resetting the  user's password
userSchema.pre<UserIn>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

//method for matching the passwords and letting user login
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//method for creating the passwoord reset token
userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  console.log(this.passwordResetExpires);

  return resetToken;
};

const User = model<UserIn>("User", userSchema);
export default User;
