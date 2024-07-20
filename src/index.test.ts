import { test, expect } from "bun:test";
import { fetchRecipes } from ".";

test("fetchRecipes", async () => {
  const recipes = await fetchRecipes();

  expect(recipes).toBeArray();
  expect(recipes).not.toBeEmpty();

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    expect(recipe.itemName).toBeString();
    expect(recipe.itemName).not.toBeEmpty();

    expect(recipe.itemDescription).toBeString();
    expect(recipe.itemDescription).not.toBeEmpty();

    expect(recipe.materials).toBeString();
    expect(recipe.materials).not.toBeEmpty();

    expect(recipe.materialsList).toBeArray();
    expect(recipe.materialsList).not.toBeEmpty();

    for (const material of recipe.materialsList) {
      expect(material).toBeString();
      expect(material).not.toBeEmpty();
    }

    expect(recipe.recipeImage).toBeInstanceOf(URL);

    // Only check the first and last 5 images, to avoid making too many requests
    if (i < 5 || i >= recipes.length - 5) {
      const recipeImage = await fetch(recipe.recipeImage, {
        method: "HEAD",
      });
      expect(recipeImage.ok).toBeTrue();
      expect(recipeImage.headers.get("content-type")).toStartWith("image/");
    }
  }

  console.table(recipes, ["itemName", "itemDescription", "materialsList"]);
});
