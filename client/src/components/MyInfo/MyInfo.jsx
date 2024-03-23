import React, { useContext } from "react";
import "./MyInfo.css";
// import { BsCameraVideoFill } from "react-icons/bs";
// import { BsCameraVideoOffFill } from "react-icons/bs";
// import { IoRocketSharp } from "react-icons/io5";
// import { MdScreenShare } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
// import { ImPhoneHangUp } from "react-icons/im";
import { IoIosSettings } from "react-icons/io";
import { TbHeadphonesOff } from "react-icons/tb";
import { TbHeadphonesFilled } from "react-icons/tb";
import { CallContext } from "../../context/CallContext";

const MyInfo = ({ user }) => {
  const {
    micMuted,
    camMuted,
    audioTrack,
    videoTrack,
    users,
    client,
    dispatch,
  } = useContext(CallContext);

  const arr = [
    {
      icon: !micMuted ? (
        <FaMicrophone style={{ width: "20px", height: "20px" }} />
      ) : (
        <FaMicrophoneSlash style={{ width: "40px" }} />
      ),
      function: () => {
        dispatch({ type: "HANDLE_MIC" });
      },
      style: !micMuted ? {} : { color: "red" },
    },
    {
      icon: <TbHeadphonesOff style={{ width: "23px", height: "23px" }} />,
      function: () => {
        if (videoTrack !== null) {
          dispatch({ type: "HANDLE_CAMERA" });
        }
      },
      style: !camMuted ? {} : { color: "red" },
    },
    {
      icon: <IoIosSettings style={{ width: "22px", height: "22px" }} />,
      function: () => {},
      style: {},
    },
    // style: !camMuted ? { backgroundColor: "white", color: "black" } : {},
  ];

  return (
    <div className="miContainer">
      <div className="miMe">
        <div className="miProfile">
          <div className="img">
            <img src={"/profile.jpeg"}></img>
            <div
              className={
                user
                  ? user.online
                    ? "miStatusOn"
                    : "miStatusOff"
                  : "miStatusOff"
              }
            />
          </div>
        </div>
        <div className="miStatus">
          <div className="miUserName">{user ? user.name : "Chat User"}</div>

          <div className="miStatusWord">
            {user ? (user.online ? "Online" : "Offline") : "Offline"}
          </div>
        </div>
      </div>
      <div className="miOptions">
        {arr.map((each) => (
          <div className="miOption" style={each.style} onClick={each.function}>
            {each.icon}
          </div>
        ))}
      </div>
      {/* <div style={{position:"absolute", bottom:"50px", width:"400px", height:"800px", backgroundColor:"gray"}}>hjdiwqkmdklqwm</div> */}
    </div>
  );
};

export default MyInfo;
