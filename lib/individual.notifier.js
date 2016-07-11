var request = require( 'request' );
var _ = require( 'lodash' );

var logger = require( './institutions.logger.js' );
var msgConfig = require( '../config/config.json' ).msg_api;
var db = require( '../models' );

var User = db.User;
var Company = db.User;

var _this = this;

exports.notifyCompany = function( template, company_id, data, req ){
    User.findAll( {
            where: [
                { company_id: company_id },
                { status: 1 }
            ]
        } )
        .complete( function( err, users ){
            if( !!err ){

            }
            else{
                _.forEach( users, function( user ){
                    _this.notifyUser( template, user, data, req );
                } );
            }
        } );
};

exports.notifyUser = function( template, user, data, req ){
    data.first_name = user.first_name;
    return _this.sendEmail( template, user.email, user.first_name + ' ' + user.last_name, data, req );
};

exports._sendEmail = function( template_name, email, recipient, data, req, options ){
    var formData = {
        template_name: template_name,
        email: email,
        data: data,
        key: msgConfig.mandrillApiKey,
        recipient: recipient
    };

    var meta = {
        strict: false
    };

    if( _.isObject( options.meta ) && !_.isEmpty( options.meta ) ){
        meta = _.merge( meta, options.meta );
    }

    formData[ 'meta' ] = meta;

    request.post( {
        url: msgConfig.host + '/emails',
        json: formData
    }, function( err, response, body ){
        if( err ){
            logger.error( 'email', template_name + ' ' + email + ' ' + JSON.stringify( err ), {
                req: req
            } );
        }
        else{
            if( response.statusCode === 200 || response.statusCode === 201 ){
                logger.info( 'email', template_name + ' ' + email, {
                    req: req
                } );
            }
            else{
                logger.error( 'email', template_name + ' ' + email + ' ' + JSON.stringify( body ), {
                    req: req
                } );
            }
        }
    } );
};

exports.sendEmail = function(){
    if( arguments.length < 6 ){
        return _this._sendEmail( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ], arguments[ 3 ], arguments[ 4 ], {} );
    }
    else{
        return _this._sendEmail( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ], arguments[ 3 ], arguments[ 4 ], arguments[ 5 ] );
    }
};

exports.notifyExternal = _this.sendEmail;