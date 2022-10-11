function showHideTools(){
    const showHideButton = document.querySelector('.show-hide-toggle-tools');
    const toolbox = document.querySelector('.save-remove-container');
    const editButtons = document.querySelector('.edit-button-container');
    const saveRemoveButtons = document.querySelector('.save-remove-buttons');
    const template = document.querySelector('.recipe-template');
    showHideButton.addEventListener('click', () => {
        if (showHideButton.textContent === 'Show'){
            editButtons.style.display = 'block';
            saveRemoveButtons.style.display = 'block';
            template.style.display = 'block';
            toolbox.style.height = 'fit-content';
            showHideButton.textContent = 'Hide';
        }
        else{
            editButtons.removeAttribute('style');
            saveRemoveButtons.removeAttribute('style');
            template.removeAttribute('style');
            toolbox.removeAttribute('style');
            showHideButton.textContent = 'Show';
        }
    })
}

function showHideSettings(){
    const showHideButton = document.querySelector('.show-hide-toggle-settings');
    const searchbox = document.querySelector('.right-container-recipes');
    const content = document.querySelector('.search-settings-content');
    showHideButton.addEventListener('click', () => {
        if (showHideButton.textContent === 'Show'){
            content.classList.add('expand');
            searchbox.classList.add('expand');
            showHideButton.textContent = 'Hide';
        }
        else{
            content.classList.remove('expand');
            searchbox.classList.remove('expand');
            showHideButton.textContent = 'Show';
        }
    })
}
showHideSettings();
showHideTools();