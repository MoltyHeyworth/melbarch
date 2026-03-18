/* eslint-disable @typescript-eslint/no-explicit-any */
export function getCompletenessScore(house: any): {
  score: number;
  max: number;
  pct: number;
} {
  let score = 0;
  const max = 15;

  if (house.name) score++;
  if (house.architectureFirm) score++;

  const styleArr = safeArr(house.style);
  if (styleArr.length > 0) score++;

  const matArr = safeArr(house.materials);
  if (matArr.length > 0) score++;

  if (house.description) score++;
  if (house.architecturalNotes) score++;
  if (house.bedrooms) score++;
  if (house.landSizeSqm) score++;
  if (house.floorAreaSqm) score++;

  const srcArr = safeArr(house.sourceReferences);
  if (srcArr.length > 0) score++;

  if (house.ownerContact) score++;
  if (house.featured) score++;

  // Bonus for related data
  if (house.awards && house.awards.length > 0) score++;
  if (house.images && house.images.length > 0) score++;
  
  // Architects count
  if (house.architects && house.architects.length > 0) score++;

  const pct = Math.round((score / max) * 100);
  return { score, max, pct };
}

function safeArr(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
