import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// AI Catalog — Agentic Resource Discovery (AR-FIND-04, niveau MAY).
//
// Schema faisant autorite : spec/schemas/ai-catalog.schema.json du depot
// ards-project/ard-spec, lu le 22.10.2026. Contraintes qui en viennent et
// qu'il ne faut pas « simplifier » :
//   · specVersion est un ENUM — seule la valeur "1.0" est admise ;
//   · requis au premier niveau : specVersion, entries ;
//   · requis par entree : identifier, displayName, type ;
//   · identifier suit ^urn:air:[a-zA-Z0-9.-]+(:[a-zA-Z0-9._-]+)+$ — c'est
//     « urn:air: », et non « urn:ai: » qu'annoncent plusieurs resumes tiers ;
//   · representativeQueries accepte 2 a 5 entrees, pas moins, pas plus.
//
// Genere, jamais ecrit a la main : les essais y entrent au build, comme pour
// llms.txt. Un catalogue recopie derive en une semaine.

const SITE = 'https://marwanbridi.com';
const PUB = 'marwanbridi.com';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('thinking'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const catalogue = {
    specVersion: '1.0',
    host: {
      displayName: 'Marwan Bridi — ingénieur civil et expert immobilier, Genève',
      identifier: `did:web:${PUB}`,
      documentationUrl: `${SITE}/methode/`,
    },
    entries: [
      {
        identifier: `urn:air:${PUB}:index:llms-txt`,
        displayName: 'Résumé du site pour modèles de langage',
        type: 'text/markdown',
        url: `${SITE}/llms.txt`,
        description:
          "Index décrit du site : réflexions publiées avec leur date et leur résumé, domaines d'expertise, réalisations.",
        tags: ['llms-txt', 'index'],
        representativeQueries: [
          'que publie Marwan Bridi',
          'sur quoi travaille cet ingénieur civil à Genève',
        ],
      },
      {
        identifier: `urn:air:${PUB}:docs:methode`,
        displayName: 'Méthode — comment une décision immobilière devient calculable',
        type: 'text/html',
        url: `${SITE}/methode/`,
        description:
          "Ce qui se calcule et ce qui se juge, la vérification de granularité avant interprétation, et ce qui est délibérément laissé non chiffré.",
        tags: ['méthode', 'expertise', 'données publiques'],
        representativeQueries: [
          "qu'est-ce qui rend un chiffre opposable dans une expertise immobilière",
          'comment vérifier une donnée publique suisse avant de la publier',
        ],
      },
      {
        identifier: `urn:air:${PUB}:dataset:idc-geneve`,
        displayName: "Extraction et contrôle de l'IDC du parc bâti genevois",
        type: 'text/html',
        url: 'https://github.com/marou-dev/idc-geneve',
        description:
          "Script public qui télécharge la couche cantonale de l'indice de dépense de chaleur, recalcule la distribution et les seuils du REn, et compare aux chiffres publiés en signalant chaque écart.",
        tags: ['données publiques', 'énergie', 'genève', 'reproductible'],
        representativeQueries: [
          "combien de bâtiments genevois dépassent le seuil d'IDC",
          "comment reproduire une analyse du parc énergétique genevois",
        ],
      },
      ...posts.map((p) => ({
        identifier: `urn:air:${PUB}:article:${p.id.replace(/[^a-zA-Z0-9._-]/g, '-')}`,
        displayName: p.data.title,
        type: 'text/html',
        url: `${SITE}/reflexions/${p.id}/`,
        description: p.data.description,
        tags: p.data.tags ?? [],
        updatedAt: (p.data.updated ?? p.data.date).toISOString(),
        // Miroir markdown de la meme reflexion (AR-READ-09).
        metadata: { markdown: `${SITE}/reflexions/${p.id}.md` },
      })),
    ],
  };

  return new Response(JSON.stringify(catalogue, null, 2), {
    headers: {
      'Content-Type': 'application/ai-catalog+json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
