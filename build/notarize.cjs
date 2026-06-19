// electron-builder afterSign hook — notarizes the macOS app with Apple.
//
// Runs AFTER electron-builder signs the app (Developer ID). Requires the Apple
// notarization secrets. Modern notarytool flow via @electron/notarize.
//
//   In CI without the secrets → throws (we never ship an un-notarized build).
//   Locally without the secrets → warns and skips (ad-hoc dev build is fine).
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir, packager } = context;

  if (electronPlatformName !== 'darwin') return;

  const { APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID, CI } = process.env;

  if (!APPLE_ID || !APPLE_APP_SPECIFIC_PASSWORD || !APPLE_TEAM_ID) {
    if (CI) {
      throw new Error(
        'Missing Apple notarization secrets: APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID',
      );
    }
    console.warn('Skipping notarization because Apple credentials are missing (local/dev build).');
    return;
  }

  const appName = packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`Notarizing ${appPath} …`);
  await notarize({
    appPath,
    appleId: APPLE_ID,
    appleIdPassword: APPLE_APP_SPECIFIC_PASSWORD,
    teamId: APPLE_TEAM_ID,
  });
  console.log('Notarization complete.');
};
