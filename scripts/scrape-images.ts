import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// Wikipedia search terms for each house
const WIKI_SEARCHES: Record<string, string[]> = {
  "Walsh Street House": ["Walsh_Street_House", "Robin_Boyd"],
  "Mildura House": ["Robin_Boyd"],
  "Featherston House": ["Robin_Boyd", "Featherston_House"],
  "Heide II": ["Heide_Museum_of_Modern_Art"],
  "Murcutt House": ["Glenn_Murcutt"],
  "Athan House": ["Edmond_and_Corrigan"],
  "Gottlieb House": ["Wood_Marsh"],
  "Katsalidis House": ["Nonda_Katsalidis"],
  "Corrigan House": ["Edmond_and_Corrigan"],
  "Wood Marsh Terrace": ["Wood_Marsh"],
  "Daryl Jackson House": ["Daryl_Jackson"],
  "Fairhaven House": ["John_Wardle"],
};

async function getWikipediaImage(searchTerm: string): Promise<{url: string, citation: string} | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(searchTerm)}&prop=pageimages&piprop=original&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    
    for (const pageId of Object.keys(pages)) {
      const page = pages[pageId];
      if (page.original?.source) {
        return {
          url: page.original.source,
          citation: `Wikipedia Commons - ${page.title}`,
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function getWikimediaSearch(query: string): Promise<{url: string, citation: string} | null> {
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5&format=json`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    const results = data?.query?.search;
    if (!results || results.length === 0) return null;

    // Find first image result (not PDF)
    for (const result of results) {
      const title = result.title as string;
      if (title.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        // Get the actual file URL
        const fileUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
        const fileRes = await fetch(fileUrl);
        const fileData = await fileRes.json();
        const pages = fileData?.query?.pages;
        for (const pid of Object.keys(pages)) {
          const info = pages[pid]?.imageinfo?.[0];
          if (info?.url) {
            return {
              url: info.url,
              citation: `Wikimedia Commons - ${title.replace('File:', '')}`,
            };
          }
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  const houses = await prisma.house.findMany({
    include: {
      images: true,
      architects: { include: { architect: true } },
    },
  });

  console.log(`Found ${houses.length} houses, checking for images...`);
  let added = 0;

  for (const house of houses) {
    if (house.images.length > 0) {
      console.log(`  ${house.name || house.address} - already has ${house.images.length} images, skipping`);
      continue;
    }

    const houseName = house.name || house.address;
    const architectName = house.architects[0]?.architect.name || "";
    console.log(`  ${houseName} (${architectName}) - searching...`);

    let image: {url: string, citation: string} | null = null;

    // Try Wikipedia article for the house
    const searches = WIKI_SEARCHES[houseName] || [];
    for (const term of searches) {
      image = await getWikipediaImage(term);
      if (image) break;
    }

    // Try Wikimedia Commons search
    if (!image) {
      image = await getWikimediaSearch(`${houseName} ${house.suburb} architecture`);
    }
    if (!image && architectName) {
      image = await getWikimediaSearch(`${architectName} house Melbourne`);
    }

    if (image) {
      await prisma.image.create({
        data: {
          houseId: house.id,
          url: image.url,
          sourceType: "WIKIMEDIA",
          sourceCitation: image.citation,
          caption: `${houseName}`,
          sortOrder: 0,
        },
      });
      added++;
      console.log(`    ✓ Found: ${image.citation}`);
    } else {
      console.log(`    ✗ No image found`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone. Added ${added} images.`);
  await prisma.$disconnect();
}

main().catch(console.error);
