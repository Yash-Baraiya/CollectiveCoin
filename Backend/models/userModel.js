const { default: mongoose, Schema } = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Income = require("./../models/incomeModel");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: [true, "user with this email already exist"],
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
    required: [true, "please provide earning status"],
    default: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  familycode: {
    type: String,
    required: [true, "you have to enter code to share accout with your family"],
    minlength: 5,
    maxlength: 5,
  },
  deleteduser: {
    type: Array,
  },
  //   passwordConfirm: {
  //     type: String,
  //     required: [true, "Please confirm your password"],
  //     validate: {
  //       // This only works on CREATE and SAVE!!!
  //       validator: function (el) {
  //         return el === this.password;
  //       },
  //       message: "Passwords are not the same!",
  //     },
  //   },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  //   active: {
  //     type: Boolean,
  //     default: true,
  //     select: false,
  //   },
});
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// userSchema.pre("find", async function (next) {
//   console.log("thisroute is also being called");
//   const userPromises = this.users.map(async () => await User.find());
//   this.users = await Promise.all(userPromises);
//   next();
// });

// userSchema.pre("find", function () {
//   console.log("this route is being called");
//   this.populate("users");
// });

// userSchema.pre("save", async function (next) {
//   console.log("This route is getting called");
//   await this.populate("incomes").execPopulate(); // Populate incomes directly
//   next();
// });

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "incomes",
//   });
//   next();
// });
// });

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "users",
//     select: "-__v -passwordChangedAt",
//   });

//   next();
// });

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
