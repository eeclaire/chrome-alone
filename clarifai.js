/* Chrome alone */

function requestTags(imurl) {
    if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
    || localStorage.getItem('accessToken') === null){
        var TOKEN = getToken(imurl);
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
            var tags = parseResponse(response);
            setTimeout(function() {imgurl.src = "https://i.imgur.com/e5qpB2M.jpg"}, 200);
        }
    });
}

// Parse the returned response
function parseResponse(r) {
    var tags = [];

    if (r.status_code === 'OK') {
        var results = r.results;
        tags = results[0].result.tag.classes;
        return tags;
    } else {
        console.log('Sorry, something is wrong.');
    }
}
