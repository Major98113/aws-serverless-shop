import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { OrdersModel, CreatedOrderStatistics } from "../../libs/models/orders.model";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const createOrder: ( event, _context ) => Promise<responseInterface> = async (event, _context) => {
    try {
        const { address, items } = JSON.parse( event.body );
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const ordersModelInstance = new OrdersModel( DBInstance );

        await DBInstance.connect();

        const order: CreatedOrderStatistics = await ordersModelInstance.createOrder(
            { address, items }
        );

        await DBInstance.disconnect();

        return successResponse( { order } );
    } 
    catch (err) {
        return errorResponse( err );
    }
}
