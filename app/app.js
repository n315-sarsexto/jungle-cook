import * as MODEL from './model.js';

//handle the page change, taking the # of the page URL to change it
function changeRoute(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");
    //check if pageID is blank to go to home.
    if(pageID==""){
        MODEL.changePage("home");
    }//else, go to whatever the page is
    else{
        MODEL.changePage(pageID);
    }
}

//listen for the hashtag change
function initURLListener(){
    $(window).on("hashchange", changeRoute);
    changeRoute();
}


$(document).ready(function(){
    initURLListener(); 
});