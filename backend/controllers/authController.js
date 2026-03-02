const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const AuthOTP = require('../models/AuthOTP');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Register user & send OTP
// @route   POST /api/v1/auth/register
exports.register = async (req, res) => {
  const { name, edu_email, password } = req.body;

  try {
    if (!edu_email.endsWith('@adityauniversity.in')) {
      return res.status(400).json({ success: false, message: 'Must use an @adityauniversity.in email' });
    }

    let user = await User.findOne({ edu_email });
    if (user && user.email_verified) {
      return res.status(400).json({ success: false, message: 'User already exists and verified' });
    }

    const otp = generateOTP();
    const otp_hash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await AuthOTP.findOneAndUpdate(
      { email: edu_email },
      { otp_hash, expiresAt },
      { upsert: true, new: true }
    );

    if (!user) {
      const password_hash = await bcrypt.hash(password, 12);
      user = new User({ name, edu_email, password_hash });
      await user.save();
    } else {
      // Update password if registering again before verifying
      user.password_hash = await bcrypt.hash(password, 12);
      user.name = name;
      await user.save();
    }

    // TODO: Send via Nodemailer. For now, log it.
    console.log(`[DEV ONLY] OTP for ${edu_email} is ${otp}`);

    res.status(200).json({ success: true, message: 'OTP sent to email. Please verify.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Verify OTP
// @route   POST /api/v1/auth/verify
exports.verifyOTP = async (req, res) => {
  const { edu_email, otp } = req.body;

  try {
    const authOtpReq = await AuthOTP.findOne({ email: edu_email });
    if (!authOtpReq) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const isMatch = await bcrypt.compare(otp, authOtpReq.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const user = await User.findOneAndUpdate(
      { edu_email },
      { email_verified: true },
      { new: true }
    );

    await AuthOTP.deleteOne({ email: edu_email });

    res.status(200).json({ success: true, message: 'Email verified successfully. You can now login.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Login user & get token
// @route   POST /api/v1/auth/login
exports.login = async (req, res) => {
  const { edu_email, password } = req.body;

  try {
    const user = await User.findOne({ edu_email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.email_verified) {
      return res.status(403).json({ success: false, message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ success: true, token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
