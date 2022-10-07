
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

    fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${searchQuery}&instructionsRequired=true&fillIngredients=false&addRecipeInformation=true&ignorePantry=true&sort=popularity&sortDirection=desc&limitLicense=false&ranking=2`, options)
        .then(response => response.json())
        .then(response => {console.log(response);
            createsearchList(response.results);
        })
        .catch(err => console.error(err));})

}
runSearch();