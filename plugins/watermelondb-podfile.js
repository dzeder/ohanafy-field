const { withDangerousMod } = require('@expo/config-plugins');
const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');

// WatermelonDB's podspec declares `s.dependency "simdjson"` but CocoaPods
// trunk doesn't host that pod. WDB vendors it in @nozbe/simdjson. This
// plugin injects the local path declaration into the generated Podfile so
// `pod install` can resolve it.
const withWatermelonDBPodfile = (config) =>
  withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = resolve(cfg.modRequest.platformProjectRoot, 'Podfile');
      let podfile = readFileSync(podfilePath, 'utf8');

      const injection = `  pod 'simdjson', path: '../node_modules/@nozbe/simdjson'`;
      if (!podfile.includes(injection)) {
        podfile = podfile.replace(
          /^  config = use_native_modules!/m,
          `${injection}\n  config = use_native_modules!`
        );
        writeFileSync(podfilePath, podfile);
      }
      return cfg;
    },
  ]);

module.exports = withWatermelonDBPodfile;
