const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAccessToken, createRefreshToken } = require('../middleware/token');

const userCtrl = {
  register: async (req, res) => {
    try {
      // res.json("register called")

      const user = req.body;

      const passHash = await bcrypt.hash(user.password, 10);

      const newUser = {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        password: passHash,
      };
      const data = await User(newUser);

      await data.save();

      res.status(200).json({ msg: "user registered successfully" });
    } catch (err) {
      return res.status(500).json(err.messege);
    }
  },
 login: async (req, res) => {
    try {
      // res.json("login called");
      const user = req.body;

      const extUser = await User.findOne({ email: user.email });
      if (!extUser) return res.status(400).json({ msg: "user doesn't exsist" });

      const isMatch = await bcrypt.compare(user.password, extUser.password);
      if (!isMatch)
        return res.status(400).json({ msg: "password doesn't match" });

      const accessToken = createAccessToken({ id: extUser._id });
      const refreshToken = createRefreshToken({ id: extUser._id });

      res.cookie("refToken", refreshToken, {
        httpOnly: true,
        path: "/api/auth/refToken",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });

      // res.json({ data: extUser });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
  logout: async (req, res) => {
    try {
      //res.json("logout called");
      res.clearCookie("refToken", { path: "/api/auth/refToken" });
      return res.status(200).json({ msg: "logout successfull" });
    } catch (err) {
      return res.status(500).json(err.messege);
    }
  },
  refreshToken: async (req, res) => {
    try {
      //res.json("refreshToken called");
      const rf_token = req.cookies.refToken;
      if (!rf_token)
        return res.status(400).json({ msg: "need to login again" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "session expired, login again" });
        const accessToken = createAccessToken({ id: user.id });
        res.json({ accessToken });
      });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
  getUser: async (req, res) => {
    try {
      //res.json("getUser called");
      const user = await User.findById(req.user.id).select('-password')
      if(!user)
        return res.status(400).json({msg: "user dosen't exists"})

        res.json(user)
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
};

module.exports = userCtrl;
