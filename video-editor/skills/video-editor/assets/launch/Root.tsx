import { Composition } from 'remotion'

import { CANVAS } from './camera'
import editFile from './edit.json'
import { PARTS, SCENES } from './film'
import { validateCoverage, validateEdit, type Cut, type EditProfile } from './scenes'

/**
 * One composition per scene, so every shot can be previewed, QC'd and
 * re-rendered on its own. The assembled film is produced by `build.mjs`,
 * which trims each scene to its cut and concatenates the clips.
 *
 * Validating here means a broken edit fails when you open the studio, not
 * after eight clips have rendered.
 */
validateEdit(SCENES, editFile.cuts as Cut[], ('profile' in editFile ? editFile.profile : {}) as EditProfile)
validateCoverage(SCENES, editFile.cuts as Cut[], PARTS)

export function RemotionRoot() {
  return (
    <>
      {SCENES.map(scene => (
        <Composition
          key={scene.id}
          id={scene.id}
          component={scene.component}
          durationInFrames={scene.duration}
          fps={CANVAS.fps}
          width={CANVAS.width}
          height={CANVAS.height}
        />
      ))}
    </>
  )
}
