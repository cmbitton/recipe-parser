
function returnRecipe(name){
        return localStorage.getItem(name);
    }
function removeRecipe(){
    const recipeTitle = document.querySelector('.recipe-title');
    const removeButton = document.querySelector('.remove-button');
    removeButton.addEventListener('click', () => {
        const recipe = document.querySelector('.remove-recipe-text-input').value;
        localStorage.removeItem(recipe.toLowerCase());

        const children = document.querySelector('.recipes-list').children
        //loops through recipe list and removes recipe if it matches user input
        for (let i = 0; i < children.length; i++) {
            if(children[i].textContent.toLowerCase() === recipe.toLowerCase()){
                children[i].remove();
                clearCurrentRecipe(recipe);
                return;
            }}
            return recipeTitle.textContent = 'ERROR, RECIPE NOT FOUND';
    })

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
        const titleList = recipeList[i].split(' ');
        for(let j = 0; j < titleList.length; j++){
            titleList[j] = titleList[j][0].toUpperCase() + titleList[j].substring(1);
        }
        console.log(titleList);
        console.log(titleList.join(' '));
        recipeName.textContent = titleList.join(' ');
        recipeName.classList.add('recipe-local-storage');
    }
}

//listens for clicks to the class recipe-local-storage (recipe list items)
document.addEventListener("click", function(event){
    const elm = event.target;
    if(elm.classList.contains('recipe-local-storage')){
    const recipeContainer = document.querySelector('.recipe-content-container');
    recipeContainer.innerHTML = returnRecipe(elm.textContent.toLowerCase());
    }
   });

   function clearCurrentRecipe(recipeToRemove){
    const recipeContainer = document.querySelector('.recipe-content-container');
    const recipeTitle = document.querySelector('.title').textContent;
    //checks user input against recipe title on page and clears page if it matches the recipe to be deleted
    if (recipeToRemove.toLowerCase() === recipeTitle.toLowerCase()){
    recipeContainer.innerHTML = '';
    }
    console.log(recipeToRemove, recipeTitle)
   }

function printPDF() {
    const printButton = document.querySelector('.print-pdf');
    printButton.addEventListener('click', () => {
        window.print();
    })
}
printPDF();
removeRecipe();
createRecipeList();
