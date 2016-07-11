var Sequelize = require( 'sequelize' );
var db = require( '../models' );
var moment = require( 'moment-timezone' );
var _ = require( 'lodash' );
var request = require( 'request' );
var math = require( 'mathjs' );

var Vehicle = db.Vehicle;
var Schedule = db.Schedule;
var Promise = require( 'promise' );

var logger = require( '../lib/individual.logger.js' );
var util = require( '../lib/individual.util.js' );
var _this = this;


exports.handleError = function( err, req, res ){
    util.handleError( 'batch', err, req, res );
};


exports.index = function( req, res, next ){
    var query = {
        where: {}
    };
    Vehicle.findAll( query )
        .then( function( vehicle ){
            res.send( 201, { vehicle: vehicle } );
        } )
        .catch( function( err ){
            console.log( err );
        } );
    return next();
};



exports.view = function( req, res, next ){
    console.log('-----!!!!!!');

    Schedule.find( {
        where: {
            vehicles_id: req.params.vehicles_id
        }
    } ).then( function( schedule ){
        if( !schedule ){
            res.send( 404, { errors: 'could not find schedule' } );
            return next();
        }
        else{
            console.log( '@@@@', schedule );
            res.send( 200, { schedule: schedule } );
            return next();

        }
    } ).
        catch( function( err ){
            console.log( err );
        } );

}


/**
 * @api {post} /batches Create Batch
 * @apiVersion 1.0.0
 * @apiName BatchCreate
 * @apiGroup Batches
 * @apiDescription Creates a new batch.
 *
 * @apiParam {Object} batch Object batch
 *
 * @apiSuccess {Object} The Batch Object
 * @apiError (422) {String[{}]} errors A list of error messages
 *
 */

/**
 * Creates a new batch.
 *
 * @method create
 * @param req
 * @param res
 * @param next
 * @returns {function} next
 */

exports.add = function( req, res, next ){
    console.log('-@#@#@#@#!');
    var vehicle = Vehicle.build( {
        id: req.body.id,
        name: req.body.name,
        brand: req.body.brand,
        age: req.body.age,
        type: req.body.type,
        status: 0
    } );

    vehicle.save()
        .then( function(){
            res.send( 201, { vehicle: vehicle } );
            return next();
        } )
        .catch( function( err ){
            console.log( 'here is the err', err );
            _this.handleError( err, req, res );
            return next();
        } );
};

exports.remove = function( req, res, next ){
    Vehicle.find( {
        where: {
            id: req.params.vehicles_id
        }
    } )
        .then( function( vehicle ){
            Schedule.find( {
                where: {
                    vehicles_id: req.params.vehicles_id
                }
            } ).then( function( schedule ){
                console.log( 'here is the schedule', schedule );
                schedule.destroy();
            } );
            return vehicle.destroy()
                .then( function(){
                    res.send( 200, { vehicle: vehicle } );
                    return next();
                } )

        } )
        .catch( function( err ){
            _this.handleError( err, req, res );
            return next();
        } );


};

exports.update = function( req, res, next ){
    req.assert( 'batch', 'isObject' );
    req.assert( 'batch.raw_data', 'isString' );
    req.assert( 'batch.count', 'isNumber' );
    req.assert( 'batch.amount', 'isNumber' );


};



