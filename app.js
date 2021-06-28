//. app.js

var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    // eslint-disable-next-line no-unused-vars
    ejs = require( 'ejs' ),
    passport = require( 'passport' ),
    request = require( 'request' ),
    session = require( 'express-session' ),
    WebAppStrategy = require( 'ibmcloud-appid' ).WebAppStrategy,
    app = express();

var settings = require( './settings' );

//. env values
var settings_region = 'REGION' in process.env ? process.env.REGION : settings.region;
var settings_tenantId = 'TENANT_ID' in process.env ? process.env.TENANT_ID : settings.tenantId;
var settings_apiKey = 'APIKEY' in process.env ? process.env.APIKEY : settings.apiKey;
var settings_secret = 'SECRET' in process.env ? process.env.SECRET : settings.secret;
var settings_clientId = 'CLIENT_ID' in process.env ? process.env.CLIENT_ID : settings.clientId;
var settings_redirectUri = 'REDIRECT_URI' in process.env ? process.env.REDIRECT_URI : settings.redirectUri;
var settings_oauthServerUrl = 'https://' + settings_region + '.appid.cloud.ibm.com/oauth/v4/' + settings_tenantId;

//. setup session
app.use( session({
  secret: 'appid_users',
  resave: false,
  cookie: { maxAge: ( 365 * 24 * 60 * 60 * 1000 ) },
  saveUninitialized: false
}));

//. setup passport
app.use( passport.initialize() );
app.use( passport.session() );
passport.serializeUser( ( user, cb ) => cb( null, user ) );
passport.deserializeUser( ( user, cb ) => cb( null, user ) );
passport.use( new WebAppStrategy({
  tenantId: settings_tenantId,
  clientId: settings_clientId,
  secret: settings_secret,
  oauthServerUrl: settings_oauthServerUrl,
  redirectUri: settings_redirectUri
}));

//. post data
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

//. enable routing
app.use( express.Router() );
// eslint-disable-next-line no-undef
app.use( express.static( __dirname + '/public' ) );

//. template engine
// eslint-disable-next-line no-undef
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

//. login
app.get( '/appid/login', passport.authenticate( WebAppStrategy.STRATEGY_NAME, {
  successRedirect: '/',
  forceLogin: false //true
}));

//. callback
app.get( '/appid/callback', function( req, res, next ){
  next();
}, passport.authenticate( WebAppStrategy.STRATEGY_NAME )
);

//. logout
app.get( '/appid/logout', function( req, res ){
  WebAppStrategy.logout( req );
  req.user = null;
  res.redirect( '/' );
});

//. access restriction
app.all( '/*', function( req, res, next ){
  if( !req.user || !req.user.sub ){
    res.redirect( '/appid/login' );
  }else{
    next();
  }
});


//. top page
app.get( '/', function( req, res ){
  req.user.id = req.user.sub;
  res.render( 'index', { user: req.user } );
});


//. listening to port
// eslint-disable-next-line no-undef
var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );

