# Création de contenu — méthode de travail

Ce dépôt sert à produire des créas publicitaires (vidéos UGC/IA, statiques, carrousels) pour
promouvoir des produits, notamment en affiliation Chariow. Toute création de contenu suit le
cadre ci-dessous.

Source : « Comment tester vos créas Facebook Ads comme un pro (méthode 2026) » — Nilsen Irmouli
(https://youtu.be/M4GZJnFXSew).

## Principe de base

- **Une seule variable testée à la fois, et dans le bon ordre.** Lancer 5 concepts différents
  en même temps ne permet pas de savoir *pourquoi* une créa marche, donc pas de la répliquer.
- **Petit budget (< ~50 k€/mois de dépense pub)** : commencer par des *big swings* — des tests
  larges et contrastés pour repérer les premières tendances. On passe au testing granulaire
  une fois qu'on a des gagnants.

## La pyramide de testing (du plus important au moins important)

1. **Angle publicitaire** (la fondation). Un bon angle vend avec n'importe quel format ; un
   mauvais angle ne vend rien même avec une belle pub.
   - *Problème* (top funnel) : agiter une douleur précise de la cible.
   - *Bénéfice* : la promesse / le résultat obtenu.
   - *Preuve sociale* (middle/bottom funnel) : nombre de clients, autorité, témoignages.
   - *Storytelling* : genèse du produit, fondateur, histoire d'un client.
   - Trouver les angles dans : avis clients, commentaires sous les pubs, forums, YouTube,
     TikTok organique.
2. **Format** : UGC, statique, carrousel, motion design, tournage type podcast.
   Marché nouveau / produit à expliquer → plutôt vidéo. Marché éduqué → statiques en masse.
3. **Concept** (ce qu'on met dans le format) : unboxing, témoignage, micro-trottoir,
   podcast, avant/après, tableau blanc / feuille de papier, sketch humoristique,
   capture d'article de presse, UGC brut filmé « comme un vrai client ».
4. **Créateur / avatar** : décliner la formule gagnante (angle + format + concept) avec
   d'autres visages — âge, sexe, morphologie, décor. Le hack le plus simple pour relancer
   une créa qui s'essouffle.
5. **Optimisation** :
   - Vidéo : hook rate (3 premières secondes : texte à l'écran, phrase d'accroche, visuel
     d'ouverture) et hold rate (rythme, b-roll, coupes, durée).
   - Statique : CTR (headline, tagline, question vs promesse, photo produit, couleur de fond).

## Structure de test dans Meta (batch testing)

- Regrouper les créas par angle ou concept testé.
- Une campagne **ABO** par angle/concept, **un ad set par variante testée** pour donner la
  même chance à chacune.
- Nommer les ad sets de façon explicite : `ANGLE_FORMAT_CONCEPT_CREATEUR_HOOK`.
- Laisser tourner **3 à 10 jours** selon le budget. Dépenser **3 à 5× le CPA cible** par créa
  avant de juger.

## Analyse — matrice de décision

Ordre de priorité : **CPA d'abord**. Si le CPA n'est pas bon, le reste passe au second plan.
Repères : CTR lien > ~1,2 % = correct (à relativiser selon le CPM / CPC).

| Situation | Diagnostic | Action |
|---|---|---|
| Hook fort, hold faible | On capte mais on perd l'attention | Raccourcir, accélérer, ajouter du b-roll |
| Hook faible, hold fort | Bon argumentaire, trop peu de monde le voit | Tester 3+ nouveaux hooks |
| Hook, hold, CTR forts mais CPA élevé | Problème de cohérence pub ↔ page de vente | Aligner la page de vente sur l'angle de la pub |
| Tout est faible | Concept raté | Noter l'apprentissage, passer au test suivant (ne pas s'acharner) |

## Tableau de suivi des tests

Pour chaque créa : format · concept · angle · tagline/accroche · métriques (hook, hold, CTR,
CPA) · Qu'est-ce qui a marché ? · Qu'est-ce qui n'a pas marché ? · Qu'est-ce qu'on en
apprend ? · Prochaine variante.

Bilan hebdo, 3 questions :
1. Quels motifs reviennent chez les meilleures créas ?
2. Quels éléments reviennent dans les échecs ?
3. Quelles combinaisons n'a-t-on pas encore testées ?

## Les 3 R pour scaler un gagnant

1. **Répliquer** : même script et storyboard avec ~5 nouveaux créateurs/avatars ; même angle
   sur un autre format.
2. **Reverse-engineer** : comprendre *pourquoi* ça marche.
3. **Raffiner** : micro-variations (hook, durée, musique, sous-titres, CTA, couleur de fond,
   photo produit) pour faire monter le ROAS d'une créa précise.

Un gagnant décliné de cette façon donne ~15 nouveaux tests avec de bien meilleures chances de
succès que des tests au hasard.

## Règles propres à ce projet

- Pour chaque produit à promouvoir, livrer d'abord une **liste d'angles** (problème, bénéfice,
  preuve sociale, storytelling) tirée des avis/commentaires, avant d'écrire le moindre script.
- Chaque script ou créa produit est étiqueté avec son angle, son format, son concept et son
  hook, pour pouvoir remplir le tableau de suivi.
- Contenus générés par IA : respecter les règles d'étiquetage des plateformes (TikTok, Meta).
  Pas de faux témoignages présentés comme de vrais clients, pas de promesses de résultats
  invérifiables.
