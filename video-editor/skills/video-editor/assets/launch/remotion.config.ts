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
