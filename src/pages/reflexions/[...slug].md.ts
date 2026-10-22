import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Miroir markdown de chaque reflexion — AR-READ-09 (MAY).
//
// Un agent qui veut le TEXTE paie aujourd'hui le HTML complet : nav, styles
// inlines, trois blocs JSON-LD, le pied de page. Le miroir sert la meme
// substance sans rien de tout ca. La page HTML l'annonce par
// <link rel="alternate" type="text/markdown">, comme la spec le demande.
//
// La source est le fichier .md lui-meme, pas une re-serialisation du rendu :
// ce qui est servi ici est litteralement ce que l'auteur a ecrit.

export async function getStaticPaths() {
  const posts = (await getCollection('thinking')).filter((p) => !p.data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: any };
  const d = (x: Date) => x.toISOString().slice(0, 10);

  // En-tete minimal : de quoi savoir ce qu'on lit et ou le verifier, sans
  // recopier le frontmatter entier (qui porte de la mise en forme).
  const entete = [
    `# ${post.data.title}`,
    '',
    `> ${post.data.description}`,
    '',
    `Publié le ${d(post.data.date)}`
      + (post.data.updated ? ` · mis à jour le ${d(post.data.updated)}` : '')
      + ` · https://marwanbridi.com/reflexions/${post.id}/`,
    post.data.tags?.length ? `Thèmes : ${post.data.tags.join(', ')}` : '',
    '',
    '---',
    '',
  ].filter((l) => l !== null).join('\n');

  return new Response(entete + '\n' + post.body.trim() + '\n', {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
