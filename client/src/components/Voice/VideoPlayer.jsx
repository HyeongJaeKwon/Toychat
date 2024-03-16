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
        style={{ width: '100%', height: '100%' }}
      ></div>
</div>
  );
};