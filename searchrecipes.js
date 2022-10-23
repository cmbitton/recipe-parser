/* old method of pulling cals from recipe data
function pullCaloriesFromRecipe(recipe, num) {
    let calorieAmount = parseInt(recipe.summary.substr((recipe.summary.toLowerCase().indexOf('calories') - num), num));
    if (isNaN(calorieAmount)) {
        const newNum = num - 1;
        calorieAmount = recipe.summary.substr((recipe.summary.toLowerCase().indexOf('calories') - newNum), newNum);
        if (isNaN(calorieAmount)) {
            return pullCaloriesFromRecipe(recipe, newNum);
        }
        else {return calorieAmount};
    }
    else {
        return calorieAmount;
    }
}
*/
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

function saveSearchList() {
    const recipe = document.querySelector('.recipe-content-container');
    localStorage.setItem('Search Results', `${recipe.innerHTML}`);
}

function saveSearchRecipes(recipeList) {
    localStorage.setItem('Search Recipes', JSON.stringify(recipeList));
}
*/

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

function displayRecipeSearchListInfo(recipe) {
    const searchRanking = document.querySelector('#rank-by').value;
    console.log(searchRanking);
    switch (searchRanking) {
        case 'healthiness':
            return `Health Score: ${recipe.healthScore}`;
        case 'price':
            return `Price: $${(recipe.pricePerServing / 100).toFixed(2)} per serving`;
        case 'time':
            return `Ready In ${recipe.readyInMinutes} Minutes`;
        case 'calories':
            return `Calories: ${Math.floor(recipe.nutrition.nutrients[0].amount)}`;
        case 'protein':
            for (nutrient of recipe.nutrition.nutrients) {
                if (nutrient.name === 'Protein') {
                    return `Protein: ${Math.floor(nutrient.amount)}g`;
                }
            }
        case 'total-fat':
            return `Total Fat: ${Math.floor(recipe.nutrition.nutrients[1].amount)}g`;
        case 'carbohydrates':
            return `Carbohydrates: ${Math.floor(recipe.nutrition.nutrients[3].amount)}g`;
    }
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
        //double check diet requirements for recipes that pass through
        if (doubleCheckDiets(recipeList[i]) === false) continue;
        const recipeContainer = document.createElement('div');
        recipeContainer.classList.add('recipe-container');
        const recipeName = document.createElement('h3');
        const recipeInfo = document.createElement('p');
        const recipeTextContainer = document.createElement('div');
        const recipeImage = document.createElement('img');
        recipeTextContainer.append(recipeName);
        recipeTextContainer.append(recipeInfo);
        listResultsContainer.append(recipeContainer);
        recipeContainer.append(recipeTextContainer);
        recipeContainer.append(recipeImage);
        recipeName.textContent = recipeList[i].title;
        recipeImage.src = recipeList[i].image;
        recipeInfo.textContent = displayRecipeSearchListInfo(recipeList[i]);
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
//get location of nutrient for search using rankby method
function getNutrientLocation(recipe, nutrientName){
    for (const nutrient of recipe.nutrition.nutrients) {
        if (nutrient.name.toLowerCase() === nutrientName.toLowerCase()) {
            const indexOfNutrient = recipe.nutrition.nutrients.indexOf(nutrient);
            return indexOfNutrient
        }
    }
}
//re sorts search results since api search doesnt work
function sortSearchResults(sortBy, sortDirection, response) {
    if (sortBy === 'calories') {
        if(sortDirection === 'desc'){
        response.results.sort((a, b) => parseFloat(a.nutrition.nutrients[0].amount) - parseFloat(b.nutrition.nutrients[0].amount)).reverse();
        }
        else if(sortDirection === 'asc'){
            response.results.sort((a, b) => parseFloat(b.nutrition.nutrients[0].amount) - parseFloat(a.nutrition.nutrients[0].amount)).reverse();
        }
    }
    else if(sortBy === 'total-fat'){
        if(sortDirection === 'desc'){
            response.results.sort((a, b) => parseFloat(a.nutrition.nutrients[1].amount) - parseFloat(b.nutrition.nutrients[1].amount)).reverse();
            }
            else if(sortDirection === 'asc'){
                response.results.sort((a, b) => parseFloat(b.nutrition.nutrients[1].amount) - parseFloat(a.nutrition.nutrients[1].amount)).reverse();
            }
    }
    else if(sortBy === 'carbohydrates'){
        if(sortDirection === 'desc'){
            response.results.sort((a, b) => parseFloat(a.nutrition.nutrients[3].amount) - parseFloat(b.nutrition.nutrients[3].amount)).reverse();
            }
            else if(sortDirection === 'asc'){
                response.results.sort((a, b) => parseFloat(b.nutrition.nutrients[3].amount) - parseFloat(a.nutrition.nutrients[3].amount)).reverse();
            }
    }
    else if (sortBy === 'protein') {
        if (sortDirection === 'desc') {
            response.results.sort((a, b) => parseFloat(a.nutrition.nutrients[getNutrientLocation(a, sortBy)].amount) - parseFloat(b.nutrition.nutrients[getNutrientLocation(b, sortBy)].amount)).reverse();
        }
        else if (sortDirection === 'asc') {
            response.results.sort((a, b) => parseFloat(b.nutrition.nutrients[getNutrientLocation(b, sortBy)].amount) - parseFloat(a.nutrition.nutrients[getNutrientLocation(a, sortBy)].amount)).reverse();
        }

    }
    return response;
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
        fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${searchQuery}&diet=${diet}&intolerances=${allergies}&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true&addRecipeNutrition=true&sort=${sortMethod}&sortDirection=${sortDirection}&number=100&limitLicense=false&ranking=2`, options)
            .then(response => response.json())
            .then(response => {
                //reduce storage space of recipe files by deleting unneeded nutrient info
                for(let recipe of response.results){
                    delete recipe.nutrition.ingredients;
                    delete recipe.nutrition.flavonoids;
                }
                console.log(response);
                //sorts recipes since normal sort using api doesnt work
                response = sortSearchResults(sortMethod, sortDirection, response);
                localStorage.setItem('apiresponse', JSON.stringify(response));
                createsearchList(response.results, 10);
            })
            .catch(err => console.error(err));
    })

}

runSearch();

//code for search by recipe ID

function searchByID() {
    const searchButton = document.querySelector('.id-search-button');
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (document.querySelector('.id-search-input').value && document.querySelector('.id-search-input').value > 0) {
            const pageContent = document.querySelector('.recipe-content-container');
            pageContent.textContent = '';
            const recipeIDInfoContainer = document.createElement('div');
            recipeIDInfoContainer.classList.add('recipe-id-info-container');
            //displays loading spinner
            const loadingSpinner = document.createElement('div');
            loadingSpinner.classList.add('lds-dual-ring');
            loadingSpinner.style.display = 'inline-block';
            recipeIDInfoContainer.append(loadingSpinner);
            pageContent.append(recipeIDInfoContainer);
            getRecipeNutrition();
            getRecipeTasteProfile();
        }
    })
}

function getRecipeNutrition(){
    const recipeID = document.querySelector('.id-search-input');
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'aa46c0285emshc2e3dc0cac56061p159b49jsn22a03f2fdb16',
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };
    
    fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID.value}/nutritionLabel.png?showOptionalNutrients=true&showZeroValues=true&showIngredients=false`, options)
        .then(response => response.blob())
        .then(imageBlob => {
            const imageObjectURL = URL.createObjectURL(imageBlob);
            console.log(imageObjectURL);
            displayRecipeNutrition(imageObjectURL);
        
        })
        .catch(err => console.error(err));
}

