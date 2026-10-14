export const projects = [
  {
    slug: "atharva-coffee",
    name: "ATHARVA COFFEE",
    category: "Café / Interactive website",
    year: "2026",
    type: "atharva",
    demoUrl: "https://atharvacoffee.store",
    title: "A little pause. A lovely coffee.",
    description:
      "A fully browsable website demo for a fictional neighbourhood café, built by Arvion Studios.",
    brief:
      "Bring the warmth of a neighbourhood café online, with a menu that is easy to explore and playful details that invite visitors to stay.",
    response:
      "Cream and espresso colours, original café illustrations, a scroll-driven coffee cup, a filterable and printable menu, and an interactive croissant game. Responsive layouts and reduced-motion fallbacks keep the experience welcoming.",
    value:
      "Designed to show how an independent café can express its personality while keeping its menu and visit information easy to find. Business details are samples; ordering and reservations are not connected.",
    color: "peach",
  },
  {
    slug: "daybreak-coffee",
    name: "DAYBREAK",
    category: "Coffee shop / Menu & discovery",
    year: "2026",
    type: "coffee",
    title: "Your daily ritual. A little brighter.",
    description:
      "A warm, playful website concept for an imagined neighbourhood coffee shop.",
    brief:
      "Help a first-time visitor feel the atmosphere, browse the menu, and find the café without hunting for information.",
    response:
      "A characterful coffee identity, an easy-to-scan menu, and prominent opening hours and directions. Playful visuals introduce the feeling of the space.",
    value:
      "Designed to turn online curiosity into a clearer plan to visit, with the everyday details close at hand.",
    color: "peach",
  },
  {
    slug: "goodform-salon",
    name: "GOODFORM",
    category: "Salon / Services & appointments",
    year: "2026",
    type: "salon",
    title: "Good hair. Great first impressions.",
    description:
      "A confident digital identity for a fictional independent hair salon.",
    brief:
      "Make it easy to understand the salon’s style, compare services, and take the next step toward an appointment.",
    response:
      "Bold editorial typography, a focused service menu, and a clear booking entry point. A friendly personality runs through every small detail.",
    value:
      "Designed to help new customers find the right service and reduce the friction between browsing and booking.",
    color: "lilac",
  },
  {
    slug: "homebase-services",
    name: "HOMEBASE",
    category: "Local services / Quote inquiries",
    year: "2026",
    type: "services",
    title: "A good home for a local business.",
    description:
      "An approachable website concept for an imagined home maintenance business.",
    brief:
      "Explain what the business does, where it works, and how to request help—especially on a phone.",
    response:
      "Straightforward service descriptions, visible service areas, and a short quote inquiry flow. Warm design makes practical information easy to approach.",
    value:
      "Designed to help homeowners identify the right service and send a more useful inquiry with less back-and-forth.",
    color: "mint",
  },
] as const;
export type Project = (typeof projects)[number];
