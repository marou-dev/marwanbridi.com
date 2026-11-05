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

  // La FAQ vit dans le FRONTMATTER (post.data.faq), jamais dans post.body : servir
  // le corps seul la perdait entierement. Mesure du 04.11.2026 : 0 des 5 questions de
  // l'article LCI 117-118 dans son miroir contre 5 dans le HTML, et 52 Q/R sur les
  // 11 articles publies dans le meme cas (55 sur 12 en comptant le brouillon, qui n'a
  // ni HTML ni miroir) — alors que le llms.txt designe ce fichier aux agents
  // comme le « texte brut » de la page. C'etait la surface la plus citable de chaque
  // article (une question explicite, une reponse qui se tient seule) absente de la
  // seule surface ecrite pour etre lue par une machine.
  //
  // Chaque question devient un titre de niveau 3 sous un h2, comme dans le HTML, pour
  // qu'un agent qui segmente par titre retrouve la paire question/reponse entiere.
  // La garde sur 'Questions fréquentes' evite le doublon si un corps portait un jour
  // sa propre section : le frontmatter ne s'ajoute alors pas une seconde fois.
  const corps = post.body.trim();
  const faq = post.data.faq as { q: string; a: string }[] | undefined;
  const sectionFaq = faq?.length && !corps.includes('Questions fréquentes')
    ? '\n\n## Questions fréquentes\n\n'
      + faq.map((item) => `### ${item.q}\n\n${item.a}`).join('\n\n')
    : '';

  return new Response(entete + '\n' + corps + sectionFaq + '\n', {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
