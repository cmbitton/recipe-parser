

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
