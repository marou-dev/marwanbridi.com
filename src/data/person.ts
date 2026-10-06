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
  address: { "@type": "PostalAddress", addressLocality: "Genève", addressRegion: "GE", addressCountry: "CH" },
  // Ou j'interviens, pas seulement ou je suis poste. Verifie sur /realisations :
  // Vaud y est cite plus souvent que Geneve (Lausanne 6, Flon 3, Malley 2, Prilly 1).
  areaServed: [
    { "@type": "AdministrativeArea", name: "Canton de Genève" },
    { "@type": "AdministrativeArea", name: "Canton de Vaud" },
    { "@type": "AdministrativeArea", name: "Suisse romande" },
  ],
  sameAs: [
    "https://www.linkedin.com/in/mbridi/",
    // Ajoute le 06.10.2026. La these personnelle nommait l'absence de preuve
    // publique de la moitie systeme comme « le manque principal » : ce depot
    // la fournit, sur donnee cantonale ouverte uniquement.
    "https://github.com/marou-dev/idc-geneve",
  ],
  knowsLanguage: ["fr", "en", "ar"],
  worksFor: {
    "@type": "Organization",
    name: "Swissroc Group Services SA",
    url: "https://swissroc.ch/",
    address: { "@type": "PostalAddress", addressLocality: "Genève", addressRegion: "GE", addressCountry: "CH" },
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
    // Moitie systeme, ajoutee le 06.10.2026. Elle etait vraie depuis longtemps
    // et n'etait declaree nulle part : un moteur interroge sur « qui croise IA
    // et immobilier a Geneve » ne pouvait pas repondre. Chaque entree est
    // demontrable par un travail publie, pas une competence affichee.
    "Analyse de données immobilières",
    "Données publiques suisses (SITG, RegBL, registre foncier)",
    "Graphes de connaissances appliqués au foncier",
    "Python et SQL pour l'analyse de parc bâti",
  ],
};
