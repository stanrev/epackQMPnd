# Outil PND — préparation du CSV pour le Configurateur

Convertit un plan de nettoyage client (Excel, CSV ou PDF « feuille de contrôle »)
en fichier CSV importable dans le Configurateur ePack Hygiène.

## Ce que c'est

Une page statique unique. Pas de serveur, pas de base, pas d'API.
**Les fichiers déposés par le QM sont lus dans son navigateur et n'en sortent jamais.**

`pdf.js` est embarqué dans la page pour la lecture des PDF hors connexion.

## Publication

Pousser sur la branche par défaut : GitLab Pages déploie `public/` tel quel.
L'URL est celle du domaine Pages de l'instance.

## Hors connexion

`public/sw.js` met la page en cache à la première visite. Ensuite elle
fonctionne sans réseau, et se met à jour dès qu'une connexion revient.

## Règles appliquées

Format de sortie : 12 colonnes, séparateur `;`, UTF-8.

    Nom;Zone;RécurrenceInterval;Checklist;MomentId;Lundi;…;Dimanche

- **Unicité du nom sur tout le fichier**, toutes zones confondues.
  Les doublons sont renommés selon la convention « Sol », « Sol 2 », « Sol 3 ».
- **Seule exception** : une même tâche quotidienne en `[Matin]` et `[Soir]`,
  qui garde le même nom. Le renommage s'applique à la tâche entière,
  jamais ligne par ligne.
- **Récurrences exclusives** : soit `RécurrenceInterval` en jours,
  soit `MomentId` + les sept jours en `true`/`false`.

Format validé par un import réel dans le Configurateur.

## Mise à jour

Modifier `public/index.html`, commiter, pousser. Les utilisateurs
rechargent la page et ont la nouvelle version.
