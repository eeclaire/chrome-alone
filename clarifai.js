/* Chrome alone */

var tags = [];

var images = document.getElementsByTagName('img');
var srcList = [];
var imtags = [];
for (var i = 0; i < images.length; i++) {
    srcList.push(images[i].src);
    imtags = requestTags(images[i]);
}

console.log(srcList); 

function requestTags(imurl) {
    if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
    || localStorage.getItem('accessToken') === null){
        w = getToken(imurl);
        return w;
    }
    else{
        return useToken(localStorage.getItem('accessToken'), imurl);

    }
}

// Obtain token using client id and secret
function getToken(imurl) {

    var token;

    var clientData = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    };

    $.ajax({
        'url': 'https://api.clarifai.com/v1/token',
        'data': clientData,
        'type': 'POST',
        success: function (response) {
            console.log("Token = " + response.access_token);
            // trying some local storage stuff
            localStorage.setItem('accessToken', response.access_token);
            localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000)); 
            return useToken(localStorage.getItem('accessToken'), imurl);
        }
    });
}

// Make request to Clarifai endpoint for tags 
function useToken(accessToken, imgurl) {
    var imgData = {
        'url': imgurl.src
        //'model':'weddings-v1.0'
    };
    $.ajax({
        'url': 'https://api.clarifai.com/v1/tag?model=weddings-v1.0',
        'headers': {
            'Authorization': 'Bearer ' + accessToken
        },
        'data': imgData,
        'type': 'POST',
        success: function (response) {
            console.log("Obtained response from Clarifai");
            var tags = parseResponse(response, imgurl);
            var corgiImg = getCorgi(imgurl);
        }
    });
}

function getCorgi(imgurl) {

    $.ajax({
        'url':" https://corginator.herokuapp.com/random",
        'type': 'GET',
        success: function (response) {
                corgiImg =  response.corgi;
                console.log(corgiImg);
                setTimeout(function() {imgurl.src = corgiImg}, 200);
            }
        });
}

// Parse the returned response
function parseResponse(r, imgurl) {
    if (r.status_code === 'OK') {
        var results = r.results;
        tags = results[0].result.tag.classes;
        console.log(tags);

        //console.log(tags);
        for(var j=0; j<tags.length; j++){
            if(tags[j] === "love" || tags[j] === "bride" || tags[j] === "kiss" 
                    || tags[j] === "bridesmaids" || tags[j] === "groom" || 
                    tags[j] === "party" || tags[j] === "crowd" || 
                    tags[j] === "wedding" || tags[j] === "celebration" || 
                    tags[j] === "event" || tags[j] === "ceremony" || 
                    tags[j] === "marriage" || tags[j] === "newlywed" ||
                    tags[j] === "bridal" || tags[j] === "romance" ||
                    tags[j] === "couple" || tags[j] === "engagement" ||
                    tags[j] === "veil"
                    ){
                console.log(tags[j]);
                console.log("GROSS");
                console.log($("[src=imgurl]"));
                getCorgi(imgurl);
            }
        }
        return tags;
    } else {
        console.log('Sorry, something is wrong.');
    }
}
