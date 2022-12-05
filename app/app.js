import * as MODEL from "./model.js";

var activePage = "";
var previousPage = "";

//handle the page change, taking the # of the page URL to change it
function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  let viewID = hashTag.replace("#view/", "");

  if (viewID == `#${pageID}` || pageID == "") {
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
  } else {
    console.log("nope");

    console.log(pageID);
    MODEL.changePage("view", viewID);
    // updateNav(pageID);
  }
}

function updateNav(pageID) {
  previousPage = activePage;
  $("#menu #" + previousPage + "Link").removeClass("active-page");
  $("nav #" + previousPage + "Link").removeClass("active-page");
  activePage = pageID;
  $("#menu #" + activePage + "Link").addClass("active-page");
  $("nav #" + activePage + "Link").addClass("active-page");
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

export function initPreviewListener() {
  //function is used to create a listener for the preview of a recipe
  $(".browse-recipe a").on("click", (e) => {
    //pass the target into changeRoute to go to view
    changeRoute(e.target.id);
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

//LOGIN/SIGNUP FUNCTIONS
//retrieves data from the specified form and runs through it. if any of the data values are empty then the function returns false and an array names of the empty inputs (errors). otherwise the form's data is returned in an object with an empty array for errors.
function retrieveFormData(formID) {
  let formData = $(formID).serializeArray();
  let returnData = {};
  let errors = [];

  $.map(formData, (data) => {
    if (data["value"] == "") {
      returnData = false;
      errors.push(data["name"]);
    } else if (returnData != false) {
      returnData[data["name"]] = data["value"];
    }
  });

  return [returnData, errors];
}

//checks if the previous function (retrieveFormData) returned false with errors. preps the errors for use and runs them in an alert that informs the user they made errors. otherwise it sends the data through the specified function (callback)
function checkFormData(form, callback) {
  let retrievedForm = retrieveFormData("#" + form + "Form");

  if (retrievedForm[0] == false) {
    let errorStr = "";

    retrievedForm[1].forEach((error, id) => {
      let errorText = `<b>` + error.replace("-", " ") + `</b>`;
      if (id != retrievedForm[1].length - 1) {
        errorStr = errorStr + errorText + ", ";
      } else {
        errorStr = errorStr + "and " + errorText;
      }
    });

    Swal.fire({
      icon: "error",
      html:
        "All data fields must be filled. Please complete the " +
        errorStr +
        " fields.",
      customClass: {
        container: "padding: 40px",
        confirmButton:
          "font-family: Lato; background-color: $jungle-yellow: #FFD972;; border: none;",
        htmlContainer: "font-family: Lato",
      },
    });
  } else {
    callback(retrievedForm[0]);
  }
}

function signup(data) {
  let isUniqueUser = true;

  MODEL.users.forEach((user) => {
    if (user.email == data.email) {
      isUniqueUser = false;
    }
  });

  if (isUniqueUser == false) {
    Swal.fire({
      icon: "error",
      html: "Email already in use. Please login with this email or try a different email.",
      customClass: {
        container: "padding: 40px",
        confirmButton:
          "font-family: Lato; background-color: $jungle-yellow: #FFD972;; border: none;",
        htmlContainer: "font-family: Lato",
      },
    });
  } else {
    MODEL.users.push(data);
    MODEL.setCurrentUser(MODEL.users.length - 1);
    console.log(MODEL.currentUser);
    userLoggedIn();
  }
}

function login(data) {
  let loginStatus = {
    loginFail: true,
    error: "Email or Password",
  };

  MODEL.users.forEach((user, id) => {
    if (user.email == data.email && user.password == data.password) {
      console.log("log");
      MODEL.setCurrentUser(id);
      userLoggedIn();

      loginStatus.loginFail = false;
    } else if (user.email == data.email) {
      loginStatus.error = "Password";
    }
  });

  if (loginStatus.loginFail == true && loginStatus.error != "Password") {
    loginStatus.error = "Email";
  }

  if (loginStatus.loginFail == true) {
    Swal.fire({
      icon: "error",
      html:
        "Error logging in. <b>" + loginStatus.error + "</b> does not match.",
      customClass: {
        container: "padding: 40px",
        confirmButton:
          "font-family: Lato; background-color: $jungle-yellow: #FFD972;; border: none;",
        htmlContainer: "font-family: Lato",
      },
    });
  }
}

function userLoggedIn() {
  $(".show-with-login").each(function () {
    $(this).css("display", "none");
  });

  $(".show-with-user").each(function () {
    $(this).css("display", "");
  });

  //ERROR:
  //cant get on click to apply to both buttons with a shared class or id

  // console.log($("#logoutButton1"));
  // $("#logoutButton1").on("click", (e) => {
  //   console.log("click");
  //   userLoggedOut();
  // });
  // console.log($("#logoutButton2"));
  // $("#logoutButton2").on("click", (e) => {
  //   console.log("click");
  //   userLoggedOut();
  // });

  window.location.hash = "#recipes";
  changeRoute();
}

export function userLoggedOut() {
  MODEL.setCurrentUser(null);

  $(".show-with-user").each(function () {
    $(this).css("display", "none");
  });

  $(".show-with-login").each(function () {
    $(this).css("display", "");
  });

  window.location.hash = "#login";
  changeRoute();
}

//adds click listeners which retrieves and sends the data from the button's form
export function accountListeners() {
  $("#loginButton").on("click", () => {
    checkFormData("login", login);
  });

  $("#signupButton").on("click", () => {
    checkFormData("signup", signup);
  });
}

export function error(desc, location) {
  Swal.fire({
    icon: "error",
    html: desc,
    customClass: {
      container: "padding: 40px",
      confirmButton:
        "font-family: Lato; background-color: $jungle-yellow: #FFD972;; border: none;",
      htmlContainer: "font-family: Lato",
    },
  });

  window.location.hash = "#" + location;
  changeRoute();
}

$(document).ready(function () {
  initNavListeners();
});
