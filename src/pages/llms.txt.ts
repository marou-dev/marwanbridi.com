import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// llms.txt GENERE, et non maintenu a la main.
//
// Pourquoi (05.10.2026) : la version statique de public/llms.txt datait du
// 28.09 et listait 8 essais pour 10 publies — l'essai IDC, le plus recent et
// le seul portant une donnee originale, en etait absent. Le seul fichier concu
// POUR les moteurs generatifs ignorait le contenu le plus citable du site.
// Invariant maison : un inventaire se derive d'une requete, il ne se recopie
// pas. Toute nouvelle reflexion y entre desormais au build, sans geste humain.

const SITE = 'https://marwanbridi.com';

const PROSE = {
  intro: `# Marwan Bridi

> Ingénieur civil et expert immobilier à Genève. Spécialisé en construction, rénovation énergétique, gestion de chantier, réglementation et valorisation immobilière en Suisse.

## À propos

Marwan Bridi est ingénieur civil et expert immobilier basé à Genève. Il intervient sur des projets de construction neuve, de rénovation énergétique et de valorisation immobilière en Suisse romande. Son expertise couvre la gestion de chantier, la réglementation (LDTR, LCI, REn, Bâle III), l'expertise technique (CECB, SIA) et le financement de la promotion immobilière.

Certains de ces articles reposent sur des données publiques cantonales retraitées, et non sur des sources secondaires : la distribution de l'indice de dépense de chaleur du parc genevois est produite à partir de la couche OCEN du SITG, méthode et réserves incluses.`,

  realisations: `## Réalisations

- Expertise technique CECB E → B (réduction 84% de la consommation énergétique)
- The Ivy, Malagnou — 10 appartements très haut standing, THPE
- Étoile-Palettes — 280 logements, rénovation en site occupé
- Vaudoise Aréna — 9'600 places, Centre Sportif de Malley`,

  domaines: `## Domaines d'expertise

- Construction immobilière (neuf et rénovation)
- Rénovation énergétique, expertise CECB, indice de dépense de chaleur (IDC)
- Réglementation immobilière suisse (LDTR, LCI, REn, SIA, MoPEC, Lex Koller)
- Financement de la promotion immobilière (Bâle III, L-QIF, mezzanine)
- Gestion de chantier et suivi de travaux
- Valorisation immobilière et DCF`,

  contact: `## Contact

- Site : ${SITE}
- LinkedIn : https://www.linkedin.com/in/mbridi/`,
};

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const posts = (await getCollection('thinking'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  // La description accompagne chaque lien : un moteur generatif choisit quoi
  // citer sur ce que la page REPOND, pas sur son titre seul. La date sert la
  // recence, que Perplexity pondere fortement.
  const ligne = (p: (typeof posts)[number]) =>
    `- [${p.data.title}](${SITE}/reflexions/${p.id}/) — ${fmtDate(p.data.date)}\n  ${p.data.description}`;

  const fr = posts.filter((p) => (p.data.lang ?? 'fr') === 'fr');
  const en = posts.filter((p) => p.data.lang === 'en');

  const blocs = [
    PROSE.intro,
    `## Réflexions\n\nArticles sur la construction, l'immobilier et la réglementation en Suisse, du plus récent au plus ancien :\n\n${fr.map(ligne).join('\n')}`,
    en.length ? `## Articles (English)\n\n${en.map(ligne).join('\n')}` : '',
    PROSE.realisations,
    PROSE.domaines,
    PROSE.contact,
    `---\nDernière mise à jour : ${fmtDate(new Date())} — fichier généré au build.`,
  ].filter(Boolean);

  return new Response(blocs.join('\n\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
