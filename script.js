
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
            instructionName.textContent = `Step ${i + 1}`;
        }
        else {
            instructionName.textContent = `${instructionsArray[i].name}`;
        }
        if (instructionsArray[i].steps.length > 0) {
            const steps = document.createElement('ul');
            instructionName.append(steps);
            for (let stepNum = 0; stepNum < instructionsArray[i].steps.length; stepNum++) {
                //checks for keywords that indicate photos
                if (instructionsArray[i].steps[stepNum].step.includes('Simply') || instructionsArray[i].steps[stepNum].step.includes('Dotdash') ){ }
                //check for Nutrition Facts being grouped into instructions
                else if (instructionsArray[i].steps[stepNum].step.includes('Nutrition Facts')) { break }
                else {
                    const step = document.createElement('li');
                    steps.append(step);
                    step.innerHTML = instructionsArray[i].steps[stepNum].step;
                }

            }
        }

    }
}

/*function writeInstructions(instructions) {
    const instructionsList = document.querySelector('.instructions-list');
    const ingredientsHeader = document.querySelector('.instructions-header');
    ingredientsHeader.textContent = 'Instructions:';
    instructionsList.textContent = instructions;
}*/

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
            recipeImage.src = response.image;
            writeIngedientList(response.extendedIngredients);
            writeInstructionList(response.analyzedInstructions);

        })
        .catch(err => title.textContent = err);
})

function saveToPDF(){
    const saveButton = document.querySelector('.save-pdf');
    saveButton.addEventListener('click', () => {
        window.print();
    })
}
saveToPDF();
