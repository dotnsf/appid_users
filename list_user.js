//. list_user.js
var request = require( 'request' );

var settings = require( './settings' );

//. env values
var settings_region = 'REGION' in process.env ? process.env.REGION : settings.region;
var settings_tenantId = 'TENANT_ID' in process.env ? process.env.TENANT_ID : settings.tenantId;
var settings_apiKey = 'APIKEY' in process.env ? process.env.APIKEY : settings.apiKey;
var settings_secret = 'SECRET' in process.env ? process.env.SECRET : settings.secret;
var settings_clientId = 'CLIENT_ID' in process.env ? process.env.CLIENT_ID : settings.clientId;
var settings_redirectUri = 'REDIRECT_URI' in process.env ? process.env.REDIRECT_URI : settings.redirectUri;
var settings_oauthServerUrl = 'https://' + settings_region + '.appid.cloud.ibm.com/oauth/v4/' + settings_tenantId;

getAccessToken().then( function( access_token ){
  if( access_token ){
    listUsers( access_token ).then( function( result ){
      console.log( { result } );
    }).catch( function( err2 ){
      console.log( { err2 } );
    });
  }else{
    console.log( 'no access_token.' );
  }
}).catch( function( { err1 } ){
  console.log( err1 );
});

async function getAccessToken(){
  return new Promise( async ( resolve, reject ) => {
    //. GET an IAM token
    //. https://cloud.ibm.com/docs/appid?topic=appid-manging-api&locale=ja
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    };
    var option = {
      url: 'https://iam.cloud.ibm.com/oidc/token',
      method: 'POST',
      body: 'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=' + settings.apiKey,
      headers: headers
    };
    request( option, ( err, res, body ) => {
      if( err ){
        console.log( err );
        reject( null );
      }else{
        body = JSON.parse( body );
        var access_token = body.access_token;
        resolve( access_token );
      }
    });
  });
}

async function getProfile( access_token, user_id ){
  return new Promise( async ( resolve, reject ) => {
    if( access_token ){
      var headers1 = {
        accept: 'application/json',
        authorization: 'Bearer ' + access_token
      };
      var option1 = {
        url: 'https://' + settings.region + '.appid.cloud.ibm.com/management/v4/' + settings.tenantId + '/users/' + user_id + '/profile',
        method: 'GET',
        headers: headers1
      };
      request( option1, ( err1, res1, body1 ) => {
        if( err1 ){
          console.log( 'err1', err1 );
          reject( err1 );
        }else{
          var profile = JSON.parse( body1 );
          //console.log( JSON.stringify( profile, null, 2 ) );
          resolve( profile );
        }
      });
    }else{
      reject( 'no access token' );
    }
  });
}

//. https://us-south.appid.cloud.ibm.com/swagger-ui/#/Management%20API%20-%20Users/mgmt.users_search_user_profile
async function listUsers( access_token ){
  return new Promise( async ( resolve, reject ) => {
    if( access_token ){
      var headers1 = {
        accept: 'application/json',
        authorization: 'Bearer ' + access_token
      };
      var option1 = {
        url: 'https://' + settings.region + '.appid.cloud.ibm.com/management/v4/' + settings.tenantId + '/users',
        method: 'GET',
        headers: headers1
      };
      request( option1, ( err1, res1, body1 ) => {
        if( err1 ){
          console.log( 'err1', err1 );
          reject( err1 );
        }else{
          //console.log( { body1 } );
          var result1 = JSON.parse( JSON.stringify( body1 ) );
          resolve( result1 );
        }
      });
    }else{
      reject( 'no access token' );
    }
  });
}


