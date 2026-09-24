import path from 'node:path'
import { Config } from '@remotion/cli/config'
import { enableTailwind } from '@remotion/tailwind-v4'

Config.overrideWebpackConfig(config => {
  const withTailwind = enableTailwind(config)
  return {
    ...withTailwind,
    resolve: {
      ...withTailwind.resolve,
      alias: {
        ...withTailwind.resolve?.alias,
        // Single React copy: a symlinked design system would otherwise resolve
        // React from its own repo's node_modules and break hooks.
        react: path.resolve('node_modules/react'),
        'react-dom': path.resolve('node_modules/react-dom'),
        'react/jsx-runtime': path.resolve('node_modules/react/jsx-runtime.js'),
      },
    },
  }
})

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
Config.setCodec('h264')
Config.setCrf(16)

// Sandboxed machines often cannot download Remotion's Chrome. Point it at a
// local headless Chromium (e.g. Playwright's) with REMOTION_CHROME.
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME)

// Recorded footage at 3x device pixels (4320x2430) decodes slowly enough to
// starve the default 30 s delayRender budget, font loads included.
Config.setDelayRenderTimeoutInMilliseconds(240000)
