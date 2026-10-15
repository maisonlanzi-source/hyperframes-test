// Met le son des vidéos rendues au niveau des réseaux sociaux (-14 LUFS,
// crête -1 dBTP), en deux passes loudnorm. L'image est copiée telle quelle.
//
// Usage : npm run normaliser [fichiers…]   (par défaut : out/*.mp4)
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const TARGET = 'I=-14:TP=-1:LRA=11';

const files = process.argv.slice(2).length
	? process.argv.slice(2)
	: fs.readdirSync('out').filter((f) => f.endsWith('.mp4')).map((f) => path.join('out', f));

for (const file of files) {
	// Première passe : mesure (ffmpeg l'écrit sur stderr).
	const out = execFileSync(
		'sh',
		['-c', `ffmpeg -hide_banner -i "$1" -af "loudnorm=${TARGET}:print_format=json" -vn -f null - 2>&1`, 'sh', file],
	).toString();
	const m = JSON.parse(out.slice(out.lastIndexOf('{'), out.lastIndexOf('}') + 1));
	const filter =
		`loudnorm=${TARGET}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}` +
		`:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
	const tmp = file.replace(/\.mp4$/, '.tmp.mp4');
	execFileSync('ffmpeg', [
		'-hide_banner', '-loglevel', 'error', '-y', '-i', file,
		'-c:v', 'copy', '-af', filter, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k',
		'-movflags', '+faststart', tmp,
	]);
	fs.renameSync(tmp, file);
	console.log(`${file} : ${m.input_i} LUFS → -14 LUFS`);
}
