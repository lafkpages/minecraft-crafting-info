const REGEX =
  /<tr>\s*<td.*?>\s*(.+?)\s*<\/td>\s*<td.*?>\s*(.+?)\s*<\/td>\s*<td.*?>\s*<img.*?src="(.+?)".+?<\/td>\s*<td.*?>\s*(.+?)\s*<\/td>/gim;

export const baseUrl = "https://www.minecraftcrafting.info";

export interface Recipe {
  itemName: string;
  itemDescription: string;

  materials: string;
  materialsList: string[];

  recipeImage: URL;
}

export async function fetchRecipes() {
  const html = await fetch(baseUrl).then((r) => r.text());

  return parseRecipes(html);
}

export function parseRecipes(html: string) {
  const recipeMatches = html.matchAll(REGEX);
  const recipes: Recipe[] = [];

  for (const match of recipeMatches) {
    let [, itemName, materials, recipeImage, itemDescription] = match;

    itemName = cleanHtml(itemName);
    materials = cleanHtml(materials);
    itemDescription = cleanHtml(itemDescription);

    recipes.push({
      itemName,
      itemDescription,

      materials,
      materialsList: materials.split(/\s*(?:&amp;)\s*|\s+or\s+/i),

      recipeImage: new URL(recipeImage, baseUrl),
    });
  }

  return recipes;
}

function cleanHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

if (process.isBun && import.meta.main) {
  fetchRecipes().then(console.table);
}
