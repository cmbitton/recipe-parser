
const run = document.querySelector('.run');
const templateButton = document.querySelector('.recipe-template')
function writeIngredientList(ingredientsArray) {
    const ingredientList = document.querySelector('.ingredients-list');
    //erases text content in case page is not refreshed when running another recipe
    ingredientList.textContent = '';
    const ingredientsHeader = document.querySelector('.ingredients-header');
    //erases text content in case page is not refreshed when running another recipe
    ingredientsHeader.textContent = '';
    ingredientsHeader.textContent = 'Ingredients:';
    for (let i = 0; i < ingredientsArray.length; i++) {
        const ingredient = document.createElement('li');
        ingredientList.append(ingredient);
        ingredient.textContent = `${ingredientsArray[i].original}`

    }
}

function writeInstructionList(instructionsArray) {
    const instructionsList = document.querySelector('.instructions-list');
    //erases text content in case page is not refreshed when running another recipe
    instructionsList.textContent = '';
    const instructionsHeader = document.querySelector('.instructions-header');
    instructionsHeader.textContent = '';
    instructionsHeader.textContent = 'Instructions: ';
    for (let i = 0; i < instructionsArray.length; i++) {
        const instructionName = document.createElement('li');
        instructionsList.append(instructionName);
        //checks for empty instruction step name
        if (instructionsArray[i].name === '') {
            instructionName.textContent = `Steps:`;
        }
        else {
            instructionName.textContent = `${instructionsArray[i].name}`;
            instructionName.style.fontWeight = 'bold'
        }
        if (instructionsArray[i].steps.length > 0) {
            const steps = document.createElement('ul');
            instructionName.append(steps);
            for (let stepNum = 0; stepNum < instructionsArray[i].steps.length; stepNum++) {
                //checks for keywords that indicate photos
                if (instructionsArray[i].steps[stepNum].step.includes('Simply') || instructionsArray[i].steps[stepNum].step.includes('Dotdash')) { }
                //check for Nutrition Facts being grouped into instructions
                else if (instructionsArray[i].steps[stepNum].step.includes('Nutrition Facts')) { break }
                //adds instruction step and undoes bolding
                else {
                    const step = document.createElement('li');
                    steps.append(step);
                    step.style.fontWeight = 'normal'
                    step.innerHTML = instructionsArray[i].steps[stepNum].step;
                }

            }
        }

    }
}
// backup function in case regular instructions are missing
function writeInstructions(instructions) {
    const instructionsList = document.querySelector('.instructions-list');
    instructionsList.remove();
    const instructionsHeader = document.querySelector('.instructions-header');
    instructionsHeader.textContent = 'Instructions:';
    const instruction = document.createElement('p');
    const instructionContainer = document.querySelector('.instructions-container');
    instructionContainer.append(instruction);
    instruction.textContent = instructions;

}
// script to replace image with a searched image if image not found
function replaceImage(search, image) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'aa46c0285emshc2e3dc0cac56061p159b49jsn22a03f2fdb16',
            'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
        }
    };
    const img = image;
    const url = encodeURIComponent(search.trim())
    fetch(`https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=${url}&pageNumber=1&pageSize=10&autoCorrect=true`, options)
        .then(response => response.json())
        .then(response => {
            //console.log(response);
            img.src = response.value[1].url;
        })
        .catch(err => console.error(err));
}
// run the program
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
    const infoMessage = document.querySelector('.ready-in-servings');
    if (input.value !== '') {
        fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract?url=${input.value}`, options)
            .then(response => response.json())
            .then(response => {
                //console.log(response);
                title.textContent = response.title;
                if (response.readyInMinutes !== -1) {
                    readyIn.textContent = `Ready In: ${Math.floor(response.readyInMinutes / 60)} hours and ${response.readyInMinutes % 60} Minutes`;
                    infoMessage.style.columnGap = '40px';
                }
                if (response.servings !== -1) {
                    servings.textContent = `Servings: ${response.servings}`;
                }
                //checks if image is available, if not runs search api and uses that image
                if (response.image !== null) {
                    recipeImage.src = response.image;
                }
                else {
                    //common problem with recipes from food network. possible fix would be to use different scraper
                    if (response.title === 'Search Page' || response.title === '') {
                        replaceImage(response.sourceUrl.slice(36, response.sourceUrl.indexOf('&')), recipeImage);
                        title.textContent = response.sourceUrl.slice(36, response.sourceUrl.indexOf('&'));
                    }
                    else {
                        replaceImage(response.title, recipeImage);

                    }

                }
                writeIngredientList(response.extendedIngredients);
                //checks for instructions, uses backup instructions if they are missing
                if (response.analyzedInstructions.length > 0) {
                    writeInstructionList(response.analyzedInstructions);
                }
                else {
                    writeInstructions(response.instructions);
                }
                //moved function calls here so user can only edit/save recipes once one is loaded
                editDocument();
                saveRecipe();

            })
            .catch(() => {
                //adds error message and removes all text if no recipe found
                title.textContent = 'ERROR FINDING RECIPE';
                recipeImage.src = '';
                infoMessage.textContent = '';
                const ingredientsHeader = document.querySelector('.ingredients-header');
                ingredientsHeader.textContent = '';
                const instructionsContainer = document.querySelector('.instructions-container');
                instructionsContainer.textContent = ''
            });
    }
})


function editDocument() {
    const editButton = document.querySelector('.edit-doc');
    editButton.addEventListener('click', () => {
        //set up the hover on element and edit elements
        const recipeContainer = document.querySelector('.recipe-content-container');
        if (recipeContainer.getAttribute('id') !== 'hov') {
            recipeContainer.setAttribute('contenteditable', 'true');
            recipeContainer.setAttribute('id', 'hov');
        }
    })
}
function finishEditing() {
    const finishEditingButton = document.querySelector('.finish-editing');
    finishEditingButton.addEventListener('click', () => {
        //undo hover element
        const recipeContainer = document.querySelector('.recipe-content-container');
        if (recipeContainer.getAttribute('id') === 'hov') {
            recipeContainer.setAttribute('contenteditable', 'false');
            recipeContainer.removeAttribute('id', 'hov');
        }
        //Allows user to update recipe after editing
        saveRecipe();
    })
}

function saveToPDF() {
    const saveButton = document.querySelector('.save-pdf');
    saveButton.addEventListener('click', () => {
        window.print();
    })
}
//save recipe to local storage
function saveRecipe() {
    const saveButton = document.querySelector('.save-recipe');
    saveButton.addEventListener('click', () => {
        const recipe = document.querySelector('.recipe-content-container');
        const recipeTitle = document.querySelector('.title').textContent;
        localStorage.setItem(`${recipeTitle.toLowerCase()}`, `${recipe.innerHTML}`);
        //updates saved recipe list to include saved recipe
        const recipeOrderedList = document.querySelector('.recipes-list');
        const recipeName = document.createElement('li');
        recipeOrderedList.append(recipeName);
        recipeName.classList.add('recipe-local-storage');
        recipeName.textContent = recipeTitle;
        createRecipeList();         
        
    })
}
//get recipe list from local storage
function getLocalStorageKeys(){
    const keys = Object.keys(localStorage);
      return keys;
}
//display recipe list on load
function createRecipeList() {
    const recipeList = getLocalStorageKeys();
    const recipeOrderedList = document.querySelector('.recipes-list');
    recipeOrderedList.textContent = '';
    const recipeHeader = document.createElement('h2');
    recipeHeader.classList.add('recipe-title')
    recipeOrderedList.append(recipeHeader);
    recipeHeader.textContent = 'Recipes';
    for (let i = 0; i < recipeList.length; i++) {
        //check local storage to make sure search results and search recipes are not included in recipe list
        if(recipeList[i] !== 'Search Results' && recipeList[i] !== 'Search Recipes'){
        const recipeName = document.createElement('li');
        recipeOrderedList.append(recipeName);
        const titleList = recipeList[i].split(' ');
        for(let j = 0; j < titleList.length; j++){
            titleList[j] = titleList[j][0].toUpperCase() + titleList[j].substring(1);
        }
        /* bug check
        console.log(titleList);
        console.log(titleList.join(' '));
        */
        recipeName.textContent = titleList.join(' ');
        recipeName.classList.add('recipe-local-storage');
    }
}
}
//clears page when user removes recipe while it is also on the page
function clearCurrentRecipe(recipeToRemove){
    const recipeContainer = document.querySelector('.recipe-content-container');
    const recipeTitle = document.querySelector('.title').textContent;
    //checks user input against recipe title on page and clears page if it matches the recipe to be deleted
    if (recipeToRemove.toLowerCase() === recipeTitle.toLowerCase()){
    recipeContainer.textContent = '';
    const pageTitle = document.createElement('h1');
    recipeContainer.append(pageTitle);
    pageTitle.textContent = 'Recipe Removed'
    }
    //console.log(recipeToRemove, recipeTitle)
   }
//removes recipe from local storage and recipe list
function removeRecipe(){
    const recipeListTitle = document.querySelector('.recipe-title');
    const removeButton = document.querySelector('.remove-button');
    removeButton.addEventListener('click', () => {
        const recipe = document.querySelector('.title').textContent;
        localStorage.removeItem(recipe.toLowerCase());
        const children = document.querySelector('.recipes-list').children;
        //loops through recipe list and removes recipe if it matches user input
        for (let i = 0; i < children.length; i++) {
            if(children[i].textContent.toLowerCase() === recipe.toLowerCase()){
                children[i].remove();
                clearCurrentRecipe(recipe);
                return;
            }}
            return recipeListTitle.textContent = 'ERROR, RECIPE NOT FOUND';
    })

}
//creates a new, blank recipe template
function createBlankRecipe(){
    const recipeTitle = document.querySelector('.title');
    const readyIn = document.querySelector('.ready-in');
    const servings = document.querySelector('.servings');
    document.querySelector('.ready-in-servings').style.columnGap = '40px';
    const ingredientsHeader = document.querySelector('.ingredients-header');
    const ingredients = document.querySelector('.ingredients-list');
    const instructions = document.querySelector('.instructions-list');
    const container = document.querySelector('.ingredients-instructions-container');
    const image = document.querySelector('.recipe-image');
    //deletes image if one is already present
    if(image.src !== null){
        image.src = '';}
    //create image upload input and add class 'upload-image'
    const imageUpload = document.createElement('input');
    imageUpload.type = 'file';
    imageUpload.accept= "image/png, image/jpeg";
    imageUpload.classList.add('upload-image');
    const recipeContainer = document.querySelector('.recipe-content-container');
    //check if image input element is already on screen, if it isn't then it adds it
    if(document.querySelector('.upload-image') === null){
    recipeContainer.insertBefore(imageUpload, container);}
    //loads uploaded image into recipe image
    imageUpload.addEventListener("change", function() {
        const reader = new FileReader();
        reader.addEventListener("load", () => {


          const uploaded_image = reader.result;
          console.log(uploaded_image);
          image.src = `${uploaded_image}`;

        });
        reader.readAsDataURL(this.files[0]);
      });
    ingredients.textContent = '';
    instructions.textContent = '';
    instructions.style.width = '90%'
    //creates 5 empy list items for ingredients and instructions lists
    for(let i =0; i < 5; i++){
    const ingredient = document.createElement('li');
    ingredients.append(ingredient);}
    for(let i =0; i < 5; i++){
        const instructionStep = document.createElement('li');
        instructionStep.textContent = `Step ${i + 1}: `;
        instructions.append(instructionStep);
}

    const instructionsHeader = document.querySelector('.instructions-header');
    container.style.width = '90%';
    recipeTitle.textContent = 'Recipe Title';
    readyIn.textContent = 'Ready In: ';
    servings.textContent = 'Servings: ';
    ingredientsHeader.textContent = 'Ingredients: ';
    instructionsHeader.textContent = 'Instructions';
    ingredients.style.width = '90%';
    instructions.style.width = '90%';
    instructions.style.marginTop = '1em';
    instructions.style.textAlign = 'left';
    ingredients.style.textAlign = 'left';
    //allows user to edit and save template
    editDocument();
    saveRecipe();
}
//listens for clicks to the class recipe-local-storage (recipe list items)
function returnRecipe(name){
    return localStorage.getItem(name);
}
document.addEventListener("click", function(event){
    const elm = event.target;
    if(elm.classList.contains('recipe-local-storage')){
    const recipeContainer = document.querySelector('.recipe-content-container');
    recipeContainer.innerHTML = returnRecipe(elm.textContent.toLowerCase());
    //allows user to edit saved recipes
    editDocument();
    }
   });

templateButton.addEventListener('click', createBlankRecipe);
createRecipeList();
saveToPDF();
removeRecipe();
finishEditing();
