import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";

const VoiceClone = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [str, setStr] = useState("hi");
  const APP_ID = process.env.REACT_APP_APP_ID;
  const TOKEN = process.env.REACT_APP_TOKEN;
  const CHANNEL = process.env.REACT_APP_CHANNEL;
  AgoraRTC.setLogLevel(4);
  const client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      // user.audioTrack.play()
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  useEffect(() => {
    setStr("bye");
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
        console.log("track init");
        console.log(tracks);
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
      });

    return () => {
      console.log("Cline return triggered");
      console.log(str);
      console.log(localTracks);
      //   for (let localTrack of localTracks) {
      //     console.log(localTrack)
      //     localTrack.stop();
      //     localTrack.close();
      //   }
      setLocalTracks((prev) => {
        console.log("hello");
        console.log(prev);
        prev.map((each)=>{
            console.log(each)
            each.stop()
            each.close()
        })
        return prev;
      });
    // localTracks.forEach((track) => {
    //     console.log("hello")
    //     console.log(track)
    //     track.stop();
    //     track.close();
    //   });

      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.unpublish(localTracks).then(() => client.leave());
    };
  }, []);






  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 200px)",
        }}
      >
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};

export default VoiceClone;
