var Sequelize = require( 'sequelize' );
var db = require( '../models' );
var moment = require( 'moment-timezone' );
var _ = require( 'lodash' );
var request = require( 'request' );
var math = require( 'mathjs' );

var Driver = db.Driver;
var Schedule = db.Schedule;
var Promise = require( 'promise' );

var logger = require( '../lib/individual.logger.js' );
var util = require( '../lib/individual.util.js' );
var _this = this;

exports.handleError = function( err, req, res ){
    util.handleError( 'drivers', err, req, res );
};

/**
 * @api {GET} /wireBatches Retrieve All wire batches
 * @apiName WireBatchesIndex
 * @apiGroup wireBatches
 * @apiVersion 1.0.0
 * @apiDescription Retrieves all wire batches.
 *
 * @apiSuccess {Object[]} batches The wireBatches object
 *
 * @apiError {String[]} errors An array of errors
 */

/**
 * Retrieves all drivers.
 *
 * @method index
 *
 * @param req
 * @param res
 * @param next
 * @return {Function} next
 */

exports.index = function( req, res, next ){
    var query = {
        where: {  }
    };
    Driver.findAll( query )
        .then( function( driver ){
            res.send( 201, { driver: driver } );
        } )
        .catch( function( err ){
            console.log( err );
        });
    return next();
};

/**
 * @api {GET} /wireBatches/:wire_batch_id Retrieves wire batch
 * @apiName WireBatchesView
 * @apiGroup WireBatches
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a specific wire batch based on id
 *
 * @apiParam {String} wire_batch_id Wire batch Object Id
 *
 * @apiSuccess {Object} batch Wire batch object
 *
 * @apiError (404) {String[]} errors A List of error messages
 *
 */

/**
 * Retrieve a specific wire batch based on id
 *
 * @method view
 *
 * @param req
 * @param res
 * @param next
 * @returns {Function} next
 */



exports.add = function( req, res, next ){
    var driver = Driver.build( {
        id: req.body.id,
        name: req.body.name,
        license_id: req.body.license_id,
        age: req.body.age,
        gender: req.body.gender,
        type: 0,
        status: 0
    } );

    driver.save()
        .then( function(){
            res.send( 201, { driver: driver } );
            return next();
        } )
        .catch( function( err ){
            _this.handleError( err, req, res );
            return next();
        } );


};

exports.remove = function( req, res, next ){
    Driver.find( {
        where: {
            id: req.params.drivers_id
        }
    } )
        .then( function( driver ){
            Schedule.find( {
                where: {
                    driver_id: req.params.drivers_id
                }
            } ).then( function( schedule ){
                schedule.destroy();
            } );
            return driver.destroy()
                .then( function(){
                    res.send( 200, { driver: driver } );
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



