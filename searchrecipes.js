function showSearchedRecipe(recipe){
    buildRecipePageContent();
    const title = document.querySelector('.title');
    const recipeImage = document.querySelector('.recipe-image');
    const readyIn = document.querySelector('.ready-in');
    const servings = document.querySelector('.servings');
    const infoMessage = document.querySelector('.ready-in-servings');
                //console.log(response);
                title.textContent = recipe.title;
                if (recipe.readyInMinutes !== -1) {
                    readyIn.textContent = `Ready In: ${Math.floor(recipe.readyInMinutes / 60)} hours and ${recipe.readyInMinutes % 60} Minutes`;
                    infoMessage.style.columnGap = '40px';
                }
                if (recipe.servings !== -1) {
                    servings.textContent = `Servings: ${recipe.servings}`;
                }
                //checks if image is available, if not runs search api and uses that image
                if (recipe.image !== null) {
                    recipeImage.src = recipe.image;
                }
                else {
                    //common problem with recipes from food network. possible fix would be to use different scraper
                    if (recipe.title === 'Search Page' || recipe.title === '') {
                        replaceImage(recipe.sourceUrl.slice(36, recipe.sourceUrl.indexOf('&')), recipeImage);
                        title.textContent = recipe.sourceUrl.slice(36, recipe.sourceUrl.indexOf('&'));
                    }
                    else {
                        replaceImage(recipe.title, recipeImage);

                    }

                }
                writeIngredientList(recipe.extendedIngredients);
                //checks for instructions, uses backup instructions if they are missing
                if (recipe.analyzedInstructions.length > 0) {
                    writeInstructionList(recipe.analyzedInstructions);
                }
                else {
                    writeInstructions(recipe.instructions);
                }
                //moved function calls here so user can only edit/save recipes once one is loaded
                editDocument();
                saveRecipe();

            }
            
            
    

function createsearchList(recipeList){
    const listResultsContainer = document.querySelector('.recipe-content-container');
    listResultsContainer.textContent = '';
    const resultsHeader = document.createElement('h1');
    listResultsContainer.append(resultsHeader);
    resultsHeader.textContent = 'Results';
    for(let i = 0; i < 10; i ++){
        const recipeContainer = document.createElement('div');
        recipeContainer.classList.add('recipe-container');
        const recipeName = document.createElement('h3');
        const recipeImage = document.createElement('img');
        listResultsContainer.append(recipeContainer);
        recipeContainer.append(recipeName);
        recipeContainer.append(recipeImage);
        recipeName.textContent = recipeList[i].title;
        recipeImage.src = recipeList[i].image;
        recipeImage.classList.add('recipe-search-image');
        recipeContainer.addEventListener('click', () => {
            showSearchedRecipe(recipeList[i]);
        });
    }
}

function runSearch(){
    const recipeSearchButton = document.querySelector('.recipe-search-button');
    recipeSearchButton.addEventListener('click', () => {    
        const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'aa46c0285emshc2e3dc0cac56061p159b49jsn22a03f2fdb16',
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };
    const searchQuery = document.querySelector('.recipe-search').value;

    fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${searchQuery}&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true&ignorePantry=true&sort=popularity&sortDirection=desc&limitLicense=false&ranking=2`, options)
        .then(response => response.json())
        .then(response => {console.log(response);
            createsearchList(response.results);
        })
        .catch(err => console.error(err));})

}


function buildRecipePageContent(){
    const recipeContainer = document.querySelector('.recipe-content-container');
    recipeContainer.textContent = '';
    const title = document.createElement('h1');
    const recipeImage = document.createElement('img');
    const readyIn = document.createElement('p');
    const servings = document.createElement('p');
    const infoMessage = document.createElement('div');
    const ingredientsInstructionsContainer = document.createElement('div');
    const ingredientsContainer = document.createElement('div');
    const ingredientsHeader = document.createElement('h2');
    const ingredientsList = document.createElement('ul');
    const instructionsContainer = document.createElement('div');
    const instructionsHeader = document.createElement('h2');
    const instructionsList = document.createElement('ol');
    //title and ready in/servings info
    recipeContainer.append(title);
    recipeContainer.append(infoMessage);
    infoMessage.append(readyIn);
    infoMessage.append(servings);
    //recipe image
    recipeContainer.append(recipeImage);
    //ingredients and instructions
    recipeContainer.append(ingredientsInstructionsContainer);
    //ingredients
    ingredientsInstructionsContainer.append(ingredientsContainer);
    ingredientsContainer.append(ingredientsHeader);
    ingredientsContainer.append(ingredientsList);
    //instructions
    ingredientsInstructionsContainer.append(instructionsContainer);
    instructionsContainer.append(instructionsHeader);
    instructionsContainer.append(instructionsList);
    //add classes
    title.classList.add('title')
    infoMessage.classList.add('ready-in-servings');
    readyIn.classList.add('ready-in');
    servings.classList.add('servings');
    recipeImage.classList.add('recipe-image');
    ingredientsInstructionsContainer.classList.add('ingredients-instructions-container');
    ingredientsContainer.classList.add('ingredients-container');
    ingredientsHeader.classList.add('ingredients-header');
    ingredientsList.classList.add('ingredients-list');
    instructionsContainer.classList.add('instructions-container');
    instructionsHeader.classList.add('instructions-header');
    instructionsList.classList.add('instructions-list');

}
runSearch();