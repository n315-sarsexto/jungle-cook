import * as LISTENERS from "./app.js"

//import JSON as this is where data is modified
import recipe from '../data/recipes.json' assert {type: 'json'}

//basic change page function
export function changePage(pageID, recipeID, callback){
    console.log(recipe)
    //if the page ID is nothing, go to the home page. otherwise, go to whatever page it is.
    if(pageID == ""){
        $.get(`pages/home/home.html`, function (data) {
            //console.log("data " + data);
            $("#app").html(data);
        });
    }else if(pageID == "create"){
        $.get(`pages/create/create.html`, function (data) {
            //console.log("data " + data);
            $("#app").html(data);
            LISTENERS.initRecipeListener();
        });
    }else if(pageID == "view"){
        $.get(`pages/view/view.html`, function (data) {
            //console.log("data " + data);
            $("#app").html(data);
            displayRecipe(recipeID);
        });
    }
    else{
        $.get(`pages/${pageID}/${pageID}.html`, function (data) {
            //console.log("data " + data);
            $("#app").html(data);
          });
    }
}

//function to display a recipe
function displayRecipe(recipeID){
    recipeID = 0;
    //use the JSON to append elements of the recipe to the HTML
    $("#recipeName").append(`<h5>${recipe[recipeID].name}</h5>`)
    $("#recipeImage").append(`<img src="./images/${recipe[recipeID]["recipe-img"]}">`)
    $("#recipeDescription").append(`<p>${recipe[recipeID].description}</p>`)
    $("#recipeTime").append(`<p>${recipe[recipeID].time}</p>`)
    $("#recipeServings").append(`<p>${recipe[recipeID].servings}</p>`)

    loopIngredients(recipeID);
    loopInstructions(recipeID);
}

//function to pull instructions, to be able to then add them to the recipe view
function loopInstructions(recipeID){
    for(let i = 0; i < recipe[recipeID].instructions.length; i++){
        $("#instructions").append(`<p>${i+1}. ${recipe[recipeID].instructions[i]}</p>`)
    }

}
//function to pull ingredients, to be able to then add them to the recipe view
function loopIngredients(recipeID){
    for(let i = 0; i < recipe[recipeID].ingredients.length; i++){
        $("#ingredients").append(`<p>${recipe[recipeID].ingredients[i]}</p>`)
    }
}
