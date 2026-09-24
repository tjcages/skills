import { Composition, Sequence } from 'remotion';
import edit from '../edit.json';
import { Scene, shots } from './scene';

const fps = 30;
const width = 1920;
const height = 1080;
const duration = edit.cuts.reduce((sum, cut) => sum + cut.out - cut.in, 0);

function Film() {
  let at = 0;
  return <>{edit.cuts.map((cut) => {
    const from = at;
    const length = cut.out - cut.in;
    at += length;
    return <Sequence key={cut.scene} from={from} durationInFrames={length}>
      <Scene scene={cut.scene} startAt={cut.in} />
    </Sequence>;
  })}</>;
}

export function Root() {
  return <>
    <Composition id="launch-film" component={Film} durationInFrames={duration} fps={fps} width={width} height={height} />
    {edit.cuts.map((cut) => <Composition
      key={cut.scene}
      id={cut.scene}
      component={Scene}
      defaultProps={{ scene: cut.scene, startAt: 0 }}
      durationInFrames={Math.max(cut.out, shots[cut.scene]?.duration || 1)}
      fps={fps}
      width={width}
      height={height}
    />)}
  </>;
}
