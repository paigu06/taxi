var restify = require( 'restify' );
var restifyValidation = require( 'restify-validation' );
var moment = require( 'moment-timezone' );
var db = require( './models' );
var logger = require( './lib/individual.logger.js' );
var util = require( './lib/individual.util.js' );
var winston = require( 'winston' );
var config = require( './config/config.json' );
var _this = this;

if( typeof process.env.NODE_ENV === 'undefined' ){
    process.env.NODE_ENV = 'production';
}

console.log( 'Launching in ' + process.env.NODE_ENV + ' mode' );


for( var i = 0; i < logger.logs.length; i++ ){
    var transportOptions = {
        filename: './log/' + logger.logs[ i ] + '.log',
        maxsize: 1000000000,
        json: false,
        timestamp: false,
        handleExceptions: false,
        exitOnError: false
    };

    if( logger.logs[ i ] === 'error' ){
        transportOptions.handleExceptions = true;
    }

    winston.loggers.add( logger.logs[ i ], {
        transports: [
            new winston.transports.DailyRotateFile( transportOptions ),
            new winston.transports.Console()
        ]
    } );

    winston.loggers.loggers[ logger.logs[ i ] ].setLevels( logger.levels );
}

var server = restify.createServer( {
    name: config.base.name,
    version: config.base.version
} );


server.use( restify.acceptParser( server.acceptable ) );
server.use( restify.queryParser() );
server.use( restify.bodyParser() );
server.use( restify.authorizationParser() );
server.use( restify.CORS() );
server.use( restify.fullResponse() );
server.use( util.sanitize() );
server.use( restifyValidation() );

restify.CORS.ALLOW_HEADERS.push( 'authorization' );

server.on( 'uncaughtException', function( req, res, route, error ){
    winston.loggers.get( 'error' ).log( 'critical', moment().format( 'YYYY-MM-DD HH:mm:ss' ) + ' ' + error.stack );
    winston.loggers.get( 'error' ).log( 'critical', moment().format( 'YYYY-MM-DD HH:mm:ss' ) + ' ' + req );
    winston.loggers.get( 'error' ).log( 'critical', moment().format( 'YYYY-MM-DD HH:mm:ss' ) + ' ' + route );
    winston.loggers.get( 'error' ).log( 'critical', moment().format( 'YYYY-MM-DD HH:mm:ss' ) + ' ' + res );
    winston.loggers.get( 'error' ).log( 'critical', moment().format( 'YYYY-MM-DD HH:mm:ss' ) + ' ' + error );

    console.log( error );
    console.log( error.stack );
} );


db.sequelize.sync( { force: false } )
    .then( function(){
                server.listen( config.base.port, function(){
                    console.log( config.base.name + ' listening on port ' + config.base.port );
                    require( './config/routes' )( server);
                } );
    } )
    .catch( function( err ){
        console.log( err );
    } );
