const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const nodemailer = require("nodemailer");
// get all
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi khi lấy danh sách người dùng",
      error: error.message 
    });
  }
});

// register
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng điền đầy đủ thông tin đăng ký" 
      });
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Email không hợp lệ" 
      });
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu phải có ít nhất 8 ký tự" 
      });
    }

    // Kiểm tra mật khẩu có chứa số và ký tự đặc biệt
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt" 
      });
    }

    // Kiểm tra nếu đã tồn tại user
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      if (existingUser.name === name) {
        return res.status(400).json({ 
          success: false,
          message: "Tên đăng nhập đã tồn tại" 
        });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ 
          success: false,
          message: "Email đã được sử dụng" 
        });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng"
      });
    }
    res.status(500).json({ 
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
      error: error.message 
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng nhập đầy đủ email và mật khẩu" 
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ email });

    // Kiểm tra nếu user không tồn tại hoặc sai mật khẩu
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Sai tên đăng nhập hoặc mật khẩu"
      });
    }

    // So sánh password đã hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Sai tên đăng nhập hoặc mật khẩu"
      });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // token hết hạn sau 1 ngày
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
      error: error.message 
    });
  }
});

// get user info
router.get("/info", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // bỏ password
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update user info
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng điền đầy đủ thông tin cần cập nhật" 
      });
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Email không hợp lệ" 
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false,
        message: "Email đã được sử dụng bởi tài khoản khác" 
      });
    }

    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy người dùng" 
      });
    }

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
      error: err.message 
    });
  }
});

// change password
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng điền đầy đủ mật khẩu cũ và mới" 
      });
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu mới phải có ít nhất 8 ký tự" 
      });
    }

    // Kiểm tra mật khẩu mới có chứa số và ký tự đặc biệt
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu mới phải chứa ít nhất 1 số và 1 ký tự đặc biệt" 
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy người dùng" 
      });
    }

    // Kiểm tra mật khẩu cũ
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu cũ không đúng" 
      });
    }

    // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu mới không được trùng với mật khẩu cũ" 
      });
    }

    // Hash mật khẩu mới
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu mới
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedNewPassword },
      { new: true }
    );

    res.json({
      success: true,
      message: "Cập nhật mật khẩu thành công",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
      error: err.message 
    });
  }
});

// forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email" });
    }
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email không tồn tại" });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();
    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Mã OTP để đặt lại mật khẩu",
      text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP đã được gửi đến email của bạn" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi gửi OTP", error: error.message });
  }
});

// verify-otp
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email và OTP" });
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email không tồn tại" });
    }
    // Check if the OTP is correct
    if (parseInt(user.resetOtp) !== parseInt(otp)) {
      return res.status(400).json({ success: false, message: "OTP không hợp lệ" });
    }
    // Check if the OTP has expired
    if (Date.now() > user.resetOtpExpires) {
      return res.status(400).json({ success: false, message: "OTP đã hết hạn" });
    }
    res.status(200).json({ success: true, message: "OTP hợp lệ" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xác thực OTP", error: error.message });
  }
});

// reset-password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ email, OTP và mật khẩu mới" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới phải có ít nhất 8 ký tự" });
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email không tồn tại" });
    }
    // Check if the OTP is correct
    if (parseInt(user.resetOtp) !== parseInt(otp)) {
      return res.status(400).json({ success: false, message: "OTP không hợp lệ" });
    }
    // Check if the OTP has expired
    if (Date.now() > user.resetOtpExpires) {
      return res.status(400).json({ success: false, message: "OTP đã hết hạn" });
    }
    // Hash the new password
    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    // Clear the OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    // Save the updated user
    await user.save();
    res.status(200).json({ success: true, message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi đặt lại mật khẩu", error: error.message });
  }
});
module.exports = router;
