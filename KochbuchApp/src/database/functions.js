export async function getRecipes(wildcard){
    const recipes = await fetch(`http://localhost:8080/recipes`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            wildcard: wildcard
        })
    });

    const json = await recipes.json();

    return json;
}
export async function getIngredients(recipeId){
    const ingredients = await fetch(`http://localhost:8080/ingredients`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            recipeId: recipeId
        })
    });

    const json = ingredients.json();

    return json;
}