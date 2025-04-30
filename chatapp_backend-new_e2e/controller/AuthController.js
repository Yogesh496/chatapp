const bcrypt = require('bcryptjs');
const Credential = require("../model/credential");
const generateToken = require("../config/utils");
const cloudinary = require("../config/cloudinary.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");  


dotenv.config();


const register = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;

  try {
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    
    const user = await Credential.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    
    const newUser = new Credential({
      fullName,
      email,
      password: hashedPassword,
      profilePic: profilePic || "",
      publicKey, 
      privateKey, 
    });

    
    if (newUser) {
      
      generateToken(newUser._id, res);

      
      await newUser.save();

      
      res.status(201).json({
        message: "User registered successfully",  
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        publicKey: newUser.publicKey,
        privateKey 
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Credential.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    const token = generateToken(user._id, res); 

    
    res.status(200).json({
      message: "Logged in successfully",
      token: token, 
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic || "",
        privateKey: user.privateKey
      }
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, fullName, profilePic } = req.body;
    const userId = req.user._id; 

    
    const updateFields = {};

    
    if (profilePic) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
          folder: "user_profile_pics", 
          transformation: [{ width: 150, height: 150, crop: "fill" }], 
        });
        updateFields.profilePic = uploadResponse.secure_url; 
      } catch (cloudinaryError) {
        return res.status(500).json({ message: "Error uploading profile picture", error: cloudinaryError.message });
      }
    }

    
    if (email) {
      updateFields.email = email;
    }

    if (fullName) {
      updateFields.fullName = fullName;
    }

    
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    
    const updatedUser = await Credential.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
}

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCurrentUser = async (req, res) => {
  const user = await Credential.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Credential.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User with this email does not exist" });
    }

    
    const resetCode = String(crypto.randomInt(100000, 1000000));

    
    const hashedResetCode = await bcrypt.hash(resetCode, 10);

    
    user.resetCode = hashedResetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    });

    res.status(200).json({ message: "Reset code sent to your email" });

  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const verifyResetCode = async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    
    const user = await Credential.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    
    if (!user.resetCode || !user.resetCodeExpires || Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    
    const isMatch = await bcrypt.compare(resetCode, user.resetCode);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    res.status(200).json({ message: "Reset code verified successfully. You can now reset your password." });
  } catch (error) {
    console.error("Error in verifyResetCode:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await Credential.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfileApp = async (req, res) => {
  try {
    const { email, fullName } = req.body;
    const userId = req.user._id; 

    
    const updateFields = {};

    
    if (req.file) {
      updateFields.profilePic = req.file.filename; 
    }

    
    if (email) {
      updateFields.email = email;
    }

    
    if (fullName) {
      updateFields.fullName = fullName;
    }

    
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    
    const updatedUser = await Credential.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


module.exports = {
  register,
  login,
  logout,
  checkAuth,
  updateProfile,
  uploadImage,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyResetCode,
  updateProfileApp
};
