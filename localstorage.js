
function returnRecipe(name){
        return localStorage.getItem(name);
    
}
function getLocalStorageKeys(){
    const keys = Object.keys(localStorage);
      return keys;
}

function createRecipeList() {
    const recipeList = getLocalStorageKeys();
    const recipeOrderedList = document.querySelector('.recipes-list')
    for (let i = 0; i < recipeList.length; i++) {
        const recipeName = document.createElement('li');
        recipeOrderedList.append(recipeName);
        recipeName.textContent = recipeList[i];
        recipeName.classList.add('recipe-local-storage');
    }
}

document.addEventListener("click", function(event){
    const elm = event.target;
    if(elm.classList.contains('recipe-local-storage')){
    const recipeContainer = document.querySelector('.recipe-content-container');
    recipeContainer.innerHTML = returnRecipe(elm.textContent);
    }
   });
   
   
   
createRecipeList();


