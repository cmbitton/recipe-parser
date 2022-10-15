
/*
function displaySearchList(){
    const searchList = localStorage.getItem('Search Results');
    const recipeContainer = document.querySelector('.recipe-content-container');
    recipeContainer.textContent = '';
    recipeContainer.innerHTML = searchList;
    addEventListenerToSearchResults();
}
function addEventListenerToSearchResults() {
    const results = document.querySelectorAll('.recipe-container');
    for (let i = 0; i < results.length; i++) {
        results[i].addEventListener('click', () => {
            const recipe = localStorage.getItem('Search Recipes');
            const recipeFormated = JSON.parse(recipe);
            console.log(recipeFormated);
            showSearchedRecipe(recipeFormated[i]);
        })
    }
    const showMoreRecipesButton = document.querySelector('.show-more-recipes');
    showMoreRecipesButton.addEventListener('click', () => {
        const numOfResults = results.length;
        createsearchList(JSON.parse(localStorage.getItem('apiresponse')).results, numOfResults)
    })

}
*/

function saveSearchList() {
    const recipe = document.querySelector('.recipe-content-container');
    localStorage.setItem('Search Results', `${recipe.innerHTML}`);
}

function saveSearchRecipes(recipeList) {
    localStorage.setItem('Search Recipes', JSON.stringify(recipeList));
}


function buildRecipePageContent() {
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

function showSearchedRecipe(recipe) {
    buildRecipePageContent();
    const title = document.querySelector('.title');
    const returnToSearch = document.createElement('a');
    const recipeContent = document.querySelector('.recipe-content-container');
    recipeContent.insertBefore(returnToSearch, title);
    returnToSearch.classList.add('return-to-search')
    returnToSearch.textContent = 'Return to Search';
    returnToSearch.addEventListener('click', () => { createsearchList(JSON.parse(localStorage.getItem('apiresponse')).results, 10) })
    const recipeImage = document.querySelector('.recipe-image');
    const readyIn = document.querySelector('.ready-in');
    const servings = document.querySelector('.servings');
    const infoMessage = document.querySelector('.ready-in-servings');
    const recipeID = document.createElement('div');
    recipeID.classList.add('recipe-id');
    recipeID.textContent = `Recipe ID: ${recipe.id}`;
    recipeContent.append(recipeID);
    //console.log(response);
    title.textContent = recipe.title;
    if (recipe.readyInMinutes !== -1) {
        readyIn.textContent = `Ready In: ${Math.floor(recipe.readyInMinutes / 60)} hours and ${recipe.readyInMinutes % 60} Minutes`;
        infoMessage.style.columnGap = '40px';
    }
    if (recipe.servings !== -1) {
        servings.textContent = `Servings: ${recipe.servings}`;
    }
    //checks if image is available
    if (recipe.image !== null) {
        recipeImage.src = recipe.image;
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
function doubleCheckDiets(recipe) {
    const diets = getDietsAsUrl().split(',');
    if (diets.length > 0) {
        for (const diet of diets) {
            if (recipe[`${diet}`] === false) return false

        }
    }
    return true;
}

function createsearchList(recipeList, resultsAmount) {
    const listResultsContainer = document.querySelector('.recipe-content-container');
    listResultsContainer.textContent = '';
    const resultsHeader = document.createElement('h1');
    listResultsContainer.append(resultsHeader);
    resultsHeader.textContent = 'Results';
    //if end of recipe list, exit function
    for (let i = 0; i < resultsAmount; i++) {
        if (!recipeList[i]) return
        if (doubleCheckDiets(recipeList[i]) === false) continue;
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
    const showMoreRecipesButton = document.createElement('p');
    showMoreRecipesButton.textContent = 'Load More';
    showMoreRecipesButton.classList.add('show-more-recipes')
    listResultsContainer.append(showMoreRecipesButton);
    showMoreRecipesButton.addEventListener('click', () => {
        resultsAmount += 5;
        createsearchList(recipeList, resultsAmount);
    })
    //saves recipe list html to local storage to display when user returns to search
    saveSearchList();
    //saves recipe html to local storage for adding event listeners back when user returns to search
    saveSearchRecipes(recipeList);
}

function getDietsAsUrl() {
    const dietChoices = document.querySelectorAll('.diet');
    const dietList = [];
    for (let i = 0; i < dietChoices.length; i++) {
        if (dietChoices[i].checked) {
            dietList.push(dietChoices[i].value);
        }
    }
    return dietList.join();
}
function getAllergiesAsUrl() {
    const allergyChoices = document.querySelectorAll('.allergies');
    const allergyList = [];
    for (let i = 0; i < allergyChoices.length; i++) {
        if (allergyChoices[i].checked) {
            allergyList.push(allergyChoices[i].value);
        }
    }
    return allergyList.join();
}
function runSearch() {
    const recipeSearchButton = document.querySelector('.run');
    recipeSearchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'aa46c0285emshc2e3dc0cac56061p159b49jsn22a03f2fdb16',
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };
        const searchQuery = document.querySelector('.recipe-input-url').value;
        //does not call api if input is a link. instead uses other api
        if (searchQuery.includes('http')) return
        const sortMethod = document.querySelector('.rank-search').value;
        const sortDirection = document.querySelector('.asc-desc').value;
        const diet = encodeURIComponent(getDietsAsUrl());
        const allergies = encodeURIComponent(getAllergiesAsUrl());
        console.log(diet);
        fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${searchQuery}&diet=${diet}&intolerances=${allergies}&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true&sort=${sortMethod}&sortDirection=${sortDirection}&number=200&limitLicense=false&ranking=2`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                localStorage.setItem('apiresponse', JSON.stringify(response));
                createsearchList(response.results, 10);
            })
            .catch(err => console.error(err));
    })

}

runSearch();

//code for search by recipe ID

function searchByID(){
    const searchButton = document.querySelector('.id-search-button');
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        getRecipeNutrition();
    })
}

function getRecipeNutrition(){
    const recipeID = document.querySelector('.id-search-input')
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'aa46c0285emshc2e3dc0cac56061p159b49jsn22a03f2fdb16',
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };
    
    fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID.value}/nutritionLabel.png?showOptionalNutrients=true&showZeroValues=true&showIngredients=false`, options)
        .then(response => {
            //clears document
            document.querySelector('.recipe-content-container').textContent = '';
            const recipeNutritionURL = response.url;
            displayRecipeNutrition(recipeNutritionURL);

        })
        .catch(err => console.error(err));
}

function displayRecipeNutrition(recipeNutrition){
    const pageContent = document.querySelector('.recipe-content-container');
    const recipeNutritionContainer = document.createElement('div');
    recipeNutritionContainer.classList.add('recipe-nutrition-container');
    const recipeNutritionImage = document.createElement('img');
    recipeNutritionImage.classList.add('recipe-nutrition-image');
    recipeNutritionImage.src = recipeNutrition;
    pageContent.append(recipeNutritionContainer);
    recipeNutritionContainer.append(recipeNutritionImage);
}

searchByID();
