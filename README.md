# Cap Études — vidéo « France ou Canada ? »

Vidéo publicitaire en motion design (Remotion), 43 s, 30 images/s.

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

Si Chromium ne peut pas joindre Google Fonts (proxy), définir `REMOTION_BROWSER`
vers un navigateur adapté ; il est lu par `remotion.config.ts` et `scripts/stills.mjs`.
