import * as MODEL from './model.js';

//handle the page change, taking the # of the page URL to change it
function changeRoute(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");
    //check if pageID is blank to go to home.
    if(pageID==""){
        MODEL.changePage("home");
    }else if(pageID=="create"){
        MODEL.changePage(pageID);
        addRecipeStepsListener();
    }
    //else, go to whatever the page is
    else{
        MODEL.changePage(pageID);
    }
}

//add another input field when user clicks to add a step
function addRecipeStepsListener(){
    var ingredCount = 3;
    var stepCount = 3;

    /* This is creating a new input field when the user clicks the add ingredient button. */
    $(".addBtn").on("click", (e) => {
        console.log("Click!");
        $(".ingredients").append(`
        <input type="text" id="ingred${ingredCount}" placeholder="Ingredient #${ingredCount+1}">`)
        ingredCount++;
    });
   

    /* This is creating a new input field when the user clicks the add step button. */
    $(".addStepBtn").on("click", (e) => {
        console.log("Click!");
        $(".instructions").append(`
        <input type="text" id="step${stepCount}" placeholder="Step #${stepCount+1}">`)
        stepCount++;
    });
}

//listen for the hashtag change
function initURLListener(){
    $(window).on("hashchange", changeRoute);
    changeRoute();
}


$(document).ready(function(){
    initURLListener(); 
});