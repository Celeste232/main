// electron-builder afterSign hook — OPTIONAL Apple notarization.
//
// Fox Mode and Meow Mode ship NON-notarized (ad-hoc signed, see afterPack.cjs).
// This hook is NOT wired into electron-builder-fox.json anymore, so it does not
// run during the normal Gumroad build. It is kept only as an opt-in path for if
// we ever buy an Apple Developer ID.
//
// IMPORTANT: it must NEVER fail a build. With no Apple credentials it warns and
// skips — in CI and locally alike — so the ad-hoc / unsigned build keeps
// shipping. (Previously this threw in CI; that was removed on purpose.)
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir, packager } = context;

  if (electronPlatformName !== 'darwin') return;

  const { APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID } = process.env;

  if (!APPLE_ID || !APPLE_APP_SPECIFIC_PASSWORD || !APPLE_TEAM_ID) {
    console.warn(
      '[notarize] No Apple credentials — skipping notarization (shipping ad-hoc / unsigned, which is expected for Gumroad distribution).',
    );
    return;
  }

  const appName = packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`[notarize] Notarizing ${appPath} …`);
  await notarize({
    appPath,
    appleId: APPLE_ID,
    appleIdPassword: APPLE_APP_SPECIFIC_PASSWORD,
    teamId: APPLE_TEAM_ID,
  });
  console.log('[notarize] Notarization complete.');
};
