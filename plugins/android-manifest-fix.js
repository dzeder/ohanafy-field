const { withAndroidManifest } = require('@expo/config-plugins');

// @react-native-voice/voice pulls in com.android.support:support-compat:28.0.0
// which declares android:appComponentFactory = android.support.v4.app.CoreComponentFactory.
// This conflicts with androidx.core:core which declares the AndroidX version.
// Even with Jetifier enabled, the manifest declaration survives. This plugin
// adds tools:replace to let the AndroidX value win during manifest merging.
const withAndroidManifestFix = (config) =>
  withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;

    // Ensure xmlns:tools is declared on <manifest>
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    const app = manifest.application?.[0];
    if (app) {
      app.$['tools:replace'] = 'android:appComponentFactory';
      app.$['android:appComponentFactory'] = 'androidx.core.app.CoreComponentFactory';
    }

    return cfg;
  });

module.exports = withAndroidManifestFix;
