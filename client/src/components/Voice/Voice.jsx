import React, { useEffect, useState } from "react";
// import VideoRoom from "./VideoRoom";
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

const APP_ID = process.env.REACT_APP_APP_ID;
const TOKEN = process.env.REACT_APP_TOKEN;
const CHANNEL = process.env.REACT_APP_CHANNEL;

let client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});
AgoraRTC.setLogLevel(4);

let micMuted = false;
let camMuted = true;

let audioTrack = null;
let videoTrack = null;

const Voice = ({ myuser, setJoined }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("Voice init");
    console.log("audio, video Initial Value: ", [audioTrack, videoTrack]);
    audioTrack = null;
    videoTrack = null;
    setUsers([]);
    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, myuser.name)
      .then((uid) =>
        // Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
        Promise.all([AgoraRTC.createMicrophoneAudioTrack(), uid])
      )
      .then(([track, uid]) => {
        // setAudioTrack([track]);
        audioTrack = track;

        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            // videoTrack,
            audioTrack,
            volume: 0,
          },
        ]);

        client.publish(track);
        initVolumeIndicator();
      });

    /** (Wrong) when unmount.... delete mic&Cam + off sockets + unpublish the user from the channel */
    /** (Correct) But Connection should persist even when away from the page */
    const cleanupFunction = async () => {
      try {
        micMuted = false;
        camMuted = true;
        console.log("Return Logic Triggered");
        console.log("Removing AudioTrack: ", audioTrack);
        audioTrack.stop();
        audioTrack.close();
        audioTrack = null;
        console.log("Is VideoTrack null??: ", videoTrack);
        if (videoTrack !== null) {
          console.log("Removing VideoTrack: ", audioTrack);
          videoTrack.stop();
          videoTrack.close();
          videoTrack = null;
        }
        client.off("user-published", handleUserPublished);
        client.off("user-left", handleUserLeft);
        client.off("volume-indicator", handleVolume);
        client.unpublish();
        client.leave();
        console.log("Return Logic Ended");
      } catch (err) {
        alert(`Something went wrong, please refresh: ${err.message}`);
      }
    };

    return cleanupFunction;
  }, [setJoined]);

  const handleCancel = () => {
    // returnLogic();
    setJoined(false);
  };

  /** client.on("volume-indicator") + handleVolume */
  const initVolumeIndicator = async () => {
    AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
    client.enableAudioVolumeIndicator();

    client.on("volume-indicator", handleVolume);
  };

  /** Set that user's volume from users */
  const handleVolume = (volumes) => {
    volumes.forEach((volume) => {
      setUsers((previousUsers) =>
        previousUsers.filter((u) => {
          if (u.uid === volume.uid) {
            u.volume = volume.level;
          }
          return true;
        })
      );
    });
  };

  /** Add User into UserList + Audio Play O + Video Play X */
  const handleUserPublished = async (user, mediaType) => {
    console.log("Handle User Published");
    /**Video Comes First, then Audio Comes!! */
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
    }

    if (mediaType === "audio") {
      user.volume = 0;
      user.audioTrack.play();
      setUsers((previousUsers) => {
        if (previousUsers.some((each) => each.uid === user.uid)) {
          return previousUsers;
        } else {
          return [...previousUsers, user];
        }
      });
    }
  };

  /** Simply remove the user */
  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  const handleCamera = () => {
    console.log("handle Cam");
    console.log("videoTrack: ", videoTrack);
    if (videoTrack === null) {
      Promise.all([AgoraRTC.createCameraVideoTrack(), myuser.name]).then(
        ([track, uid]) => {
          console.log("Promise.all Success: ", track);
          videoTrack = track;
          setUsers((previousUsers) =>
            previousUsers.filter((user) => {
              if (user.uid === uid) {
                user.videoTrack = track;
              }
              return true;
            })
          );
          camMuted = false;
          client.publish(track);
          // initVolumeIndicator();
        }
      );
    } else {
      videoTrack.setEnabled(camMuted);
      camMuted = !camMuted;
    }
  };

  const handleMic = () => {
    micMuted = !micMuted;
    audioTrack.setMuted(micMuted);
    // audioTrack.stop();
    // audioTrack.close();
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
      function: () => {},
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
                <div
                  style={{
                    width: "300px",
                    height: "230px",
                    backgroundColor: "gray",
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {" "}
                  <div
                   className="vDefault"
                  >
                    <img src={"/profile.jpeg"}></img>
                  </div>
                </div>
              ) : (
                <div key={`${each.uid}-${index}`}>
                  {each.videoTrack ? (
                    <VideoPlayer user={each} />
                  ) : (
                    <div
                      style={{
                        width: "300px",
                        height: "230px",
                        backgroundColor: "gray",
                        marginTop: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                           className="vDefault"
                      >
                        <img src={"/profile.jpeg"}></img>
                      </div>
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

export default Voice;
