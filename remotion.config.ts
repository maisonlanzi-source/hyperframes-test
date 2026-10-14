import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);

// Navigateur : REMOTION_BROWSER s'il est défini, sinon le Chromium déjà
// installé dans l'environnement, sinon Remotion télécharge le sien.
const localShell =
	process.env.REMOTION_BROWSER ??
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	if (require('fs').existsSync(localShell)) {
		Config.setBrowserExecutable(localShell);
	}
} catch {
	// Remotion téléchargera son propre navigateur.
}
