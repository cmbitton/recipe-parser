
const run = document.querySelector('.run');

function writeIngedientList(ingredientsArray) {
    const ingredientList = document.querySelector('.ingredients-list');
    const ingredientsHeader = document.querySelector('.ingredients-header');
    ingredientsHeader.textContent = 'Ingredients:';
    for (let i = 0; i < ingredientsArray.length; i++) {
        const ingredient = document.createElement('li');
        ingredientList.append(ingredient);
        ingredient.textContent = `${ingredientsArray[i].original}`

    }
}

function writeInstructionList(instructionsArray) {
    const instructionsList = document.querySelector('.instructions-list');
    const instructionsHeader = document.querySelector('.instructions-header');
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
            console.log(response);
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
                console.log(response);
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
                    if (response.title === 'Search Page' || response.title === '') {
                        replaceImage(response.sourceUrl.slice(36, response.sourceUrl.indexOf('&')), recipeImage);
                        title.textContent = response.sourceUrl.slice(36, response.sourceUrl.indexOf('&'));
                    }
                    else {
                        replaceImage(response.title, recipeImage);

                    }

                }
                writeIngedientList(response.extendedIngredients);
                if (response.analyzedInstructions.length > 0) {
                    writeInstructionList(response.analyzedInstructions);
                }
                else {
                    writeInstructions(response.instructions);
                }

            })
            .catch(() => {
                //adds error message and removes all text if no recipe found
                title.textContent = 'ERROR FINDING RECIPE';
                recipeImage.src = '';
                infoMessage.textContent = '';
                const ingredientsHeader = document.querySelector('.ingredients-header');
                ingredientsHeader.textContent = ''
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
        localStorage.setItem(`${recipeTitle}`, `${recipe.innerHTML}`);
    })
}
saveRecipe();
saveToPDF();
editDocument();
finishEditing();