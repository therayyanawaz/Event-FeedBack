import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

// Define the User document interface
export interface IUser extends Document {
  email: string;
  name: string;
  hashedPassword: string;
  salt: string;
  role: 'admin' | 'organizer' | 'user';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  setPassword: (password: string) => void;
  validatePassword: (password: string) => boolean;
}

// Define the schema
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'organizer', 'user'],
      default: 'user',
    },
    lastLogin: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Method to set user password
UserSchema.methods.setPassword = function (password: string) {
  // Creating a unique salt for a particular user
  this.salt = crypto.randomBytes(16).toString('hex');
  
  // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
  this.hashedPassword = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

// Method to validate password
UserSchema.methods.validatePassword = function (password: string): boolean {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  
  return this.hashedPassword === hash;
};

// Create and export the model
export const User = mongoose.models && mongoose.models.User
  ? (mongoose.models.User as mongoose.Model<IUser>)
  : mongoose.model<IUser>('User', UserSchema);

export default User; 