import User from "../models/user.js";

const userController = {};

userController.saveUser = async (username, sid) => {
  try {
    let user = await User.findOne({ name: username });
    if (!user) {
      user = new User({ name: username, token: sid, online: true });
    } else {
      user.token = sid;
      user.online = true;
    }
    await user.save();
    console.log("user saved")
    return user;
  } catch (err) {
    return err;
  }
};

userController.checkUser = async (sid) => {


        const whoSent = await User.findOne({token: sid});
        if (!whoSent) throw new Error("user not found", sid);
        return whoSent

}

export default userController;
