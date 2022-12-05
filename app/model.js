import * as APP from "./app.js";

//import JSON as this is where data is modified
import recipe from "../data/recipes.json" assert { type: "json" };

//variables
export var users = [
  {
    "first-name": "admin",
    "last-name": "user",
    email: "admin@junglecook.com",
    password: "password",
    recipes: [{ id: 1 }],
  },
];
export var currentUser = null;

export function setCurrentUser(userID) {
  currentUser = userID;
  console.log(currentUser);
}

//basic change page function
export function changePage(pageID, recipeID, callback) {
  $(".logoutButton").each(function () {
    console.log("logout button", $(this));
    $(this).on("click", (e) => {
      console.log("click");
      APP.userLoggedOut();
    });
  });

  //if the page ID is nothing, go to the home page. otherwise, go to whatever page it is.
  if (pageID == "") {
    $.get(`pages/home/home.html`, function (data) {
      $("#app").html(data);
    });
  } else if (pageID == "create") {
    $.get(`pages/create/create.html`, function (data) {
      $("#app").html(data);
      APP.initRecipeListener();
    });
  } else if (pageID == "login") {
    $.get(`pages/${pageID}/${pageID}.html`, function (data) {
      $("#app").html(data);
      APP.accountListeners();
    });
  } else if (pageID == "view") {
    $.get(`pages/view/view.html`, function (data) {
      $("#app").html(data);
      displayRecipe(recipeID);
    });
  } else if (pageID == "browse") {
    $.get(`pages/${pageID}/${pageID}.html`, function (data) {
      $("#app").html(data);
      displayRecipePreviews(recipe, "#browse .recipes-display");
      APP.initPreviewListener();
    });
  } else if (pageID == "recipes") {
    $.get(`pages/${pageID}/${pageID}.html`, function (data) {
      console.log(currentUser);
      if (currentUser == null) {
        APP.error("Error: User not found. Please login to continue", "login");
      } else {
        $("#app").html(data);
        $("#name-user span").html(users[currentUser]);
        displayRecipePreviews(
          users[currentUser].recipes,
          "#recipes .recipes-display"
        );
        APP.initPreviewListener();
        addUserFunctions();
      }
    });
  } else {
    $.get(`pages/${pageID}/${pageID}.html`, function (data) {
      $("#app").html(data);
    });
  }
}

function logoutListeners() {
  $(".logoutButton").each(function () {
    console.log("logout button", $(this));
    $(this).on("click", (e) => {
      console.log("click");
      userLoggedOut();
    });
  });
}

//function to display a recipe
function displayRecipe(recipeID) {
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
function displayRecipePreviews(content, location) {
  //append a new preview card for each item in recipe array
  for (let i = 0; i < content.length; i++) {
    $(location).append(`
            <div class="display-recipe" id="${content[i].id}">
            <div class="recipe-content">
            <div class="recipe-view-img" style="background-image: url(images/${
              recipe[content[i].id]["recipe-img"]
            })"><div id="view-button"></div></div>
            <div class="recipe-view-details">
                <a id="${i}" href="#view/${i}" class="recipe-details-title">${
      recipe[content[i].id].name
    }</a>
                <p class="recipe-details-desc">${
                  recipe[content[i].id].description
                }</p>
                <table class="recipe-details-info">
                    <tr class="recipe-time icon-text">
                        <td><img src="images/time.svg"></td>
                        <td>${recipe[content[i].id].time}</td>
                    </tr>
                    <tr class="recipe-servings icon-text">
                        <td><img src="images/servings.svg"></td>
                        <td>${recipe[content[i].id].servings} servings</td>
                    </tr>
                </table>
            </div>
            </div>
            <div id="user-buttons">
            </div>
            </div>`);
  }
}

function addUserFunctions() {
  $("#recipes #view-button").append(
    `<button class="yellow-button">View</button>`
  );
  $("#recipes #user-buttons")
    .append(`<button class="yellow-button user-button">Edit Recipe</button>
             <button class="yellow-button user-button">Delete</button>`);
}

{
  /* <div class="recipe" id="view${i}">
<div class="recipeImg">
    <img src="images/${recipe[i]["recipe-img"]}">
</div>
<div class="recipeDetails">
    <h1>${recipe[i].name}</h1>
    <p>${recipe[i].description}</p>
    <div class="time">
        <img src="images/time.svg">
        <p>${recipe[i].time}</p>
    </div>
    <div class="servings">
        <img src="images/servings.svg">
        ${recipe[i].servings}
    </div>
</div>
</div> */
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
