import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// Preferred source sites for Melbourne architecture
const TRUSTED_DOMAINS = [
  "thedesignfiles.net",
  "architectureau.com",
  "archdaily.com",
  "dezeen.com",
  "openhouse.org.au",
  "heide.com.au",
  "slv.vic.gov.au",
  "vhd.heritagecouncil.vic.gov.au",
  "robinboyd.org.au",
  "johnwardlearchitects.com",
  "woodmarsh.com.au",
  "sixdegrees.com.au",
  "kerstin-thompson.com",
  "nondakatsalidis.com",
];

interface SourceResult {
  articleUrl: string;
  imageUrls: string[];
  citation: string;
}

async function searchForArticle(houseName: string, architect: string, suburb: string): Promise<string | null> {
  // Use Exa-style search via fetch to find the best article
  // We'll construct targeted searches
  const queries = [
    `"${houseName}" ${architect} ${suburb} architecture photos`,
    `"${houseName}" ${suburb} house design`,
    `${architect} ${suburb} house architecture`,
  ];

  for (const query of queries) {
    try {
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; MelbArch/1.0)" },
      });
      const html = await res.text();
      
      // Extract result URLs
      const urlMatches = html.matchAll(/href="(https?:\/\/[^"]+)"/g);
      for (const match of urlMatches) {
        const resultUrl = match[1];
        // Check if it's from a trusted architecture source
        for (const domain of TRUSTED_DOMAINS) {
          if (resultUrl.includes(domain) && !resultUrl.includes("duckduckgo")) {
            return resultUrl;
          }
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

async function extractImagesFromUrl(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MelbArch/1.0)" },
    });
    const html = await res.text();

    // Extract image URLs - look for large content images
    const imgMatches = new Set<string>();
    
    // Match src attributes in img tags
    const srcRegex = /(?:src|data-src|data-lazy-src)=["'](https?:\/\/[^"']+\.(jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi;
    let match;
    while ((match = srcRegex.exec(html)) !== null) {
      const imgUrl = match[1].replace(/&amp;/g, "&");
      // Filter out tiny images, icons, logos, ads
      if (
        !imgUrl.match(/logo|favicon|icon|avatar|sprite|ad-|banner|pixel|widget|badge|button|arrow|social|share|thumb(?:nail)?-\d{2,3}x/i) &&
        !imgUrl.match(/\b(?:50|32|16|24|48|64|96|100|120|150)x\b/i)
      ) {
        imgMatches.add(imgUrl);
      }
    }

    // Also check og:image meta tag - usually the hero image
    const ogMatch = html.match(/property=["']og:image["']\s+content=["'](https?:\/\/[^"']+)["']/);
    if (ogMatch) {
      imgMatches.add(ogMatch[1].replace(/&amp;/g, "&"));
    }

    return Array.from(imgMatches).slice(0, 5); // Max 5 images per source
  } catch {
    return [];
  }
}

// Manually curated best sources for known houses
const KNOWN_SOURCES: Record<string, string> = {
  "Walsh Street House": "https://thedesignfiles.net/2014/03/melbourne-home-walsh-st-house-by-robin-boyd",
  "Heide II": "https://www.heide.com.au/about/heide-buildings-and-gardens",
};

async function main() {
  const houses = await prisma.house.findMany({
    include: {
      images: true,
      architects: { include: { architect: true } },
    },
  });

  console.log(`Processing ${houses.length} houses...\n`);
  let totalAdded = 0;

  for (const house of houses) {
    if (house.images.length > 0) {
      console.log(`  ${house.name || house.address} - already has images, skipping`);
      continue;
    }

    const houseName = house.name || house.address;
    const architectName = house.architects[0]?.architect.name || "";
    console.log(`\n🏠 ${houseName} (${architectName}, ${house.suburb})`);

    // Step 1: Find the best source article
    let articleUrl = KNOWN_SOURCES[houseName] || null;
    
    if (!articleUrl) {
      console.log("  Searching for source article...");
      articleUrl = await searchForArticle(houseName, architectName, house.suburb);
    }

    if (articleUrl) {
      console.log(`  📄 Source: ${articleUrl}`);
      
      // Step 2: Extract images from the article
      const images = await extractImagesFromUrl(articleUrl);
      console.log(`  Found ${images.length} candidate images`);

      if (images.length > 0) {
        // Take the first image (usually the hero/primary shot)
        const primaryImage = images[0];
        const domain = new URL(articleUrl).hostname.replace("www.", "");
        
        await prisma.image.create({
          data: {
            houseId: house.id,
            url: primaryImage,
            sourceType: "ARTICLE",
            sourceCitation: `${domain} - ${houseName}`,
            caption: houseName,
            sortOrder: 0,
          },
        });
        totalAdded++;
        console.log(`  ✓ Added primary image from ${domain}`);

        // Add a second image if available
        if (images.length > 1) {
          await prisma.image.create({
            data: {
              houseId: house.id,
              url: images[1],
              sourceType: "ARTICLE",
              sourceCitation: `${domain} - ${houseName}`,
              caption: `${houseName} - additional view`,
              sortOrder: 1,
            },
          });
          totalAdded++;
        }
      }
    } else {
      console.log("  ✗ No trusted source found");
    }

    // Rate limit between houses
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\n\nDone. Added ${totalAdded} images across ${houses.length} houses.`);
  await prisma.$disconnect();
}

main().catch(console.error);
