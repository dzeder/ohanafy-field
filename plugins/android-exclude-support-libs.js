const { withAppBuildGradle } = require('@expo/config-plugins');

// @react-native-voice/voice@3.2.4 depends on com.android.support:* (legacy).
// Jetifier rewrites the bytecode but doesn't remove the old AAR from the
// dependency graph, causing duplicate class errors alongside androidx.core.
// We explicitly exclude the conflicting old support modules so only the
// Jetifier-translated AndroidX versions remain.
const withExcludeOldSupportLibs = (config) =>
  withAppBuildGradle(config, (cfg) => {
    const contents = cfg.modResults.contents;

    const exclusions = `
// Exclude legacy com.android.support artifacts — Jetifier has already
// rewritten @react-native-voice to use AndroidX equivalents.
configurations.all {
    exclude group: 'com.android.support', module: 'support-compat'
    exclude group: 'com.android.support', module: 'versionedparcelable'
    exclude group: 'com.android.support', module: 'animated-vector-drawable'
    exclude group: 'com.android.support', module: 'support-vector-drawable'
}
`;

    if (!contents.includes("exclude group: 'com.android.support'")) {
      cfg.modResults.contents = contents + exclusions;
    }

    return cfg;
  });

module.exports = withExcludeOldSupportLibs;
