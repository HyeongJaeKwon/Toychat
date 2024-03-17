import React, { useEffect, useRef } from 'react';
import "./VideoPlayer.css"

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {

    if (user.videoTrack) {
      user.videoTrack.play(ref.current);

    }
    // return () => {
    //   user.videoTrack.stop();
    // };
  }, [user]);

  return (
    <div className='vpCam'>
      <div
        ref={ref}
        className='vpVideoItself'
      ></div>
</div>
  );
};