module.exports = function( server ){

    // drivers
    var drivers = require( '../controllers/drivers' );
    server.get( '/drivers', drivers.index );
    server.post( '/drivers/add', drivers.add );
    //server.get( '/drivers/:drivers_id/schedule', drivers.schedule );
    server.post( '/drivers/:drivers_id/remove',  drivers.remove );

    // vehicles
    var vehicles = require( '../controllers/vehicles' );
    server.get( '/vehicles', vehicles.index );
    server.post( '/vehicles/add', vehicles.add );
    server.get( '/vehicles/:vehicles_id', vehicles.view );
    server.post( '/vehicles/:vehicles_id/remove',  vehicles.remove );

    // schedule
    var schedule = require( '../controllers/schedule' );
    server.get( '/schedules', schedule.index );
    server.get( '/schedules/:vehicles_id', schedule.view );
    server.post( '/schedules/add', schedule.add );
    server.put( '/schedules/:schedule_id/update', schedule.update );
    server.post('/schedules/:schedule_id/remove',  schedule.remove );
};