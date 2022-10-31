
//basic change page function
export function changePage(pageID, callback){
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