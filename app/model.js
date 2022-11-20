//import JSON as this is where data is modified
import recipe from '../data/recipes.json' assert {type: 'json'}

//basic change page function
export function changePage(pageID, callback){
    console.log(recipe)
    //if the page ID is nothing, go to the home page. otherwise, go to whatever page it is.
    if(pageID == ""){
        $.get(`pages/home/home.html`, function (data) {
            //console.log("data " + data);
            $("#app").html(data);
        });
    }
    else{
        $.get(`pages/${pageID}/${pageID}.html`, function (data) {
            //console.log("data " + data);
            $("#app").html(data);
          });
    }
}

