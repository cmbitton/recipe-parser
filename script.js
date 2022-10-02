
const run = document.querySelector('.run');
function writeIngedientList(ingredientsArray){
    const ingredientList = document.querySelector('.ingredients-list');
    const ingredientsHeader = document.querySelector('.ingredients-header');
    ingredientsHeader.textContent = 'Ingredients:';
    for(let i = 0; i < ingredientsArray.length; i++){
        const ingredient = document.createElement('li');
        ingredientList.append(ingredient);
        ingredient.textContent = `${ingredientsArray[i].original}`

    }
}
run.addEventListener('click', () => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'aa46c0285emshc2e3dc0cac56061p159b49jsn22a03f2fdb16',
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        }
    };
    const input = document.querySelector('.recipe-input-url');
    const title = document.querySelector('.title');
    const recipeImage = document.querySelector('.recipe-image');
    const readyIn = document.querySelector('.ready-in');
    const servings = document.querySelector('.servings');
    fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract?url=${input.value}`, options)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            title.textContent = response.title;
            if (response.readyInMinutes !== -1) {
                readyIn.textContent = `Ready In: ${Math.floor(response.readyInMinutes / 60)} hours and ${response.readyInMinutes % 60} Minutes`;
            }
            if (response.servings !== -1) {
                servings.textContent = `Servings: ${response.servings}`;
            }
            recipeImage.src = response.image;
            writeIngedientList(response.extendedIngredients);

        })
        .catch(err => title.textContent = err);
})
