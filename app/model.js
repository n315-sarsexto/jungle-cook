import * as APP from "./app.js";

//import JSON as this is where data is modified
import recipe from "../data/recipes.json" assert { type: "json" };

//variables
export var users = [
  {
    id: 0,
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
      creatorName();
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
        APP.initDeleteListener();
      }
    });
  } else if (pageID == "edit") {
    $.get(`pages/${pageID}/${pageID}.html`, function (data) {
      //console.log("data " + data);
      $("#app").html(data);
      showEditRecipe(recipeID);
      //set variables for ingred and step count
      let ingCount = recipe[recipeID].ingredients.length;
      let stepCount = recipe[recipeID].instructions.length;
      APP.initEditRecipeListener(ingCount, stepCount);
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
  $("#recipeImage").append(`<img src="${recipe[recipeID]["recipe-img"]}">`);
  $("#recipeDescription").append(`<p>${recipe[recipeID].description}</p>`);
  $("#recipeTime").append(`<p>${recipe[recipeID].time}</p>`);
  $("#recipeServings").append(`<p>${recipe[recipeID].servings}</p>`);

  loopIngredients(recipeID);
  loopInstructions(recipeID);

  $(".editButton").append(
    `<a href="#edit/${recipeID}"><button>Edit Recipe</button></a>`
  );
}

//generate preview cards for recipes
function displayRecipePreviews(content, location) {
  //append a new preview card for each item in recipe array
  for (let i = 0; i < content.length; i++) {
    $(location).append(`
            <div class="display-recipe" id="${content[i].id}">
            <div class="recipe-content">
            <div class="recipe-view-img" style="background-image: url(${
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
    addUserFunctions(content[i].id);
  }
}

function addUserFunctions(id) {
  if(currentUser != null){
    $("#recipes #name-user").html(users[currentUser]["first-name"])
  }
  $("#recipes #view-button").append(
    `<a href="#view/${id}"><button class="yellow-button">View</button></a>`
  );
  $("#recipes #user-buttons")
    .append(`<a href="#edit/${id}"><button class="yellow-button user-button">Edit Recipe</button></a>
             <button id="${id}" class="yellow-button user-button delete">Delete</button>`);
}

//change the name for creating a recipe
function creatorName(){
  if(currentUser != null){
    $("#greeting #name-user").html(users[currentUser]["first-name"])
  }
}

//function to upload a recipe
export function submitRecipe(newRecipe) {
  //set the id of the new recipe
  newRecipe["id"] = recipe.length;

  //push it over to .json
  recipe.push(newRecipe);

  //push the id to the recipe array for the user
  users[currentUser].recipes.push({"id": newRecipe["id"]})

  //give an alert
  Swal.fire({
    icon: "success",
    title: "Your recipe has been created!",
    showConfirmButton: false,
    timer: 1500,
  });

  window.location.hash = "#recipes";
}
export function editRecipe(editedRecipe) {
  let targetID = editedRecipe["id"];
  recipe[targetID].name = editedRecipe["name"];
  recipe[targetID]["recipe-img"] = editedRecipe["recipe-img"];
  recipe[targetID].description = editedRecipe["description"];
  recipe[targetID].time = editedRecipe["time"];
  recipe[targetID].servings = editedRecipe["servings"];
  recipe[targetID].ingredients = editedRecipe["ingredients"];
  recipe[targetID].instructions = editedRecipe["instructions"];

  Swal.fire({
    icon: "success",
    title: "Your recipe has been saved!",
    showConfirmButton: false,
    timer: 1500,
  });
}

export function showEditRecipe(id) {
  //append a hidden id form for later use
  $(".details").append(`<input type="hidden" value="${id}" id="id">`);
  //go about the rest of it
  $("#recipe-name").val(recipe[id].name);
  $("#recipe-img").val(recipe[id]["recipe-img"]);
  $("#description").val(recipe[id].description);
  $("#time").val(recipe[id].time);
  $("#servings").val(recipe[id].servings);

  //loop for ingredients and steps
  for (let i = 0; i < recipe[id].ingredients.length; i++) {
    $(".ingredients").append(`
      <input type="text" id="ingred${i}" value="${recipe[id].ingredients[i]}">`);
  }
  for (let i = 0; i < recipe[id].instructions.length; i++) {
    $(".instructions").append(`
    <input type="text" id="step${i}" value="${recipe[id].instructions[i]}">`);
  }

  // //handle submit
  // $("#submitRecipeBtn").on("click", (e) => {
  //   //array for ingred and steps
  //   let ingreds = []
  //   let steps = []

  //   recipe[id].name = $("#recipe-name").val()
  //   recipe[id].description = $("#description").val()
  //   recipe[id].time = $("#time").val()
  //   recipe[id].servings = $("#servings").val()

  // })
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

//delete recipe
export function deleteRecipe(recipeID){
  //remove singular recipe
  recipe.splice(recipeID, 1);

  //delete from user's recipes
  const indexOfObject = users[currentUser].recipes.findIndex(object => {
    return object.id === recipeID;
  });
  console.log(indexOfObject);  
  users[currentUser].recipes.splice(indexOfObject, 1);

  //feedback
  Swal.fire("Recipe has been deleted.");

  //change window location
  changePage("recipes")
}
