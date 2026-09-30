/* All editorial content lives here so sections stay presentational. */

export type ImageAsset = { src: string; alt: string };

export const IMAGES = {
  hero: {
    src: "/images/hero/hero-dish.jpg",
    alt: "Slow-braised lamb shank nihari in a hammered bronze bowl, embers drifting above, beside an antique brass lota and crimson velvet",
  },
  jhinga: {
    src: "/images/menu/tandoori-jhinga.jpg",
    alt: "Charred tandoori tiger prawns on black slate with grilled lemon and green chutney, smoke rising",
  },
  curry: { src: "/images/menu/dish-curry.jpg", alt: "Rich slow-cooked curry in a dark bowl, photographed from above" },
  kebab: { src: "/images/menu/dish-kebab.jpg", alt: "Charcoal-grilled seekh kebabs on saffron rice" },
  biryani: { src: "/images/menu/dish-biryani.jpg", alt: "Dum biryani garnished with fresh herbs on a dark textured surface" },
  dessert: { src: "/images/menu/dish-dessert.jpg", alt: "Gulab jamun in a traditional bowl with slivered almonds" },
  butterChicken: {
    src: "/images/signature/butter-chicken.jpg",
    alt: "Butter chicken in a hammered copper bowl on a dark stone plinth, beside a brass teapot and red silk",
  },
  chef: {
    src: "/images/chef/chef-table.jpg",
    alt: "A chef plating a dish with tweezers at the open kitchen counter while flames rise behind him",
  },
  spices: {
    src: "/images/spices/spice-trail.jpg",
    alt: "Overhead flat lay of saffron, cardamom, black garlic, Kashmiri chillies, coriander and brass on dark stone",
  },
  kitchen: { src: "/images/kitchen/fire-kitchen.jpg", alt: "A wok tossed over a burst of flame in the dark kitchen, smoke rising" },
  seasonal: {
    src: "/images/seasonal/seasonal-dish.jpg",
    alt: "Green herb and coconut curry in a bronze bowl, garnished with a glossy leaf and scattered spices",
  },
  dining: {
    src: "/images/dining/dining-room.jpg",
    alt: "The Khaana dining room in the evening: carved sandstone arches, brass lanterns and candlelit tables",
  },
  privateDining: {
    src: "/images/gatherings/private-dining.jpg",
    alt: "The private dining room with a long candlelit table beneath brass pendant lanterns",
  },
  candlelit: { src: "/images/gatherings/candlelit-room.jpg", alt: "An intimate candlelit table set for a celebration" },
  exterior: { src: "/images/location/exterior.jpg", alt: "The carved stone facade and glowing arched doors of Khaana at night" },
  stone: { src: "/images/reservation/stone-texture.jpg", alt: "" },
  leaf: { src: "/images/location/leaf-texture.jpg", alt: "" },
  reservedTable: { src: "/images/reservation/reserved-table.jpg", alt: "A candlelit table with a reserved card" },
} satisfies Record<string, ImageAsset>;

