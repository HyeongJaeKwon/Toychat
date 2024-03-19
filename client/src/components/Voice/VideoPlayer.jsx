import React, { useEffect, useRef } from "react";
import "./VideoPlayer.css";

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    // console.log(user.uid)
     
     try{
      const playVid = async () => {
        // if(!user.videoTrack){
          // console.log("playvid2")
          console.log(user.videoTrack.getVideoElementVisibleStatus())
          await user.videoTrack.play(ref.current);
        // }
      }
      // console.log("playvid")
      playVid()
     }catch(err){
      console.log("play error")
      console.log(err.message)
     }
    
    
 
  }, [user]);

  return (
    <div className="vpCam">
      <div ref={ref} className="vpVideoItself"></div>
    </div>
  );
};
