/**
 *
 * Type:

 *
 * Status:
 * 0: New
 * 1: Active
 *
 */
/**
 * Authenticators are used to generate one time codes which allow users to access higher level actions such as invoice
 * payments and wire transfers.
 * @module models
 * @class Authenticator
 * @type {exports}
 */
module.exports = function( sequelize, DataTypes ){
    var Vehicle = sequelize.define( 'Vehicle', {
            /**
             * @property id
             * @type String
             * @description Object id
             * @required
             */
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true
            },
            /**
             * @property name
             * @type String
             * @description Name of the device
             * @required
             */
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            /**
             * @property key
             * @type String
             * @description Secret key of the device if used. Such as HMAC devices
             */
            brand: {
                type: DataTypes.STRING,
                allowNull: true
            },
            /**
             * @property age
             * @type String
             * @description Secret age of the driver if used.
             */
            age: {
                type: DataTypes.STRING,
                allowNull: true
            },
            /**
             * @property age
             * @type String
             * @description Secret a
            /**
             * @property type
             * @type Number
             * @description Device type
             * - 0: Phone (TOTP)
             * - 1: Tablet (TOTP)
             * - 2: Other (TOTP)
             * - 3: [Yubikey](https://www.yubico.com) (HOTP)
             *
             * In general, all devices' code generation are based on [HMAC](https://en.wikipedia.org/wiki/HMAC-based_One-time_Password_Algorithm).
             *
             * @required
             */
            type: {
                type: DataTypes.INTEGER( 2 ),
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isIn: [
                        [ 0, 1, 2, 3 ]
                    ]
                },
                comment: '0: Phone, 1: Tablet, 2: Other, 3: Yubikey'
            },
            /**
             * @property status
             * @type Number
             * @description Device status
             * - 0: New
             * - 1: Active
             *
             * @required
             */
            status: {
                type: DataTypes.INTEGER( 2 ),
                allowNull: false,
                validate: {
                    isIn: [
                        [ 0, 1 ]
                    ]
                },
                defaultValue: 0,
                comment: '0: New, 1: Active'
            }
        },
        {
            tableName: 'vehicle',
            classMethods: {
                /**
                 * Compare a code against a HMAC TOTP device identified by the device secret key.
                 *
                 * @method validateTOTP
                 * @param key
                 * @param code
                 * @return {Boolean} Returns true if the code is valid.
                 */
                validateTOTP: function( key, code ){
                    var TOTP = require( 'onceler' ).TOTP;
                    var totp = new TOTP( key, 6, 30 );
                    var verified = totp.verify( code );
                    var window = 4; // allow plus-minus four iterations

                    var counter = Math.floor( new Date().getTime() / 1000 );

                    // Check +/- 30 sec
                    if( !verified ){
                        for( var i = counter - window * 30; i <= counter + window * 30; i += 30 ){
                            verified = ( code === totp.at( i ).toString() );
                            if( verified ) break;
                        }
                    }

                    return verified;
                }
            },
            instanceMethods: {
                toJSON: function () {
                    var values = this.get();
                    if( values.status !== 0 ){
                        delete values.key;
                    }
                    delete values.reset;
                    return values;
                }
            }
        } );
    return Vehicle;
};
