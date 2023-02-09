import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Custom Imports
import UserModel from "../models/user.js";

const secret = "test";

// Controller for Sign In
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist!" });

    // Password Check
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        email: oldUser.email,
        id: oldUser._id,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
    console.log(error);
  }
};

// Controller for Sign Up
export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Protect password
    const hashPassword = await bcrypt.hash(password, 12);

    const result = await UserModel.create({
      email,
      password: hashPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
    console.log(error);
  }
};

export const googleSignIn = async (req, res) => {
  const { email, name, token, googleId } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      const result = { _id: oldUser._id.toString(), email, name };
      return res.status(200).json({ result, token });
    }

    const result = await UserModel.create({
      email,
      name,
      googleId,
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
