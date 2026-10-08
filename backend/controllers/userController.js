const User = require("../models/User");
const AdminNotification = require("../models/AdminNotification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  uploadProfileImage,
  deleteProfileImage,
  isCloudinaryConfigured,
} = require("../config/cloudinary");

// ==================================================
// EMAIL CONFIGURATION
// ==================================================

const isValidGmailConfig = () => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  return Boolean(
    emailUser &&
      emailPass &&
      !emailUser.includes("yourgmail") &&
      !emailPass.includes("your_gmail_app_password")
  );
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==================================================
// REGISTER USER
// ==================================================

const registerUser = async (req, res) => {
  try {
    if (req.file && !isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Profile image upload is not configured. Add Cloudinary credentials to backend/.env and restart the backend.",
      });
    }

    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const existingPhone = await User.findOne({
      phone: phone.trim(),
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uploadedImage = req.file
      ? await uploadProfileImage(req.file.buffer)
      : null;
    let user;

    try {
      user = await User.create({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: hashedPassword,
        profileImage: uploadedImage?.url || "",
        profileImagePublicId: uploadedImage?.publicId || "",
      });
    } catch (error) {
      if (uploadedImage) {
        try {
          await deleteProfileImage(uploadedImage.publicId);
        } catch (cleanupError) {
          console.error("Remove unclaimed registration image failed:", cleanupError);
        }
      }
      throw error;
    }

    try {
      await AdminNotification.create({
        type: "registration",
        referenceId: String(user._id),
        data: {
          userId: String(user._id),
          name: user.fullName,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (notificationError) {
      console.error("Create user registration notification failed:", notificationError);
    }

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please sign in.",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (req.file && error.http_code) {
      return res.status(502).json({
        success: false,
        message: "Cloudinary could not upload your profile image. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==================================================
// LOGIN USER
// ==================================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==================================================
// UPDATE USER PROFILE IMAGE
// ==================================================

const updateProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Choose a profile image to upload",
    });
  }

  if (!isCloudinaryConfigured()) {
    return res.status(503).json({
      success: false,
      message: "Profile image upload is not configured. Add Cloudinary credentials to backend/.env and restart the backend.",
    });
  }

  let uploadedImage;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    uploadedImage = await uploadProfileImage(req.file.buffer);
    const previousImagePublicId = user.profileImagePublicId;
    user.profileImage = uploadedImage.url;
    user.profileImagePublicId = uploadedImage.publicId;

    try {
      await user.save();
    } catch (error) {
      try {
        await deleteProfileImage(uploadedImage.publicId);
      } catch (cleanupError) {
        console.error("Remove unclaimed profile image failed:", cleanupError);
      }
      throw error;
    }

    if (previousImagePublicId) {
      try {
        await deleteProfileImage(previousImagePublicId);
      } catch (error) {
        console.error("Remove previous profile image failed:", error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update Profile Image Error:", error);

    if (error.http_code) {
      return res.status(502).json({
        success: false,
        message: "Cloudinary could not upload your profile image. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile image",
    });
  }
};

// ==================================================
// FORGOT PASSWORD - SEND OTP
// ==================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;

    await user.save();

    if (!isValidGmailConfig()) {
      return res.status(500).json({
        success: false,
        message:
          "Email service is not configured. Add your real Gmail address and App Password in backend/.env.",
      });
    }

    await transporter.verify();

    const mailOptions = {
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "ShopEase - Password Reset OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2 style="text-align:center;">
            ShopEase Password Reset
          </h2>

          <p>Hello ${user.fullName},</p>

          <p>
            We received a request to reset your ShopEase account password.
          </p>

          <p>
            Your One-Time Password (OTP) is:
          </p>

          <div style="
            text-align:center;
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            margin:25px 0;
          ">
            ${otp}
          </div>

          <p>
            This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

          <br>

          <p>
            Regards,<br>
            <strong>ShopEase Team</strong>
          </p>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// ==================================================
// VERIFY OTP
// ==================================================

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      !user.resetOtpExpiry ||
      user.resetOtpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==================================================
// RESET PASSWORD
// ==================================================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      !user.resetOtpExpiry ||
      user.resetOtpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==================================================
// GET ALL USERS - ADMIN
// ==================================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -resetOtp -resetOtpExpiry -profileImagePublicId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ==================================================
// DELETE USER - ADMIN
// ==================================================

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// ==================================================
// EXPORT
// ==================================================

module.exports = {
  registerUser,
  loginUser,
  updateProfileImage,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUsers,
  deleteUser,
};
