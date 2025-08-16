import crypto from 'crypto';

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = new Map();

class OTPService {
  // Generate a 6-digit OTP
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Store OTP with expiration
  storeOTP(phone, userType, otp) {
    const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes
    otpStore.set(`${phone}-${userType}`, {
      otp,
      expiresAt,
      attempts: 0
    });
  }

  // Verify OTP
  verifyOTP(phone, userType, inputOTP) {
    const key = `${phone}-${userType}`;
    const stored = otpStore.get(key);

    if (!stored) {
      return { valid: false, message: 'OTP not found or expired' };
    }

    // Check if OTP is expired
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(key);
      return { valid: false, message: 'OTP has expired' };
    }

    // Check attempts
    if (stored.attempts >= 3) {
      otpStore.delete(key);
      return { valid: false, message: 'Too many attempts. Please request a new OTP' };
    }

    // Increment attempts
    stored.attempts++;

    // Verify OTP
    if (stored.otp === inputOTP) {
      otpStore.delete(key);
      return { valid: true, message: 'OTP verified successfully' };
    } else {
      return { valid: false, message: 'Invalid OTP' };
    }
  }

  // Send OTP (mock implementation - replace with actual SMS service)
  async sendOTP(phone, otp) {
    // In production, integrate with SMS service like Twilio, AWS SNS, etc.
    console.log(`Sending OTP ${otp} to ${phone}`);
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: 'OTP sent successfully' };
  }

  // Check if user exists by phone number
  async checkUserExists(phone, userType) {
    // This would typically query the database
    // For now, return false (user doesn't exist)
    return false;
  }

  // Clean up expired OTPs
  cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [key, value] of otpStore.entries()) {
      if (now > value.expiresAt) {
        otpStore.delete(key);
      }
    }
  }
}

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  otpService.cleanupExpiredOTPs();
}, 5 * 60 * 1000);

export const otpService = new OTPService();
export default otpService;
