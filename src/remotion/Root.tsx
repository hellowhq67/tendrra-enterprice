<<<<<<< HEAD
import React from 'react';
import {Composition} from 'remotion';
import {MyComposition} from './Composition';
 
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
=======
import React from 'react';
import {Composition} from 'remotion';
import {MyComposition} from './Composition';
 
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
};