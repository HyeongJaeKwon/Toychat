import React, { useContext, useEffect, useState } from "react";

import "./Voice.css";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { IoRocketSharp } from "react-icons/io5";
import { MdScreenShare } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import { ImPhoneHangUp } from "react-icons/im";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import { CallContext } from "../../context/CallContext";
import socket from "../../server";

const APP_ID = process.env.REACT_APP_APP_ID;
const TOKEN = process.env.REACT_APP_TOKEN;
const CHANNEL = process.env.REACT_APP_CHANNEL;

const VoiceClone = ({ myuser, setJoined }) => {
  const {
    micMuted,
    camMuted,
    audioTrack,
    videoTrack,
    users,
    client,
    dispatch,
  } = useContext(CallContext);

  useEffect(() => {
    if (!audioTrack) {
      socket.on("camera",(res)=>{
        // users[1].videoTrack = null
        console.log("so camera")
        dispatch({type:"TOGGLE_OTHER_CAMERA"})
      } )
      dispatch({ type: "INIT", payload: myuser });
      client.on("user-published", handleUserPublished);
      client.on("user-left", handleUserLeft);
      client
        .join(APP_ID, CHANNEL, TOKEN, myuser.name)
        .then((uid) =>
          Promise.all([AgoraRTC.createMicrophoneAudioTrack(), uid])
        )
        .then(([track, uid]) => {
          dispatch({ type: "AUDIOTRACK", payload: { uid: uid, track: track } });
          client.publish(track);
          initVolumeIndicator();
        })
        .catch((error) => {
          console.error("Error during initialization:", error);
        });
    }
  }, [setJoined]);

  const handleCancel = () => {
    dispatch({ type: "CLEAN" });
    client.off("user-published", handleUserPublished);
    client.off("user-left", handleUserLeft);
    client.off("volume-indicator", handleVolume);
    client.unpublish();
    client.leave();
    setJoined(false);
  };

  /** client.on("volume-indicator") + handleVolume */
  const initVolumeIndicator = async () => {
    client.enableAudioVolumeIndicator();
    client.on("volume-indicator", handleVolume);
  };

  /** Set that user's volume from users */
  const handleVolume = (volumes) => {
    dispatch({ type: "HANDLE_VOLUME", payload: volumes });
  };

  /** Add User into UserList + Audio Play O + Video Play X */
  const handleUserPublished = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    dispatch({
      type: "HANDLE_USER_PUBLISHED",
      payload: { user: user, mediaType: mediaType },
    });
  };

  const handleUserLeft = (user) => {
    dispatch({ type: "HANDLE_USER_LEFT", payload: user });
  };

  const handleCamera = () => {
    if (videoTrack === null) {
      console.log("videoTrack: null");
      Promise.all([AgoraRTC.createCameraVideoTrack(), myuser.name]).then(
        ([track, uid]) => {
          dispatch({ type: "VIDEOTRACK", payload: { uid: uid, track: track } });
          client.publish(track);
        }
      );
    } else {
      console.log("videoTrack: not null");
      dispatch({ type: "HANDLE_CAMERA" });
      if (users[1])
        socket.emit("camera", users[1].uid, (res) => {
          console.log("se camera: ", res);
        });

      // client.publish(videoTrack);
    }
  };

  const handleMic = () => {
    dispatch({ type: "HANDLE_MIC" });
  };

  const arr = [
    {
      icon: <BsCameraVideoOffFill size={25} />,
      id: "camera",
      function: handleCamera,
      style: !camMuted ? { backgroundColor: "white", color: "black" } : {},
    },
    {
      icon: <IoRocketSharp size={25} />,
      id: "rocket",
      function: () => {},
      style: {},
    },
    {
      icon: <MdScreenShare size={25} />,
      id: "screen",
      function: () => {
        // console.log(users[1])
        // console.log(users[1].videoTrack)
        console.log(users[1].videoTrack);
      },
      style: {},
    },
    {
      icon: !micMuted ? (
        <FaMicrophone size={25} />
      ) : (
        <FaMicrophoneSlash size={25} />
      ),
      id: "mic",
      function: handleMic,
      style: !micMuted ? { backgroundColor: "white", color: "black" } : {},
    },
    {
      icon: <ImPhoneHangUp size={25} />,
      id: "cancel",
      function: handleCancel,
      style: { backgroundColor: "red" },
    },
  ];

  return (
    <div className="vContainer">
      <div className="vUsers">
        {users.some((each) => {
          if (each.uid === myuser.name) {
            return !camMuted;
          } else {
            return each.videoTrack;
          }
        }) ? (
          <div className="vCams">
            {users.map((each, index) =>
              each.uid === myuser.name && camMuted ? (
                <div className="vVid" key={each.uid}>
                  <div className="vDefault">
                    <img src={"/profile.jpeg"}></img>
                  </div>
                  {each.volume > 50 && <div className="vGreenVid"></div>}
                </div>
              ) : (
                <div key={`${each.uid}-${index}`}>
                  {each.videoTrack ? (
                    <div className="vVid">
                      <VideoPlayer user={each} />
                      {each.volume > 50 && <div className="vGreenVid"></div>}
                    </div>
                  ) : (
                    <div className="vVid">
                      <div className="vDefault">
                        <img src={"/profile.jpeg"}></img>
                      </div>
                      {each.volume > 50 && <div className="vGreenVid"></div>}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          users.map((each, index) => (
            <div key={`${each.uid}-${index}`}>
              <div className="vImg">
                <img src={"/profile.jpeg"}></img>
                {each.volume > 50 && <div className="vGreen"></div>}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="vOptions">
        {arr.map((each) => (
          <div
            className="vOneOption"
            style={each.style}
            onClick={each.function}
            key={each.id}
          >
            {each.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceClone;
