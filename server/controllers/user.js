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

/** ADD/DELETE FREIND */
userController.addFriend = async (myuid, otheruid) => {
  try {
    const myuser = await User.findByIdAndUpdate(
      myuid,
      { $push: { friends: otheruid } },
      { new: true }
    );
    const otheruser = await User.findByIdAndUpdate(
      otheruid,
      { $push: { friends: myuid } },
      { new: true }
    );
    return { myuser, otheruser };
  } catch (err) {
    throw err;
  }
};

userController.deleteFriend = async (myuid, otheruid) => {
  try {
    const myuser = await User.findByIdAndUpdate(
      myuid,
      { $pull: { friends: otheruid } },
      { new: true }
    );
    const otheruser = await User.findByIdAndUpdate(
      otheruid,
      { $pull: { friends: myuid } },
      { new: true }
    );
    return { myuser, otheruser };
  } catch (err) {
    throw err;
  }
};

/** ADD/DELETE PENDING */
userController.addPending = async (myuid, otheruid) => {
  try {
    const myuser = await User.findByIdAndUpdate(
      myuid,
      { $push: { pending: { id: otheruid, out: true } } },
      { new: true }
    );
    const otheruser = await User.findByIdAndUpdate(
      otheruid,
      { $push: { pending: { id: myuid, out: false } } },
      { new: true }
    );
    return { myuser, otheruser };
  } catch (err) {
    throw err;
  }
};

userController.deletePending = async (myuid, otheruid) => {
  try {
    const myuser = await User.findByIdAndUpdate(
      myuid,
      { $pull: { pending: { id: otheruid } } },
      { new: true }
    );
    const otheruser = await User.findByIdAndUpdate(
      otheruid,
      { $pull: { pending: { id: myuid } } },
      { new: true }
    );
    return { myuser, otheruser };
  } catch (err) {
    throw err;
  }
};

/** ADD/DELETE BLOCKED */
userController.addBlocked = async (myuid, otheruid) => {
  try {
    await userController.deleteFriend(myuid, otheruid )
    const myuser = await User.findByIdAndUpdate(
      myuid,
      { $push: { blocked: otheruid } },
      { new: true }
    );
    return myuser;
  } catch (err) {
    throw err;
  }
};

userController.deleteBlocked = async (myuid, otheruid) => {
  try {
    const myuser = await User.findByIdAndUpdate(
      myuid,
      { $pull: { blocked: otheruid } },
      { new: true }
    );

    return myuser;
  } catch (err) {
    throw err;
  }
};

/** ADD Friend By Name */
userController.addPendingByName = async (myuid, othername) => {
  try {
    const other = await User.findOne({ name: othername });



    if (
      other._id.toString() === myuid.toString() ||
      other.friends.some((each) => {
        return each.toString() === myuid.toString();
      })
    )
      throw new Error("you already friend");

    if(other.pending.some((each) => {
      return each.id.toString() === myuid.toString();
    }))throw new Error("you already pending");

    const myuser = await User.findByIdAndUpdate(
      myuid,
      { $push: { pending: { id: other._id, out: true } } },
      { new: true }
    );
    console.log("d")
    const otheruser = await User.findByIdAndUpdate(
      other._id,
      { $push: { pending: { id: myuid, out: false } } },
      { new: true }
    );
    console.log("d")
    return { myuser, otheruser };
  } catch (err) {
    throw err;
  }
};

export default userController;
