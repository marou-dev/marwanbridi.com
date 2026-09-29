// Entite Person unique du site. Elle etait dupliquee a la main dans
// index.astro et parcours.astro, et avait DEJA diverge : urls
// institutionnelles d'un cote, intitules de diplome de l'autre, sameAs
// present sur une page et absent sur l'autre. Deux declarations
// divergentes de la meme personne affaiblissent l'entite au lieu de la
// renforcer. Source unique desormais — toute page qui decrit Marwan
// importe d'ici.
export const person = {
  "@type": "Person",
  name: "Marwan Bridi",
  // Toujours l'URL canonique, jamais celle de la page courante :
  // une url differente par page ferait lire DEUX entites.
  url: "https://marwanbridi.com/",
  jobTitle: "Project Manager Innovation",
  description:
    "Ingénieur civil et expert immobilier à Genève. Construction, rénovation énergétique, innovation, réglementation, valorisation immobilière.",
  address: { "@type": "PostalAddress", addressLocality: "Genève", addressCountry: "CH" },
  sameAs: ["https://www.linkedin.com/in/mbridi/"],
  knowsLanguage: ["fr", "en", "ar"],
  worksFor: {
    "@type": "Organization",
    name: "Swissroc Group Services SA",
    url: "https://swissroc.ch/",
    address: { "@type": "PostalAddress", addressLocality: "Genève", addressCountry: "CH" },
  },
  // name + url raccroche a une entite que les moteurs connaissent deja ;
  // description porte le diplome obtenu. Les deux, pas l'un ou l'autre.
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "École polytechnique fédérale de Lausanne", url: "https://www.epfl.ch/", description: "MAS Expert en immobilier · CAS Expertise économique" },
    { "@type": "CollegeOrUniversity", name: "HEIA-FR — Haute école d'ingénierie et d'architecture de Fribourg", url: "https://www.heia-fr.ch/", description: "CAS Expertise technique" },
    { "@type": "CollegeOrUniversity", name: "Université de Fribourg", url: "https://www.unifr.ch/", description: "CAS Droit de l'expertise" },
    { "@type": "CollegeOrUniversity", name: "ESTP Paris", url: "https://www.estp.fr/", description: "Ingénieur génie civil" },
    { "@type": "HighSchool", name: "Phillips Academy Andover", url: "https://www.andover.edu/" },
  ],
  knowsAbout: [
    "Construction immobilière",
    "Rénovation énergétique",
    "Gestion de chantier",
    "Réglementation immobilière suisse",
    "Valorisation immobilière",
    "Expertise technique CECB",
    "LDTR Genève",
    "Bâle III financement immobilier",
  ],
};
