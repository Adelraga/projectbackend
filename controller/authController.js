const User = require("../models/User");

const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

module.exports = {
  createUser: async (req, res) => {
    const user = req.body;
    const oldUser = await User.findOne({ email: user.email });
    try {
      if (oldUser) {
        return res.status(400).json({ message: "Email already exist" });
      } else {
        const newUser = new User({
          firstName: user.firstName ?? "anonymous",
          secondName: user.secondName ?? "anonymous",
          email: user.email,
          profile: `http://localhost:3000/uploads/${req.file.filename}`,
          password: CryptoJS.AES.encrypt(
            user.password,
            process.env.SECRET
          ).toString(),
          userType: user.userType,
          gender: user.gender,
          phone: user.phone ?? " ",
          address: user.address ?? " ",
        });
        await newUser.save();
        return res
          .status(201)
          .json({ status: "success", message: "Email created Successfully " });
      }
    } catch (err) {
      return res.status(500).send({ status: "failed", error: err.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      var body = req.body;
      if (!body) {
        return res
          .status(403)
          .send({ auth: false, message: "Please Enter Your Informations !" });
      } else {
        const user = await User.findOne(
          { email: body.email },
          { __v: 0, updatedAt: 0, createdAt: 0 }
        );
        if (!user) {
          return res
            .status(401)
            .json({ message: "wrong credentials, User Not Found !" });
        } else {
          let validPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET
          ).toString(CryptoJS.enc.Utf8);
          if (validPassword !== body.password) {
            return res.status(401).send({
              auth: false,
              token: null,
              message: "wrong credentials , Password Not Found !",
            });
          } else {
            let options = {
              // maxAge: 20 * 60 * 1000, // would expire in 20minutes
              // httpOnly: true, // The cookie is only accessible by the web server
              secure: true,
              sameSite: "None",
            };
            let token = jwt.sign(
              { id: user._id, userType: user.userType, email: user.email },
              process.env.JWT_SEC,
              {
                expiresIn: "21d",
              }
            );

            res.cookie("session_id", "123456");

            const { password, email, ...others } = user._doc;
            return res.status(200).json({
              status: "success",
              message: "Login Successfully ✅",
              // ...others,
              token,
            });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ status: "failed", error: error.message });
    }
  },
  // Logout: async (req, res) => {
  //   try {
  //     const sessionCookie = req.headers["cookie"];
  //     if (!sessionCookie) {
  //       return res.sendStatus(204);
  //     }
  //     const jwtToken = sessionCookie.split("=")[1].split(";")[0];
  //     const isTokenBlacklisted = await Blacklist.findOne({ token: jwtToken });
  //     if (isTokenBlacklisted) {
  //       return res.sendStatus(204);
  //     }
  //     const newBlacklist = new Blacklist({ token: jwtToken });
  //     await newBlacklist.save();
  //     res.setHeader("Clear-Site-Data", '"cookies"');
  //     req.session = null;
  //     req.session.destroy(() => {
  //       req.logout();
  //       res.redirect("/");
  //     });
  //     req.session.loggedIn = false;
  //     res.clearCookie("remember_me");
  //     res.status(200).json({ message: "You are logged out!" });
  //   } catch (error) {
  //     res.status(500).json({
  //       status: "error",
  //       message: "Internal Server Error",
  //     });
  //   }
  // },

  Logout: async (req, res) => {
    res.clearCookie("session_id"); // Clear the cookie named "session_id"
    return res
      .status(200)
      .json({ status: "success", message: "User Logout Successfully" });
  },
};
