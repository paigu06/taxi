module.exports = function( sequelize, DataTypes ){
    var Schedule = sequelize.define( 'Schedule', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true
            },
            /**
             * @property id
             * @type String
             * @description Object id
             * @required
             */
            driver_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            /**
             *  count:
             *  0: New
             *  1: Submitted
             *  2: Received
             *  3: Cleared
             */
            vehicles_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            /**
             *  Status:
             *  0: New
             *  1: Submitted
             *  2: Received
             *  3: Cleared
             *  4: Denied
             */

            date: {
                type: DataTypes.DATE,
                allowNull: false
            }

        },
        {
            tableName: 'schedule'
        } );
    return Schedule;
};
