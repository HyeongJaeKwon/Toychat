import User from "../models/user.js";

const userController = {};

/**create user or update user token */
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
    console.log("user saved");
    return user;
  } catch (err) {
    throw err;
  }
};

/**get user by socket id */
userController.checkUser = async (sid) => {
  try {
    const whoSent = await User.findOne({ token: sid });
    if (!whoSent) throw new Error("user not found", sid);
    return whoSent;
  } catch (err) {
    throw err;
  }
};

/**update user */
userController.updateUser = async (uid, userdata) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      uid,
      { $set: userdata },
      { new: true }
    );
    return updatedUser;
  } catch (err) {
    throw err;
  }
};

/**delete user */
userController.deleteUser = async (uid) => {
  try {
    await User.findByIdAndDelete(uid);
    return "deleted";
  } catch (err) {
    throw err;
  }
};


/** get all users */
userController.getAllUsers = async () => {
  try {
    const list = await User.find({});
    return list;
  } catch (err) {
    throw err;
  }
};

export default userController;
