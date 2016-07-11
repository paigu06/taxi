var Sequelize = require( 'sequelize' );
var db = require( '../models' );
var moment = require( 'moment-timezone' );
var _ = require( 'lodash' );
var request = require( 'request' );
var math = require( 'mathjs' );

var Schedule = db.Schedule;
var Driver = db.Driver;
var Vehicle = db.Vehicle;
var Promise = require( 'promise' );

var logger = require( '../lib/individual.logger.js' );
var util = require( '../lib/individual.util.js' );
var _this = this;

exports.handleError = function( err, req, res ){
    util.handleError( 'schedule', err, req, res );
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
 * Retrieves all wire batches.
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
        where: {}
    };
    Schedule.findAll( query )
        .then( function( schedule ){
            res.send( 201, { schedule: schedule } );
        } )
        .catch( function( err ){
            console.log( err );
        } );
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

exports.view = function( req, res, next ){
        Schedule.findOne( {
            where: {
                vehicles_id: req.params.vehicles_id
            }
        } ).then( function( schedule ){
            if( !schedule ){
                res.send( 404, { errors: '!could not find schedule' } );
                return next();
            }
            else{
                res.send( 200, { schedule: schedule } );
                return next();
            }
        } ).catch( function( err ){
            _this.handleError( err, req, res );
            return next();
        } )

};


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
   console.log('######@#@#---------#');
    Driver.findById( req.body.driver_id )
        .then( function( driver ){
            if( driver !== null ){
                var schedule = Schedule.build( {
                    driver_id: req.body.driver_id,
                    vehicles_id: req.body.vehicles_id,
                    date: req.body.date
                } );

                schedule.save()
                    .then( function(){
                        res.send( 201, { schedule: schedule } );
                        return next();
                    } );

            } else{
                res.send( 404, { message: 'could not find the id' } );
                return next();
            }
        }
    ).
        catch( function( err ){
            _this.handleError( err, req, res );
            return next();
        } );

};

exports.remove = function( req, res, next ){
    console.log('-----##$#@#@#**&*&');
    Schedule.find( {
        where: {
            id: req.params.schedule_id
        }
    } )
        .then( function( schedule ){

            return schedule.destroy()
                .then( function(){
                    res.send( 200, { schedule: schedule } );
                    return next();
                } )

        } )
        .catch( function( err ){
            _this.handleError( err, req, res );
            return next();
        } );


};

exports.update = function( req, res, next ){
    console.log('----@@@@@@',req.params);

    Schedule.find( {
        where: {
            id: req.params.schedule_id
        }
    } )
        .then( function( schedule, err ){
            console.log(err);
            schedule.driver_id = req.body.driver_id;
            schedule.vehicles_id = req.body.vehicles_id;
            schedule.save().then(function(schedule){
                res.send( 200, { schedule: schedule } );
                return next();
            });

        } )
        .catch( function( err ){
            _this.handleError( err, req, res );
            return next();
        } );


};