function displayRecipeNutrition(recipeNutrition){
    const pageContent = document.querySelector('.recipe-id-info-container');
    const recipeNutritionContainer = document.createElement('div');
    recipeNutritionContainer.classList.add('recipe-nutrition-container');
    const recipeNutritionImage = document.createElement('img');
    recipeNutritionImage.classList.add('recipe-nutrition-image');
    recipeNutritionImage.src = recipeNutrition;
    pageContent.append(recipeNutritionContainer);
    recipeNutritionContainer.append(recipeNutritionImage);
    //hides loading spinner
    const loadingSpinner = document.querySelector('.lds-dual-ring');
    loadingSpinner.removeAttribute('style');
}

function createTasteBarColor(tasteValue){
    let rgb = '';
    if(tasteValue <= 50){
        return rgb = `rgb(${255}, ${tasteValue * 5.1}, ${0})`;
    }
    else{
        return rgb = `rgb(${255 - ((tasteValue - 50) * 5.1)}, ${255}, ${0})`;
    }
}
function displayTasteProfile(recipeTaste){
    console.log(recipeTaste);
    const pageContent = document.querySelector('.recipe-id-info-container');
    const recipeTasteContainer = document.createElement('div');
    const tasteHeading = document.createElement('h2');
    tasteHeading.classList.add('taste-heading');
    tasteHeading.textContent = 'Taste Profile:';
    recipeTasteContainer.append(tasteHeading);
    recipeTasteContainer.classList.add('recipe-taste-container');
    //bitterness
    const bitternessContainer = document.createElement('div');
    bitternessContainer.classList.add('bitterness-container');
    const bitternessBar = document.createElement('div');
    bitternessBar.classList.add('bitterness-bar')
    const bitterness = document.createElement('div');
    bitterness.style.backgroundColor = createTasteBarColor(recipeTaste.bitterness);
    bitterness.id = 'bitterness';
    bitterness.style.width = `${recipeTaste.bitterness}%`;
    const labelBitterness = document.createElement('label');
    labelBitterness.setAttribute('for', 'bitterness');
    labelBitterness.textContent = 'Bitterness: ';
    bitternessContainer.append(labelBitterness);
    bitternessBar.append(bitterness)
    bitternessContainer.append(bitternessBar);
    recipeTasteContainer.append(bitternessContainer);
    //fattiness
    const fattinessContainer = document.createElement('div');
    fattinessContainer.classList.add('fattiness-container');
    const fattinessBar = document.createElement('div');
    fattinessBar.classList.add('fattiness-bar')
    const fattiness = document.createElement('div');
    fattiness.style.backgroundColor = createTasteBarColor(recipeTaste.fattiness);
    fattiness.id = 'fattiness';
    fattiness.style.width = `${recipeTaste.fattiness}%`;
    const labelFattiness = document.createElement('label');
    labelFattiness.setAttribute('for', 'fattiness');
    labelFattiness.textContent = 'Fattiness: ';
    fattinessContainer.append(labelFattiness);
    fattinessBar.append(fattiness)
    fattinessContainer.append(fattinessBar);
    recipeTasteContainer.append(fattinessContainer);
    //saltiness
    const saltinessContainer = document.createElement('div');
    saltinessContainer.classList.add('saltiness-container');
    const saltinessBar = document.createElement('div');
    saltinessBar.classList.add('saltiness-bar')
    const saltiness = document.createElement('div');
    saltiness.style.backgroundColor = createTasteBarColor(recipeTaste.saltiness);
    saltiness.id = 'saltiness';
    saltiness.style.width = `${recipeTaste.saltiness}%`;
    const labelSaltiness = document.createElement('label');
    labelSaltiness.setAttribute('for', 'saltiness');
    labelSaltiness.textContent = 'Saltiness: ';
    saltinessContainer.append(labelSaltiness);
    saltinessBar.append(saltiness)
    saltinessContainer.append(saltinessBar);
    recipeTasteContainer.append(saltinessContainer);
    //savoriness
    const savorinessContainer = document.createElement('div');
    savorinessContainer.classList.add('savoriness-container');
    const savorinessBar = document.createElement('div');
    savorinessBar.classList.add('savoriness-bar')
    const savoriness = document.createElement('div');
    savoriness.style.backgroundColor = createTasteBarColor(recipeTaste.savoriness);
    savoriness.id = 'savoriness';
    savoriness.style.width = `${recipeTaste.savoriness}%`;
    const labelSavoriness = document.createElement('label');
    labelSavoriness.setAttribute('for', 'savoriness');
    labelSavoriness.textContent = 'Savoriness: ';
    savorinessContainer.append(labelSavoriness);
    savorinessBar.append(savoriness)
    savorinessContainer.append(savorinessBar);
    recipeTasteContainer.append(savorinessContainer);
    //sourness
    const sournessContainer = document.createElement('div');
    sournessContainer.classList.add('sourness-container');
    const sournessBar = document.createElement('div');
    sournessBar.classList.add('sourness-bar')
    const sourness = document.createElement('div');
    sourness.style.backgroundColor = createTasteBarColor(recipeTaste.sourness);
    sourness.id = 'sourness';
    sourness.style.width = `${recipeTaste.sourness}%`;
    const labelSourness = document.createElement('label');
    labelSourness.setAttribute('for', 'sourness');
    labelSourness.textContent = 'Sourness: ';
    sournessContainer.append(labelSourness);
    sournessBar.append(sourness)
    sournessContainer.append(sournessBar);
    recipeTasteContainer.append(sournessContainer);
    //sweetness
    const sweetnessContainer = document.createElement('div');
    sweetnessContainer.classList.add('sweetness-container');
    const sweetnessBar = document.createElement('div');
    sweetnessBar.classList.add('sweetness-bar')
    const sweetness = document.createElement('div');
    sweetness.style.backgroundColor = createTasteBarColor(recipeTaste.sweetness);
    sweetness.id = 'sweetness';
    sweetness.style.width = `${recipeTaste.sweetness}%`;
    const labelSweetness = document.createElement('label');
    labelSweetness.setAttribute('for', 'sweetness');
    labelSweetness.textContent = 'Sweetness: ';
    sweetnessContainer.append(labelSweetness);
    sweetnessBar.append(sweetness)
    sweetnessContainer.append(sweetnessBar);
    recipeTasteContainer.append(sweetnessContainer);
    pageContent.append(recipeTasteContainer);
}

function getRecipeTasteProfile(){
    const recipeID = document.querySelector('.id-search-input');
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'aa46c0285emshc2e3dc0cac56061p159b49jsn22a03f2fdb16',
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };
    
    fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID.value}/tasteWidget.json?normalize=true`, options)
        .then(response => response.json())
        .then(response => {
            displayTasteProfile(response);
        })
        .catch(err => console.error(err));
}
searchByID();
