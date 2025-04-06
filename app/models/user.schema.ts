export const runtime = 'nodejs';

import type { Document, Model, Schema as SchemaType } from 'mongoose';
import crypto from 'crypto';
import { getMongoose } from '../utils/database';

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

let UserModel: Model<IUser> | null = null;

// Function to get or create the User model
export async function getUserModel(): Promise<Model<IUser>> {
  if (UserModel) return UserModel;
  
  // Get mongoose instance
  const mongoose = await getMongoose();
  
  // Define the schema
  const UserSchema: SchemaType = new mongoose.Schema(
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

  // Create and return the model
  UserModel = mongoose.models && mongoose.models.User
    ? (mongoose.models.User as Model<IUser>)
    : mongoose.model<IUser>('User', UserSchema);
    
  return UserModel;
}

// Export a proxy object for backward compatibility
const User = new Proxy({} as Model<IUser>, {
  get: function(target, prop) {
    // Return a function that will resolve the model first
    if (typeof prop === 'string' || typeof prop === 'symbol') {
      return (...args: any[]) => {
        return getUserModel().then(model => {
          const value = (model as any)[prop];
          if (typeof value === 'function') {
            return value.apply(model, args);
          }
          return value;
        });
      };
    }
    return undefined;
  }
});

export { User };
export default User; 