export const RESTAURANT = {
  name: "Khaana",
  city: "Pune, India",
  addressLines: ["17, Lane 6, North Main Road", "Koregaon Park, Pune 411001"],
  hoursShort: "Open daily 12pm — 11pm",
  phone: "+91 20 4000 1234",
  phoneHref: "tel:+912040001234",
  email: "reservations@khaana.in",
  instagram: "https://www.instagram.com/",
  mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    "North Main Road, Koregaon Park, Pune, Maharashtra 411001",
  )}`,
} as const;

export type NavId = "menu" | "story" | "restaurant" | "reserve";
export const NAV_ITEMS: { id: NavId; label: string; href: string }[] = [
  { id: "menu", label: "Menu", href: "#menu" },
  { id: "story", label: "Story", href: "#story" },
  { id: "restaurant", label: "Restaurant", href: "#restaurant" },
  { id: "reserve", label: "Reserve", href: "#reserve" },
];

export function formatINR(value: number) {
  return `₹${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/* ---------- Menu showcase ---------- */

export type ShowcaseCategory = {
  id: string;
  label: string;
  dish: { name: [string, string]; description: string; price: number; image: ImageAsset; position: string };
  supporting: { name: string; image: ImageAsset; position: string }[];
};

export const MENU_SHOWCASE: ShowcaseCategory[] = [
  {
    id: "small-plates",
    label: "Small Plates",
    dish: {
      name: ["Tandoori", "Jhinga"],
      description: "Tiger prawns, smoked spices, mustard yoghurt.",
      price: 1450,
      image: IMAGES.jhinga,
      position: "52% 58%",
    },
    supporting: [
      { name: "Dal Khaana", image: IMAGES.curry, position: "50% 55%" },
      { name: "Dum Pukht Biryani", image: IMAGES.biryani, position: "50% 50%" },
    ],
  },
  {
    id: "tandoor",
    label: "Tandoor",
    dish: {
      name: ["Kakori", "Seekh"],
      description: "Hand-minced lamb, rose petal, charcoal smoke.",
      price: 1150,
      image: IMAGES.kebab,
      position: "40% 62%",
    },
    supporting: [
      { name: "Tandoori Jhinga", image: IMAGES.jhinga, position: "70% 60%" },
      { name: "Railway Curry", image: IMAGES.curry, position: "45% 50%" },
    ],
  },
  {
    id: "mains",
    label: "Mains",
    dish: {
      name: ["Nalli", "Nihari"],
      description: "Slow-braised lamb shank, bone marrow, saffron.",
      price: 1750,
      image: IMAGES.hero,
      position: "62% 55%",
    },
    supporting: [
      { name: "Butter Chicken", image: IMAGES.butterChicken, position: "48% 40%" },
      { name: "Hariyali Kofta", image: IMAGES.seasonal, position: "62% 45%" },
    ],
  },
  {
    id: "rice",
    label: "Rice",
    dish: {
      name: ["Dum Pukht", "Biryani"],
      description: "Aged basmati, saffron, sealed and slow-cooked.",
      price: 1250,
      image: IMAGES.biryani,
      position: "50% 50%",
    },
    supporting: [
      { name: "Dal Khaana", image: IMAGES.curry, position: "50% 55%" },
      { name: "Nalli Nihari", image: IMAGES.hero, position: "66% 55%" },
    ],
  },
  {
    id: "dessert",
    label: "Dessert",
    dish: {
      name: ["Saffron", "Jamun"],
      description: "Warm gulab jamun, saffron rabri, pistachio.",
      price: 550,
      image: IMAGES.dessert,
      position: "50% 50%",
    },
    supporting: [
      { name: "Coconut Panna Cotta", image: IMAGES.seasonal, position: "70% 50%" },
      { name: "Shahi Tukda", image: IMAGES.biryani, position: "45% 50%" },
    ],
  },
];

/* ---------- Full menu (dialog) ---------- */

export type DietTag = "V" | "GF" | "N";
export type MenuItem = { name: string; description: string; price: number; tags?: DietTag[]; signature?: boolean };
export type MenuSection = { id: string; title: string; intro: string; image: ImageAsset; items: MenuItem[] };

export const FULL_MENU: MenuSection[] = [
  {
    id: "small-plates",
    title: "Small Plates",
    intro: "Street memories, plated with restraint.",
    image: IMAGES.jhinga,
    items: [
      { name: "Tandoori Jhinga", description: "Tiger prawns, smoked spices, mustard yoghurt", price: 1450, tags: ["GF"] },
      { name: "Dahi Ke Kebab", description: "Hung curd, rose petal, beetroot chutney", price: 650, tags: ["V"] },
      { name: "Chaat Khaana", description: "Crisp lotus stem, tamarind, pomegranate, sev", price: 595, tags: ["V"] },
      { name: "Galouti on Sheermal", description: "Melting lamb, saffron brioche, onion jam", price: 895 },
    ],
  },
  {
    id: "tandoor",
    title: "Tandoor",
    intro: "Clay, charcoal and patience.",
    image: IMAGES.kebab,
    items: [
      { name: "Kakori Seekh", description: "Hand-minced lamb, rose petal, charcoal smoke", price: 1150 },
      { name: "Malai Broccoli", description: "Aged cheddar, cardamom cream, burnt garlic", price: 750, tags: ["V", "GF"] },
      { name: "Achari Paneer Tikka", description: "Pickling spices, charred peppers, mint", price: 795, tags: ["V", "GF"] },
      { name: "Burrah Chop", description: "Lamb chops, Kashmiri chilli, black cardamom", price: 1650, tags: ["GF"] },
    ],
  },
  {
    id: "mains",
    title: "Mains",
    intro: "Heirloom recipes, slow-cooked and reimagined.",
    image: IMAGES.butterChicken,
    items: [
      {
        name: "Butter Chicken Reimagined",
        description: "Smoked tikka, tomato velouté, cultured butter, fenugreek",
        price: 1350,
        signature: true,
      },
      { name: "Nalli Nihari", description: "Slow-braised lamb shank, bone marrow, saffron", price: 1750 },
      { name: "Dal Khaana", description: "Black lentils simmered for 48 hours, white butter", price: 695, tags: ["V", "GF"] },
      { name: "Malvani Pomfret", description: "Kokum, coconut, coastal masala", price: 1450, tags: ["GF"] },
    ],
  },
  {
    id: "rice",
    title: "Rice & Breads",
    intro: "Sealed pots, open fires.",
    image: IMAGES.biryani,
    items: [
      { name: "Dum Pukht Biryani", description: "Aged basmati, saffron, lamb or jackfruit", price: 1250 },
      { name: "Truffle Kulcha", description: "Tandoor-baked, black truffle, aged ghee", price: 450, tags: ["V"] },
      { name: "Saffron Pulao", description: "Kashmiri saffron, fried shallots, rose", price: 495, tags: ["V", "GF"] },
      { name: "Bread Basket", description: "Roomali, laccha paratha, garlic naan", price: 395, tags: ["V"] },
    ],
  },
  {
    id: "dessert",
    title: "Dessert",
    intro: "A sweet, slow ending.",
    image: IMAGES.dessert,
    items: [
      { name: "Saffron Jamun", description: "Warm gulab jamun, saffron rabri, pistachio", price: 550, tags: ["V", "N"] },
      { name: "Shahi Tukda", description: "Brioche, reduced milk, silver leaf, rose", price: 525, tags: ["V", "N"] },
      { name: "Kulfi Falooda", description: "Hand-churned kulfi, basil seeds, vermicelli", price: 495, tags: ["V"] },
    ],
  },
  {
    id: "seasonal",
    title: "Seasonal",
    intro: "Fresh ingredients. Inspired dishes. Limited time only.",
    image: IMAGES.seasonal,
    items: [
      { name: "Kale & Pear Kebab", description: "Charred kale, Nashik pear, pink peppercorn", price: 650, tags: ["V"] },
      { name: "Mango Prawn Curry", description: "Alphonso, coconut, curry leaf tempering", price: 1250, tags: ["GF"] },
      { name: "Jackfruit Biryani", description: "Young jackfruit, aged basmati, rose", price: 950, tags: ["V"] },
      { name: "Coconut Panna Cotta", description: "Jaggery caramel, toasted sesame", price: 550, tags: ["V", "GF"] },
    ],
  },
];

export const SEASONAL_MENU = FULL_MENU.find((section) => section.id === "seasonal")?.items ?? [];

/* ---------- Ingredients ---------- */

export type Ingredient = { n: string; name: string; origin: string };

export const INGREDIENTS: Ingredient[] = [
  { n: "01", name: "Saffron", origin: "Pampore, Kashmir" },
  { n: "02", name: "Cardamom", origin: "Idukki, Kerala" },
  { n: "03", name: "Black Garlic", origin: "Aged 40 days in-house" },
  { n: "04", name: "Kashmiri Chilli", origin: "Kashmir Valley" },
  { n: "05", name: "Coriander", origin: "Ramganj Mandi, Rajasthan" },
  { n: "06", name: "Stone Fruits", origin: "Nashik orchards" },
  { n: "07", name: "Handpicked Spices", origin: "Hand-pounded daily" },
];

/**
 * Collage tiles: desktop rect (x/y/w/h) and mobile rect (mx/my/mw/mh) in % of the collage,
 * plus a focal point (fx/fy, % of the source photo) and zoom so each tile frames one ingredient.
 */
export type SpiceTile = {
  id: string;
  ingredient: string | null;
  label: string | null;
  rect: [number, number, number, number];
  mobile: [number, number, number, number] | null;
  focal: [number, number];
  zoom: number;
  speed: number;
};

export const SPICE_TILES: SpiceTile[] = [
  { id: "t1", ingredient: "07", label: "07", rect: [0, 0, 17.3, 52.6], mobile: [50.6, 67.4, 49.4, 32.6], focal: [24, 32], zoom: 1.7, speed: 5 },
  { id: "t2", ingredient: "02", label: "02", rect: [0, 53.4, 17.3, 46.6], mobile: [50.6, 0, 49.4, 32.6], focal: [17, 72], zoom: 2, speed: -4 },
  { id: "t3", ingredient: "07", label: null, rect: [17.75, 0, 25.6, 100], mobile: null, focal: [34, 50], zoom: 1.25, speed: 3 },
  { id: "t4", ingredient: "01", label: "01", rect: [43.8, 0, 17.6, 55], mobile: [0, 0, 49.4, 32.6], focal: [50, 37], zoom: 1.9, speed: -5 },
  { id: "t5", ingredient: "06", label: "06", rect: [43.8, 55.8, 17.6, 44.2], mobile: [0, 67.4, 49.4, 32.6], focal: [52, 68], zoom: 1.8, speed: 4 },
  { id: "t6", ingredient: "03", label: "03", rect: [61.85, 0, 17.6, 60], mobile: [0, 33.7, 32.6, 32.6], focal: [65, 9], zoom: 1.8, speed: 6 },
  { id: "t7", ingredient: "05", label: "05", rect: [61.85, 60.8, 17.6, 39.2], mobile: [67.4, 33.7, 32.6, 32.6], focal: [72, 74], zoom: 2, speed: -3 },
  { id: "t8", ingredient: "04", label: "04", rect: [79.9, 0, 20.1, 100], mobile: [33.7, 33.7, 32.6, 32.6], focal: [86, 40], zoom: 1.5, speed: 4 },
];

/* ---------- Small metadata lists ---------- */

export const CHEF_NOTES = ["Seasonal", "Specials", "Live Cooking", "Limited Seats"];
export const KITCHEN_NOTES = ["Temperature", "Flame", "Texture", "Taste"];

export type ServiceHour = { label: string; value: string; icon: "sun" | "moon" | "door" };
export const SERVICE_HOURS: ServiceHour[] = [
  { label: "Lunch", value: "12pm — 3pm", icon: "sun" },
  { label: "Dinner", value: "6pm — 11pm", icon: "moon" },
  { label: "Private Dining", value: "Available", icon: "door" },
];

/* ---------- Private dining ---------- */

export type PrivateSpace = { id: string; name: string; capacity: string; description: string; image: ImageAsset };
export const PRIVATE_SPACES: PrivateSpace[] = [
  {
    id: "jharokha",
    name: "The Jharokha Room",
    capacity: "Up to 14 guests",
    description: "A candlelit room framed by carved stone jali and a cluster of brass lanterns.",
    image: IMAGES.privateDining,
  },
  {
    id: "courtyard",
    name: "The Courtyard Table",
    capacity: "Up to 24 guests",
    description: "A long table beneath the arches, for celebrations that deserve a little theatre.",
    image: IMAGES.candlelit,
  },
  {
    id: "buyout",
    name: "Full Buyout",
    capacity: "Up to 80 guests",
    description: "The entire restaurant, a bespoke menu and a team devoted to your evening.",
    image: IMAGES.dining,
  },
];

/* ---------- Editorial copy for dialogs ---------- */

export const PHILOSOPHY = [
  {
    title: "Fire",
    body: "Everything begins at the flame — the tandoor, the sigri, the iron kadhai. We cook over charcoal and wood because fire gives Indian food its soul.",
  },
  {
    title: "Time",
    body: "Our dal simmers for forty-eight hours. Our garlic ages for forty days. We make masalas by hand every morning, because some flavours can't be rushed.",
  },
  {
    title: "Craft",
    body: "Heirloom recipes collected from home kitchens across India, re-read through modern technique and plated with the restraint they deserve.",
  },
];

export const LEGAL = {
  privacy: [
    "We collect only the details needed to manage your reservation or enquiry — your name, contact details and preferences.",
    "Your information is never sold. It is used solely to confirm bookings, contact you about your visit and, if you subscribe, to share seasonal news.",
    "To access or delete your data, write to reservations@khaana.in and we will respond within 7 days.",
  ],
  terms: [
    "Tables are held for 15 minutes past the reserved time. Please let us know if you are running late.",
    "Reservations for 7 or more guests may require a card guarantee. Cancellations within 24 hours may incur a charge.",
    "Menus change with the seasons. Please inform us of any allergies — our kitchen handles nuts, dairy and gluten.",
  ],
};
