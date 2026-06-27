// Données de démonstration — utilisées en secours si les clés API ne sont pas
// configurées, pour que le projet tourne dès le premier déploiement.
// Structure siteData : [GOOGLE] fiche · [CLAUDE] enrichi IA · [AGENCE] white-label

export const sampleData = {
  demo: true,
  agency: { id: "shake-demo", name: "Shake Agency", brandColor: "#7c3aed", domain: "comptoir-sauvage.fr" },
  business: {
    placeId: "ChIJ_demo_comptoir_sauvage",
    name: "Comptoir Sauvage",
    category: "Bar à vins naturels",
    cuisine: "Cuisine méditerranéenne du marché",
    tagline: "Vins vivants, petites assiettes, grandes soirées.",
    rating: 4.8, reviewCount: 327, priceLevel: "€€",
    phone: "04 91 00 00 00",
    address: "12 rue des Trois Rois", postal: "13006", city: "Marseille",
    neighborhood: "Cours Julien",
    website: "comptoir-sauvage.fr",
    accent: "#7A2638",
    hours: { 0: null, 1: null, 2: [["18:00","00:00"]], 3: [["18:00","00:00"]], 4: [["18:00","00:00"]], 5: [["18:00","01:00"]], 6: [["18:00","01:00"]] }
  },
  ai: {
    seoTitle: "Comptoir Sauvage — Bar à vins naturels à Marseille (Cours Julien)",
    seoDescription: "Bar à vins naturels et cuisine du marché au cœur du Cours Julien à Marseille. 300+ références de vins vivants, petites assiettes de saison, soirées dégustation. Noté 4,8 sur Google.",
    keywords: ["bar à vins naturels Marseille","cave à manger Cours Julien","vin nature Marseille 6e","où boire un verre Cours Julien","restaurant vin nature Marseille"],
    about: "Niché dans une ruelle du Cours Julien, le Comptoir Sauvage est une cave à manger dédiée aux vins vivants — natures, biodynamiques, sans artifice. La carte change au gré du marché et des arrivages : petites assiettes à partager, produits de petits producteurs, et plus de 300 références à boire sur place ou à emporter.",
    highlights: [
      { t: "300+ vins vivants", d: "Une sélection pointue de vins natures et biodynamiques, renouvelée chaque semaine." },
      { t: "Cuisine du marché", d: "De petites assiettes de saison pensées pour accompagner le verre." },
      { t: "Soirées dégustation", d: "Rencontres vigneronnes et accords mets & vins, plusieurs fois par mois." }
    ],
    faq: [
      { q: "Faut-il réserver ?", a: "La réservation est conseillée le week-end. En semaine, le comptoir accueille volontiers les passages spontanés." },
      { q: "Peut-on emporter des bouteilles ?", a: "Oui. Toutes les références de la cave sont disponibles à emporter, avec un conseil personnalisé." },
      { q: "Proposez-vous des assiettes végétariennes ?", a: "Oui, une partie de la carte est végétarienne et évolue selon le marché." }
    ]
  },
  reviews: [
    { author: "Camille R.", rating: 5, time: "il y a 2 semaines", text: "Une pépite du Cours Ju. Conseils vins au top, assiettes généreuses et pleines de goût. On s'est régalés du début à la fin.", c: "#7A2638" },
    { author: "Thomas L.", rating: 5, time: "il y a 1 mois", text: "Le genre d'adresse où on entre pour un verre et on repart 3h plus tard. Ambiance chaleureuse, équipe passionnée.", c: "#CE6A33" },
    { author: "Inès M.", rating: 5, time: "il y a 3 semaines", text: "Découverte de vins natures incroyables que je n'aurais jamais commandés seule. La cuisine suit parfaitement. Coup de cœur.", c: "#79805C" },
    { author: "Yann B.", rating: 4, time: "il y a 2 mois", text: "Très bonne sélection, un peu bruyant quand c'est plein mais ça fait partie du charme. J'y retourne sans hésiter.", c: "#5b6cb0" },
    { author: "Sofia D.", rating: 5, time: "il y a 1 semaine", text: "Accueil adorable, on nous a guidés selon nos goûts. Les rillettes maison… une tuerie. Adresse adoptée.", c: "#9a5ea0" },
    { author: "Marc T.", rating: 5, time: "il y a 5 jours", text: "Soirée dégustation avec un vigneron du Languedoc : passionnant. Rare de trouver autant de sincérité dans un lieu.", c: "#3f8e7d" }
  ],
  blog: [
    { title: "Qu'est-ce qu'un vin nature ? Le guide pour débuter sans se prendre la tête", excerpt: "Sans soufre ajouté, raisins sans pesticides, fermentations spontanées… On démêle ce qui se cache vraiment derrière l'étiquette « nature ».", date: "Cette semaine", read: "4 min", tag: "Le vin nature", hue: "#7A2638" },
    { title: "5 accords mets & vins natures pour l'automne marseillais", excerpt: "Du pélardon à la daube, nos coups de cœur pour marier les produits de saison avec nos bouteilles du moment.", date: "Semaine dernière", read: "3 min", tag: "Accords", hue: "#CE6A33" }
  ]
};
