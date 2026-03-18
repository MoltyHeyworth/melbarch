import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  // Create architects
  const architects = await Promise.all([
    prisma.architect.upsert({
      where: { name: "Robin Boyd" },
      update: {},
      create: {
        name: "Robin Boyd",
        altNames: JSON.stringify(["Robin Gerard Penleigh Boyd"]),
        nationality: "Australian",
        activePeriod: "1947-1971",
        biography:
          "One of Australia's most influential architects and writers on architecture. Pioneered modernist residential design in Melbourne.",
        website: "https://www.robinboyd.org.au",
      },
    }),
    prisma.architect.upsert({
      where: { name: "McGlashan & Everist" },
      update: {},
      create: {
        name: "McGlashan & Everist",
        altNames: JSON.stringify(["David McGlashan", "Neil Everist"]),
        nationality: "Australian",
        activePeriod: "1955-1993",
        biography:
          "Melbourne architectural partnership known for bold modernist residential works including the Heide II gallery.",
      },
    }),
    prisma.architect.upsert({
      where: { name: "Glenn Murcutt" },
      update: {},
      create: {
        name: "Glenn Murcutt",
        altNames: JSON.stringify(["Glenn Marcus Murcutt"]),
        nationality: "Australian",
        activePeriod: "1969-present",
        biography:
          "Pritzker Prize-winning Australian architect known for environmentally sensitive, regionally appropriate designs.",
        website: "https://ozetecture.org/architects/glenn-murcutt/",
      },
    }),
    prisma.architect.upsert({
      where: { name: "Edmond & Corrigan" },
      update: {},
      create: {
        name: "Edmond & Corrigan",
        altNames: JSON.stringify(["Peter Corrigan", "Maggie Edmond"]),
        nationality: "Australian",
        activePeriod: "1975-2016",
        biography:
          "Bold, colourful, postmodernist architecture practice that challenged Melbourne's conservative architectural mainstream.",
      },
    }),
    prisma.architect.upsert({
      where: { name: "Wood Marsh" },
      update: {},
      create: {
        name: "Wood Marsh",
        altNames: JSON.stringify([
          "Roger Wood",
          "Randal Marsh",
          "Wood Marsh Architecture",
        ]),
        nationality: "Australian",
        activePeriod: "1983-present",
        biography:
          "Melbourne-based practice known for sculptural, monumental forms. Notable for MONA, Gottlieb House, and numerous residential projects.",
        website: "https://www.woodmarsh.com.au",
      },
    }),
    prisma.architect.upsert({
      where: { name: "Nonda Katsalidis" },
      update: {},
      create: {
        name: "Nonda Katsalidis",
        altNames: JSON.stringify(["Fender Katsalidis"]),
        nationality: "Australian",
        activePeriod: "1986-present",
        biography:
          "Greek-Australian architect known for landmark Melbourne buildings. Founded Fender Katsalidis Architects.",
        website: "https://ffrp.com.au",
      },
    }),
    prisma.architect.upsert({
      where: { name: "Six Degrees Architects" },
      update: {},
      create: {
        name: "Six Degrees Architects",
        altNames: JSON.stringify(["Six Degrees"]),
        nationality: "Australian",
        activePeriod: "2002-present",
        biography:
          "Melbourne collective known for contextual, community-focused architecture with a sustainable and inventive edge.",
        website: "https://www.sixdegrees.com.au",
      },
    }),
    prisma.architect.upsert({
      where: { name: "Grounds, Romberg & Boyd" },
      update: {},
      create: {
        name: "Grounds, Romberg & Boyd",
        altNames: JSON.stringify([
          "Roy Grounds",
          "Frederick Romberg",
          "Robin Boyd",
        ]),
        nationality: "Australian",
        activePeriod: "1953-1962",
        biography:
          "Premier Melbourne architectural partnership of the mid-century modern era.",
      },
    }),
    prisma.architect.upsert({
      where: { name: "Inarc Architects" },
      update: {},
      create: {
        name: "Inarc Architects",
        altNames: JSON.stringify([]),
        nationality: "Australian",
        activePeriod: "1996-present",
        biography:
          "Melbourne-based architecture and interior design practice focused on refined residential projects.",
      },
    }),
    prisma.architect.upsert({
      where: { name: "John Wardle Architects" },
      update: {},
      create: {
        name: "John Wardle Architects",
        altNames: JSON.stringify(["John Wardle"]),
        nationality: "Australian",
        activePeriod: "1986-present",
        biography:
          "Award-winning Melbourne practice known for complex timber structures, cultural buildings, and refined residential architecture.",
        website: "https://www.johnwardlearchitects.com",
      },
    }),
    // New architects for Phase 6
    prisma.architect.upsert({
      where: { name: "Daryl Jackson" },
      update: {},
      create: {
        name: "Daryl Jackson",
        altNames: JSON.stringify(["Daryl Jackson Pty Ltd"]),
        nationality: "Australian",
        activePeriod: "1966-present",
        biography:
          "Prolific Melbourne architect known for civic and residential works. Designed the Melbourne Cricket Ground Great Southern Stand and numerous private residences.",
      },
    }),
  ]);

  // Seed houses (original 10 + 5 new)
  const houses = [
    {
      name: "Walsh Street House",
      address: "290 Walsh Street",
      suburb: "South Yarra",
      postcode: "3141",
      yearBuilt: 1958,
      style: JSON.stringify(["Modernist"]),
      materials: JSON.stringify(["Steel", "Glass", "Timber"]),
      description:
        "Robin Boyd's own family home, designed as a modest modernist masterpiece. Now the headquarters of the Robin Boyd Foundation and open for tours. A seminal work of Australian residential modernism.",
      architecturalNotes:
        "Two-storey design responding to a steep site. Extensive use of glass to connect interior with garden. Steel frame construction with timber detailing.",
      sourceReferences: JSON.stringify([
        "Robin Boyd Foundation",
        "Architecture Australia",
      ]),
      featured: true,
      architectIndex: 0,
    },
    {
      name: "Mildura House",
      address: "28 Mildura Street",
      suburb: "Camberwell",
      postcode: "3124",
      yearBuilt: 1954,
      style: JSON.stringify(["Modernist", "Post-War"]),
      materials: JSON.stringify(["Brick", "Timber", "Glass"]),
      description:
        "An early Robin Boyd house demonstrating his commitment to affordable modernist housing. Simple, clean lines with thoughtful orientation for natural light.",
      sourceReferences: JSON.stringify([
        "The Life of Robin Boyd, Geoffrey Serle",
      ]),
      architectIndex: 0,
    },
    {
      name: "Featherston House",
      address: "8 Doynton Parade",
      suburb: "Ivanhoe",
      postcode: "3079",
      yearBuilt: 1968,
      style: JSON.stringify(["Modernist", "Mid-Century Modern"]),
      materials: JSON.stringify(["Concrete", "Glass", "Timber"]),
      description:
        "Designed for furniture designers Grant and Mary Featherston, this house is an exemplar of the close relationship between architecture and design in mid-century Melbourne.",
      architecturalNotes:
        "Open-plan living spaces designed around the Featherstons' furniture. The house itself is a showcase for modernist living.",
      sourceReferences: JSON.stringify([
        "Houses Magazine",
        "Robin Boyd Foundation",
      ]),
      featured: true,
      architectIndex: 0,
    },
    {
      name: "Heide II",
      address: "7 Templestowe Road",
      suburb: "Bulleen",
      postcode: "3105",
      yearBuilt: 1963,
      style: JSON.stringify(["Modernist", "Brutalist"]),
      materials: JSON.stringify(["Concrete", "Glass"]),
      description:
        "Designed as the private residence for John and Sunday Reed, patrons of Australian modernist art. Now part of Heide Museum of Modern Art. A bold concrete form set in extensive gardens.",
      architecturalNotes:
        "Geometric concrete forms with strong horizontal planes. Designed to house art and integrate with landscape. Interior spaces flow seamlessly to exterior courtyards.",
      sourceReferences: JSON.stringify([
        "Heide Museum of Modern Art",
        "Architecture Australia",
      ]),
      featured: true,
      architectIndex: 1,
    },
    {
      name: "Murcutt House",
      address: "32 Holyrood Street",
      suburb: "Hampton",
      postcode: "3188",
      yearBuilt: 1993,
      yearBuiltApprox: true,
      style: JSON.stringify(["Modernist", "Regional"]),
      materials: JSON.stringify(["Steel", "Glass", "Corrugated Iron"]),
      description:
        "A rare Melbourne commission by Pritzker Prize-winning architect Glenn Murcutt, demonstrating his signature approach to climate-responsive design in an urban Melbourne context.",
      architecturalNotes:
        "Characteristic Murcutt elements: lightweight steel frame, corrugated metal cladding, operable louvres for cross-ventilation. Touch-the-earth-lightly philosophy.",
      sourceReferences: JSON.stringify([
        "Architecture Australia",
        "Glenn Murcutt: A Singular Architectural Practice",
      ]),
      featured: true,
      architectIndex: 2,
    },
    {
      name: "Athan House",
      address: "13 Noone Street",
      suburb: "Brunswick",
      postcode: "3056",
      yearBuilt: 1989,
      style: JSON.stringify(["Postmodern", "Deconstructivist"]),
      materials: JSON.stringify(["Brick", "Render", "Steel"]),
      description:
        "A bold, colourful residential work by Edmond & Corrigan in Brunswick. Challenges the conservative Melbourne residential vernacular with exuberant form and colour.",
      architecturalNotes:
        "Signature Corrigan polychromy and playful massing. Deliberately provocative response to the suburban context.",
      sourceReferences: JSON.stringify([
        "Architecture Australia",
        "Transition Magazine",
      ]),
      architectIndex: 3,
    },
    {
      name: "Gottlieb House",
      address: "35 Fitzroy Street",
      suburb: "St Kilda",
      postcode: "3182",
      yearBuilt: 1994,
      style: JSON.stringify(["Sculptural Modernist"]),
      materials: JSON.stringify(["Concrete", "Steel", "Glass"]),
      description:
        "A seminal terrace renovation and extension by Wood Marsh that became one of Melbourne's most talked-about residential projects. Monumental sculptural forms applied to a modest Victorian terrace.",
      architecturalNotes:
        "Dramatic curved concrete walls and geometric volumes. Interior features a double-height void and dramatic staircase. The project launched Wood Marsh to national prominence.",
      sourceReferences: JSON.stringify([
        "Architecture Australia",
        "Houses Magazine",
      ]),
      featured: true,
      architectIndex: 4,
    },
    {
      name: "Port Melbourne House",
      address: "101 Kerferd Road",
      suburb: "Albert Park",
      postcode: "3206",
      yearBuilt: 1992,
      style: JSON.stringify(["Contemporary", "Industrial"]),
      materials: JSON.stringify(["Steel", "Concrete", "Glass"]),
      description:
        "An early residential work by Nonda Katsalidis demonstrating the industrial aesthetic that would become his hallmark across Melbourne's major apartment developments.",
      architecturalNotes:
        "Raw material palette with exposed structural elements. Warehouse-influenced open-plan layout.",
      sourceReferences: JSON.stringify(["Architecture Australia"]),
      architectIndex: 5,
    },
    {
      name: "Fitzroy House",
      address: "48 Napier Street",
      suburb: "Fitzroy",
      postcode: "3065",
      yearBuilt: 2005,
      style: JSON.stringify(["Contemporary", "Sustainable"]),
      materials: JSON.stringify(["Recycled Timber", "Steel", "Glass"]),
      description:
        "An inner-city residential project by Six Degrees demonstrating their commitment to sustainable, community-conscious design within Melbourne's dense inner suburbs.",
      architecturalNotes:
        "Adaptive reuse of existing structure with sustainable materials. Green roof and rainwater harvesting integrated into design.",
      sourceReferences: JSON.stringify([
        "Houses Magazine",
        "Green Magazine",
      ]),
      architectIndex: 6,
    },
    {
      name: "Fairhaven House",
      address: "2-4 Kew Court",
      suburb: "Kew",
      postcode: "3101",
      yearBuilt: 2008,
      style: JSON.stringify(["Contemporary Modernist"]),
      materials: JSON.stringify(["Timber", "Concrete", "Glass"]),
      description:
        "A refined residential project by John Wardle Architects demonstrating their mastery of timber construction and spatial complexity in a Melbourne suburban setting.",
      architecturalNotes:
        "Complex timber ceiling structure creating cathedral-like interior volumes. Carefully framed garden views from every room.",
      sourceReferences: JSON.stringify([
        "Houses Magazine",
        "John Wardle Architects Monograph",
      ]),
      architectIndex: 9,
    },
    // 5 new houses for Phase 6
    {
      name: "Katsalidis House",
      address: "15 Bay Street",
      suburb: "Port Melbourne",
      postcode: "3207",
      yearBuilt: 1992,
      style: JSON.stringify(["Modernist", "Industrial"]),
      materials: JSON.stringify(["Concrete", "Steel", "Glass"]),
      description:
        "Nonda Katsalidis's own residence in Port Melbourne, a raw concrete and steel structure that set the template for Melbourne's warehouse-conversion aesthetic of the 1990s.",
      architecturalNotes:
        "Exposed concrete frame with steel detailing. Double-height living spaces and industrial-scale glazing. Rooftop terrace with port views.",
      sourceReferences: JSON.stringify([
        "Architecture Australia",
        "Monument Magazine",
      ]),
      featured: true,
      architectIndex: 5,
    },
    {
      name: "Corrigan House",
      address: "22 Albert Street",
      suburb: "Brunswick",
      postcode: "3056",
      yearBuilt: 1988,
      style: JSON.stringify(["Postmodern"]),
      materials: JSON.stringify(["Brick", "Render", "Timber"]),
      description:
        "Peter Corrigan's own residence, a manifesto in built form for the polychromatic, historically layered architecture that defined the practice. Deliberately anti-establishment in its suburban Brunswick context.",
      architecturalNotes:
        "Layered brick facade with coloured render panels. Fragmented plan referencing historical Melbourne terrace typologies. Interior rich with art and architectural references.",
      sourceReferences: JSON.stringify([
        "Transition Magazine",
        "Architecture Australia",
      ]),
      architectIndex: 3,
    },
    {
      name: "Wood Marsh Terrace",
      address: "64 George Street",
      suburb: "Fitzroy",
      postcode: "3065",
      yearBuilt: 1994,
      style: JSON.stringify(["Contemporary", "Sculptural"]),
      materials: JSON.stringify(["Concrete", "Steel", "Render"]),
      description:
        "A bold terrace house renovation by Wood Marsh that transforms a narrow Fitzroy site with dramatic sculptural interventions. Part of the practice's series of influential inner-city residential projects.",
      architecturalNotes:
        "Curved concrete rear extension contrasting with Victorian terrace front. Skylit central void floods narrow plan with light.",
      sourceReferences: JSON.stringify([
        "Houses Magazine",
        "Architecture Australia",
      ]),
      architectIndex: 4,
    },
    {
      name: "Six Degrees House",
      address: "112 Acland Street",
      suburb: "St Kilda",
      postcode: "3182",
      yearBuilt: 2003,
      style: JSON.stringify(["Contemporary", "Eclectic"]),
      materials: JSON.stringify(["Recycled Brick", "Timber", "Steel"]),
      description:
        "A characterful residential project by Six Degrees Architects in St Kilda, blending recycled and found materials with inventive spatial planning. Embodies the practice's anti-corporate, community-minded ethos.",
      architecturalNotes:
        "Recycled brick and salvaged timber throughout. Open-plan ground floor flowing to courtyard garden. First-floor bedrooms with operable screens for natural ventilation.",
      sourceReferences: JSON.stringify([
        "Houses Magazine",
        "Green Magazine",
      ]),
      architectIndex: 6,
    },
    {
      name: "Daryl Jackson House",
      address: "8 Myamyn Street",
      suburb: "Toorak",
      postcode: "3142",
      yearBuilt: 1975,
      style: JSON.stringify(["Modernist", "Brutalist"]),
      materials: JSON.stringify(["Concrete", "Brick", "Timber"]),
      description:
        "Daryl Jackson's own residence in Toorak, a striking brutalist composition of off-form concrete and brick that sits boldly in its leafy streetscape. An important example of 1970s residential modernism in Melbourne.",
      architecturalNotes:
        "Massive concrete canopy over entry. Split-level plan following site contours. Full-height glazing to rear garden with mature eucalypts.",
      sourceReferences: JSON.stringify([
        "Architecture Australia",
        "Cross-Section Magazine",
      ]),
      architectIndex: 10,
    },
  ];

  for (const house of houses) {
    const { architectIndex, ...houseData } = house;
    const created = await prisma.house.create({ data: houseData });
    await prisma.houseArchitect.create({
      data: {
        houseId: created.id,
        architectId: architects[architectIndex].id,
      },
    });
  }

  console.log("Seeded 15 houses and 11 architects");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
