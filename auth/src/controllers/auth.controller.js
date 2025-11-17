import usermodel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { publishToQueue } from "../broker/rabbit.js";

export const register = async (req, res) => {
  const {
    email,
    password,
    fullName: { firstName, lastName },
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new usermodel({
      email,
      password: hashedPassword,
      fullName: {
        firstName,
        lastName,
      },
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      config.jwtSecret,
      { expiresIn: "2d" }
    );

    await publishToQueue("user_registered", {
      userId: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
    });

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName.firstName,
        lastName: newUser.fullName.lastName,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    } 
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: "2d" }
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName.firstName,
        lastName: user.fullName.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const googleAuthCallback = async (req, res) => {
  try {
    // Successful authentication, generate a JWT for the user
    const user = req.user; // The authenticated user profile from Google
    console.log(user);

    const isUserAlreadyExists = await usermodel.findOne({
      $or: [{ email: user.emails[0].value }, { googleId: user.id }],
    });

    if (isUserAlreadyExists) {
      // User already exists, proceed to generate JWT
      const token = jwt.sign(
        { id: isUserAlreadyExists._id, role: isUserAlreadyExists.role },
        config.jwtSecret,
        { expiresIn: "2d" }
      );

      await publishToQueue("user_registered", {
        userId: isUserAlreadyExists._id,
        email: isUserAlreadyExists.email,
        fullName: isUserAlreadyExists.fullName,
        role: isUserAlreadyExists.role,
      });
      res.cookie("token", token);
      return res.redirect("http://localhost:5173");
    }
    if (!isUserAlreadyExists) {
      // New user, create an account
      const newUser = new usermodel({
        googleId: user.id,
        email: user.emails[0].value,
        fullName: {
          firstName: user.name.givenName,
          lastName: user.name.familyName,
        },
      });
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        config.jwtSecret,
        { expiresIn: "2d" }
      );

      res.cookie("token", token);

      await newUser.save();

      return res.redirect("http://localhost:5173");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
