const Verify = (req, res, next) => {
  const { cookies } = req;
  console.log(cookies);
  if ("session_id" in cookies) {
    console.log("session ID Exist");
    if (cookies.session_id === "123456") {
      return next();
    } else {
      console.log("Invalid Session Id");
      return res
        .status(403)
        .send({ success: false, msg: "not Authentication" });
    }
  } else {
    console.log("Invalid Session Id");
    return res.status(403).send({ success: false, msg: "not Authentication" });
  }
};

module.exports = Verify;
