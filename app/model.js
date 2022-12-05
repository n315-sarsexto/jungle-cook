import * as LISTENERS from "./app.js";

//import JSON as this is where data is modified
import recipe from "../data/recipes.json" assert { type: "json" };

//basic change page function
export function changePage(pageID, recipeID, callback) {
  //console.log(recipe);
  //if the page ID is nothing, go to the home page. otherwise, go to whatever page it is.
  if (pageID == "") {
    $.get(`pages/home/home.html`, function (data) {
      //console.log("data " + data);
      $("#app").html(data);
    });
  } else if (pageID == "create") {
    $.get(`pages/create/create.html`, function (data) {
      //console.log("data " + data);
      $("#app").html(data);
      LISTENERS.initRecipeListener();
    });
  } else if (pageID == "view") {
    $.get(`pages/view/view.html`, function (data) {
      //console.log("data " + data);
      $("#app").html(data);
      displayRecipe(recipeID);
    });
  } else if (pageID == "browse") {
    $.get(`pages/${pageID}/${pageID}.html`, function (data) {
      //console.log("data " + data);
      $("#app").html(data);
      displayRecipePreviews();
      LISTENERS.initPreviewListener();
    });
  } else {
    $.get(`pages/${pageID}/${pageID}.html`, function (data) {
      //console.log("data " + data);
      $("#app").html(data);
    });
  }
}

//function to display a recipe
function displayRecipe(recipeID) {
  console.log(recipe[recipeID])
  //recipeID = 0;
  //use the JSON to append elements of the recipe to the HTML
  $("#recipeName").append(`<h5>${recipe[recipeID].name}</h5>`);
  $("#recipeImage").append(
    `<img src="images/${recipe[recipeID]["recipe-img"]}">`
  );
  $("#recipeDescription").append(`<p>${recipe[recipeID].description}</p>`);
  $("#recipeTime").append(`<p>${recipe[recipeID].time}</p>`);
  $("#recipeServings").append(`<p>${recipe[recipeID].servings}</p>`);

  loopIngredients(recipeID);
  loopInstructions(recipeID);
}

//generate preview cards for recipes
function displayRecipePreviews() {
  //append a new preview card for each item in recipe array
  for (let i = 0; i < recipe.length; i++) {
    //console.log(recipe[i]);
    $(".browse-recipes").append(`
            <div class="browse-recipe" id="${i}">
            <div class="browse-recipe-img" style="background-image: url(images/${recipe[i]["recipe-img"]})">
            </div>
            <div class="browse-recipe-details">
                <a id="${i}" href="#view/${i}" class="recipe-details-title">${recipe[i].name}</a>
                <p class="recipe-details-desc">${recipe[i].description}</p>
                <table class="recipe-details-info">
                    <tr class="recipe-time icon-text">
                        <td><img src="images/time.svg"></td>
                        <td>${recipe[i].time}</td>
                    </tr>
                    <tr class="recipe-servings icon-text">
                        <td><img src="images/servings.svg"></td>
                        <td>${recipe[i].servings} servings</td>
                    </tr>
                </table>
            </div>
            </div>`);
  }
}

//function to upload a recipe
export function submitRecipe(newRecipe){
  //set the id of the new recipe
  newRecipe["id"] = recipe.length

  //push it over to .json
  recipe.push(newRecipe)
}

//function to pull instructions, to be able to then add them to the recipe view
function loopInstructions(recipeID) {
  for (let i = 0; i < recipe[recipeID].instructions.length; i++) {
    $("#instructions").append(
      `<p>${i + 1}. ${recipe[recipeID].instructions[i]}</p>`
    );
  }
}
//function to pull ingredients, to be able to then add them to the recipe view
function loopIngredients(recipeID) {
  for (let i = 0; i < recipe[recipeID].ingredients.length; i++) {
    $("#ingredients").append(`<p>${recipe[recipeID].ingredients[i]}</p>`);
  }
}
