import * as MODEL from "./model.js";

let activePage = "";
let previousPage = "";

//handle the page change, taking the # of the page URL to change it
function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");

  //check if pageID is blank to go to home.
  if (pageID == "") {
    MODEL.changePage("home");
    updateNav("home");
  } else if (pageID == "create") {
    MODEL.changePage(pageID);
    updateNav(pageID);
  }
  //else, go to whatever the page is
  else {
    MODEL.changePage(pageID);
    updateNav(pageID);
  }
}

function updateNav(pageID) {
  previousPage = activePage;
  $("#" + previousPage + "Link").removeClass("active-page");
  activePage = pageID;
  $("#" + activePage + "Link").addClass("active-page");
}

//add another input field when user clicks to add a step
export function initRecipeListener() {
  var ingredCount = 3;
  var stepCount = 3;

  /* This is creating a new input field when the user clicks the add ingredient button. */
  $("#addBtn").on("click", (e) => {
    // console.log("Click!");
    $(".ingredients").append(`
        <input type="text" id="ingred${ingredCount}" placeholder="Ingredient #${
      ingredCount + 1
    }">`);
    ingredCount++;
  });

  /* This is creating a new input field when the user clicks the add step button. */
  $("#addStepBtn").on("click", (e) => {
    // console.log("Click!");
    $(".instructions").append(`
        <input type="text" id="step${stepCount}" placeholder="Step #${
      stepCount + 1
    }">`);
    stepCount++;
  });
}

//listen for the hashtag change
function initNavListeners() {
  $(window).on("hashchange", () => {
    changeRoute();
    $("#menu").css("display", "none");
  });
  changeRoute();

  $("#menuButton").on("click", () => {
    $("#menu").css("display", "flex");
  });

  $("#offMenu").on("click", () => {
    $("#menu").css("display", "none");
  });
}

$(document).ready(function () {
  initNavListeners();
});
