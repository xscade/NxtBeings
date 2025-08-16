import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: 'nxtbeings@xscade.com' },
        { username: 'nxtbeings' }
      ]
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Create new admin user
    const adminData = {
      firstName: 'NxtBeings',
      lastName: 'Admin',
      email: 'nxtbeings@xscade.com',
      username: 'nxtbeings',
      password: 'ce5xz23v4h@Nxt',
      role: 'super_admin',
      permissions: {
        canManageUsers: true,
        canModerateContent: true,
        canViewAnalytics: true,
        canManageSystem: true,
        canManageAdmins: true
      },
      isActive: true,
      isVerified: true
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    console.log('🔑 Role:', admin.role);
    console.log('🔐 Password: ce5xz23v4h@Nxt');
    console.log('\n🚀 You can now login to the admin dashboard');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createAdmin();
  await mongoose.disconnect();
  console.log('✅ Script completed');
  process.exit(0);
};

run();
