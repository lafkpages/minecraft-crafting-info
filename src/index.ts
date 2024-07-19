const REGEX =
  /<tr>\s*<td.*?>\s*(.+?)\s*<\/td>\s*<td.*?>\s*(.+?)\s*<\/td>\s*<td.*?>\s*<img.*?src="(.+?)".+?<\/td>\s*<td.*?>\s*(.+?)\s*<\/td>/gim;

export interface Recipe {
  itemName: string;
  itemDescription: string;

  materials: string;
  recipeImage: string;
}

export async function fetchRecipes() {
  const html = await fetch("https://www.minecraftcrafting.info").then((r) =>
    r.text()
  );

  const recipeMatches = html.matchAll(REGEX);
  const recipes: Recipe[] = [];

  for (const match of recipeMatches) {
    const [, itemName, materials, recipeImage, itemDescription] = match;
    recipes.push({ itemName, itemDescription, recipeImage, materials });
  }

  return recipes;
}

if (process.isBun && import.meta.main) {
  console.table(await fetchRecipes());
}
