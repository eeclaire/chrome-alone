/* Chrome alone */

var tags = [];

var images = document.getElementsByTagName('img');
var srcList = [];
var imtags = [];
for (var i = 0; i < images.length; i++) {
    srcList.push(images[i].src);
    imtags = requestTags(images[i].src);
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
            y = useToken(localStorage.getItem('accessToken'), imurl);
            return y;
        }
    });
}

// Make request to Clarifai endpoint for tags 
function useToken(accessToken, imgurl) {
    var imgData = {
        'url': imgurl.src,
        'model':'weddings-v1.0'
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
            return parseResponse(response, imgurl);

        }
    });
}

// Parse the returned response
function parseResponse(r, imgurl) {
    if (r.status_code === 'OK') {
        var results = r.results;
        tags = results[0].result.tag.classes;

        //console.log(tags);
        for(var j=0; j<tags.length; j++){
            if(tags[j] === "love"){
                console.log(tags[j]);
                console.log("GROSS");
                console.log($("[src=imgurl]"));
                setTimeout(function() {imgurl.src = "https://i.imgur.com/e5qpB2M.jpg"}, 200);
            }
        }
        return tags;
    } else {
        console.log('Sorry, something is wrong.');
    }
}
