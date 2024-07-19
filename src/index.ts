const REGEX =
  /<tr>\s*<td.*?>\s*(.+?)\s*<\/td>\s*<td.*?>\s*(.+?)\s*<\/td>\s*<td.*?>\s*<img.*?src="(.+?)".+?<\/td>\s*<td.*?>\s*(.+?)\s*<\/td>/gim;

export const baseUrl = "https://www.minecraftcrafting.info";

export interface Recipe {
  itemName: string;
  itemDescription: string;

  materials: string;
  recipeImage: URL;
}

export async function fetchRecipes() {
  const html = await fetch(baseUrl).then((r) => r.text());

  const recipeMatches = html.matchAll(REGEX);
  const recipes: Recipe[] = [];

  for (const match of recipeMatches) {
    const [, itemName, materials, recipeImage, itemDescription] = match;
    recipes.push({
      itemName,
      itemDescription,
      recipeImage: new URL(recipeImage, baseUrl),
      materials,
    });
  }

  return recipes;
}

if (process.isBun && import.meta.main) {
  fetchRecipes().then(console.table);
}
