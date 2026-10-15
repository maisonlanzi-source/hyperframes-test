# Cap Études — vidéo « France ou Canada ? »

Vidéo publicitaire en motion design (Remotion), 30 images/s. 43 s muette ; avec la voix
off, les scènes s'allongent pour que chaque phrase tienne (53 s avec la voix d'Alimata).

- `out/cap-etudes-france-ou-canada-9x16.mp4` : Reels et Stories (1080 × 1920)
- `out/cap-etudes-france-ou-canada-4x5.mp4` : fil d'actualité (1080 × 1350)
- `out/apercus/` : une image fixe au milieu de chaque scène (9:16)
- `voix-off.txt` : texte de voix off minuté, pour l'enregistrement

## Structure

- `src/constants.ts` : couleurs, formats, zones de sécurité et tous les minutages
- `src/scenes/` : une scène par composant
- `src/components/` : fond, logo, drapeaux, cartes, vignettes photo
- `assets/` (copié dans `public/`) : logo, maquette, pages du guide, photos recadrées

## Commandes

```bash
npm install
npm run studio        # prévisualisation
npm run stills        # images de contrôle dans out/apercus/
npm run render        # les deux vidéos
```

## Voix off, musique et bruitages (ElevenLabs)

1. Définir `ELEVENLABS_API_KEY` dans les réglages de l'environnement (jamais dans le code).
2. `npm run voix -- --list` pour choisir une voix, puis définir `ELEVENLABS_VOICE_ID`
   (voix retenue : Alimata, `4SFJvuIUvxaPLgk8FoK3`).
3. `npm run voix` : génère `public/audio/voix-*.mp3` (texte resserré de `voix-off.txt`).
   Une phrase peut être accélérée jusqu'à ×1,08 ; au-delà, sa scène s'allonge. Les durées
   finales sont écrites dans `src/audio-manifest.json`, que `src/constants.ts` relit.
4. `npm run sons` : génère la musique de fond (taillée sur la durée de la vidéo) et les
   bruitages (transitions, pops, coches, page, feutre, impact d'ouverture, carillon final).
   `-- --music` ou `-- --sfx` pour n'en refaire qu'une partie. Le placement des bruitages
   et le volume de la musique (qui baisse sous la voix) sont dans `src/components/Soundtrack.tsx`.
5. `npm run render` : rend les deux vidéos puis met le son à -14 LUFS (`npm run normaliser`).

Manifeste vide = vidéo muette.

Dans cet environnement, Remotion force Chromium à ignorer le proxy et Google Fonts ne
charge pas. Avant le rendu :

```bash
export REMOTION_BROWSER=$PWD/scripts/chrome-proxy.sh
```

`REMOTION_BROWSER` est lu par `remotion.config.ts` et `scripts/stills.mjs`.
