// electron-builder afterPack hook.
//
// We don't pay for an Apple Developer certificate, so electron-builder ships
// the .app completely unsigned (mac.identity = null). On Apple Silicon an
// unsigned, internet-downloaded app isn't just "unidentified developer" — it
// hard-fails as "is damaged and should be moved to the Trash", with no
// right-click bypass.
//
// Ad-hoc signing (codesign -s -) gives the bundle a valid-but-anonymous
// signature. That downgrades the hard "damaged" block to the soft Gatekeeper
// prompt, so the user (and buyers) can do right-click → Open → Open once, with
// no Terminal. It is NOT notarization — there's still a first-launch prompt —
// but it removes the dead end.
//
// This runs after the .app is assembled but before it's packaged into the dmg
// (electron-builder calls afterPack ahead of doSignAfterPack), and with
// identity null electron-builder then skips its own signing, so our ad-hoc
// signature is what ends up in the dmg.
const { execFileSync } = require('node:child_process');
const path = require('node:path');

exports.default = async function afterPack(context) {
  // Only macOS bundles need this; skip win/linux.
  if (context.electronPlatformName !== 'darwin') return;

  const appName = context.packager.appInfo.productFilename; // "Meow Mode"
  const appPath = path.join(context.appOutDir, `${appName}.app`);

  console.log(`[afterPack] ad-hoc signing ${appPath}`);
  // --force: replace any existing signature
  // --deep:  also sign nested frameworks/helpers (Electron has several)
  // --sign - : the ad-hoc identity (no certificate required)
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], {
    stdio: 'inherit',
  });

  // Fail the build loudly if the signature didn't take, instead of shipping
  // another "damaged" dmg.
  execFileSync('codesign', ['--verify', '--verbose=2', appPath], {
    stdio: 'inherit',
  });
  console.log('[afterPack] ad-hoc signature verified ✓');
};
