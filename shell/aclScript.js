var _ = require( 'lodash' );
var Sequelize = require( 'sequelize' );
var db = require( '../models' );
var User = db.User;
var Token = db.Token;
var routes = require( '../config/routes.js' );
var config = require( '../config/config.json' );
var amqp = require( 'amqplib/callback_api' );
var Promise = require( 'promise' );
var _this = this;
var Passport = require( 'passport' ).Passport,
    passportKey = new Passport(),
    passportToken = new Passport();

var defaultFalse = {
    "GET /keys": false
};

var defaultACL = {};

var server = {
    get: function( path ){
        defaultACL[ "GET " + path ] = true;
    },
    put: function( path ){
        defaultACL[ "PUT " + path ] = true;
    },
    post: function( path ){
        defaultACL[ "POST " + path ] = true;
    },
    del: function( path ){
        defaultACL[ "DELETE " + path ] = true;
    }
};

var passport = {
    authenticate: function(){
    }
};

exports.getServerRouterRoutes = function(){
    routes( server, passportToken, passportKey );
    var falseProps = _.keys( defaultFalse );
    for( var i = 0; i < falseProps.length; i++ ){
        _.forEach( defaultACL, function( obj ){
            if( defaultACL.hasOwnProperty( [ falseProps[ i ] ] ) ){
                defaultACL[ falseProps[ i ] ] = false;
            }
        } );
    }

    User.findAll()
        .then( function( users ){
            var promises = [];
            _.forEach( users, function( user ){
                var tmpAccess = JSON.parse( user.access );

                user.access = defaultACL;

                if( !_.isEmpty( tmpAccess ) ){
                    for( var key in user.access ){
                        if( user.access.hasOwnProperty( key ) && tmpAccess.hasOwnProperty( key ) ){
                            user.access[ key ] = tmpAccess[ key ];
                        }
                    }
                }
                user.access = JSON.stringify( user.access );
                promises.push( user.save() );

            } );
            promises.push( Token.destroy( { truncate: true } ) );
            Promise.all( promises )
                .then( function(){
                    process.exit( 0 );
                } );

        } ).catch( function( err ){
            console.log( err );
        } );
};

this.getServerRouterRoutes();