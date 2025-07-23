export interface OpticianData {
  id: number;
  nom: string;
  prenom: string;
  nomMagasin: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
  specialites: string[];
  note: number;
  nombreAvis: number;
  image: string;
  description: string;
  horaires: {
    [key: string]: string;
  };
  marques: string[];
}

export const opticiansData: OpticianData[] = [
  {
    id: 1,
    nom: "Martin",
    prenom: "Sophie",
    nomMagasin: "Optique Martin",
    adresse: "12 rue de la République",
    ville: "Paris",
    codePostal: "75001",
    telephone: "01 42 33 44 55",
    email: "sophie.martin@optique-martin.fr",
    specialites: ["Verres progressifs", "Lunettes de sport", "Contactologie"],
    note: 4.8,
    nombreAvis: 127,
    image: "/api/placeholder/300/200",
    description: "Spécialiste en optique depuis 15 ans, nous proposons un large choix de montures tendance et des verres haute technologie.",
    horaires: {
      "Lundi": "9h00 - 19h00",
      "Mardi": "9h00 - 19h00",
      "Mercredi": "9h00 - 19h00",
      "Jeudi": "9h00 - 19h00",
      "Vendredi": "9h00 - 19h00",
      "Samedi": "9h00 - 18h00",
      "Dimanche": "Fermé"
    },
    marques: ["Ray-Ban", "Oakley", "Persol", "Tom Ford", "Gucci"]
  },
  {
    id: 2,
    nom: "Dubois",
    prenom: "Jean-Pierre",
    nomMagasin: "Vision Plus",
    adresse: "45 avenue des Champs-Élysées",
    ville: "Paris",
    codePostal: "75008",
    telephone: "01 45 67 89 12",
    email: "jp.dubois@vision-plus.fr",
    specialites: ["Lunettes de luxe", "Verres anti-lumière bleue", "Montures sur mesure"],
    note: 4.6,
    nombreAvis: 89,
    image: "/api/placeholder/300/200",
    description: "Boutique haut de gamme proposant les plus grandes marques de lunettes et un service personnalisé.",
    horaires: {
      "Lundi": "10h00 - 19h30",
      "Mardi": "10h00 - 19h30",
      "Mercredi": "10h00 - 19h30",
      "Jeudi": "10h00 - 19h30",
      "Vendredi": "10h00 - 19h30",
      "Samedi": "10h00 - 19h00",
      "Dimanche": "14h00 - 18h00"
    },
    marques: ["Cartier", "Dior", "Chanel", "Prada", "Bulgari"]
  },
  {
    id: 3,
    nom: "Lefebvre",
    prenom: "Marie",
    nomMagasin: "Optic 2000 Lefebvre",
    adresse: "78 boulevard Saint-Germain",
    ville: "Paris",
    codePostal: "75005",
    telephone: "01 43 25 67 89",
    email: "marie.lefebvre@optic2000.fr",
    specialites: ["Optique enfant", "Verres progressifs", "Basse vision"],
    note: 4.7,
    nombreAvis: 156,
    image: "/api/placeholder/300/200",
    description: "Opticienne diplômée, spécialiste de l'optique pour toute la famille avec un large choix adapté à tous les budgets.",
    horaires: {
      "Lundi": "9h30 - 19h00",
      "Mardi": "9h30 - 19h00",
      "Mercredi": "9h30 - 19h00",
      "Jeudi": "9h30 - 19h00",
      "Vendredi": "9h30 - 19h00",
      "Samedi": "9h30 - 18h30",
      "Dimanche": "Fermé"
    },
    marques: ["Essilor", "Varilux", "Transitions", "Hugo Boss", "Lacoste"]
  },
  {
    id: 4,
    nom: "Moreau",
    prenom: "Alain",
    nomMagasin: "Optique Moreau",
    adresse: "23 rue de Rivoli",
    ville: "Paris",
    codePostal: "75004",
    telephone: "01 42 78 90 12",
    email: "alain.moreau@optique-moreau.fr",
    specialites: ["Lunettes vintage", "Réparations", "Verres photochromiques"],
    note: 4.5,
    nombreAvis: 73,
    image: "/api/placeholder/300/200",
    description: "Artisan opticien passionné par les montures vintage et les créations uniques. Service de réparation express.",
    horaires: {
      "Lundi": "10h00 - 18h30",
      "Mardi": "10h00 - 18h30",
      "Mercredi": "10h00 - 18h30",
      "Jeudi": "10h00 - 18h30",
      "Vendredi": "10h00 - 18h30",
      "Samedi": "10h00 - 17h00",
      "Dimanche": "Fermé"
    },
    marques: ["Vintage Collection", "Retro Frames", "Classic Design", "Timeless", "Heritage"]
  },
  {
    id: 5,
    nom: "Rousseau",
    prenom: "Catherine",
    nomMagasin: "Krys Rousseau",
    adresse: "156 rue de la Paix",
    ville: "Lyon",
    codePostal: "69002",
    telephone: "04 72 33 44 55",
    email: "catherine.rousseau@krys.fr",
    specialites: ["Optique connectée", "Lunettes anti-fatigue", "Examens de vue"],
    note: 4.9,
    nombreAvis: 203,
    image: "/api/placeholder/300/200",
    description: "Opticienne experte en nouvelles technologies optiques. Équipement de pointe pour des examens précis.",
    horaires: {
      "Lundi": "9h00 - 19h00",
      "Mardi": "9h00 - 19h00",
      "Mercredi": "9h00 - 19h00",
      "Jeudi": "9h00 - 19h00",
      "Vendredi": "9h00 - 19h00",
      "Samedi": "9h00 - 18h00",
      "Dimanche": "Fermé"
    },
    marques: ["Nike", "Adidas", "Carrera", "Police", "Diesel"]
  },
  {
    id: 6,
    nom: "Petit",
    prenom: "François",
    nomMagasin: "Grand Optical Petit",
    adresse: "89 cours Lafayette",
    ville: "Lyon",
    codePostal: "69003",
    telephone: "04 78 56 78 90",
    email: "francois.petit@grandoptical.fr",
    specialites: ["Lunettes solaires", "Sport vision", "Contactologie avancée"],
    note: 4.4,
    nombreAvis: 91,
    image: "/api/placeholder/300/200",
    description: "Spécialiste des lunettes de sport et solaires. Large gamme pour sportifs et amateurs de grand air.",
    horaires: {
      "Lundi": "10h00 - 19h30",
      "Mardi": "10h00 - 19h30",
      "Mercredi": "10h00 - 19h30",
      "Jeudi": "10h00 - 19h30",
      "Vendredi": "10h00 - 19h30",
      "Samedi": "10h00 - 19h00",
      "Dimanche": "14h00 - 18h00"
    },
    marques: ["Maui Jim", "Bollé", "Cébé", "Julbo", "Serengeti"]
  }
];