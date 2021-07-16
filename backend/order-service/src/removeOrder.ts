import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { OrdersModel } from "../../libs/models/orders.model";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const removeOrder: ( event, _context ) => Promise<responseInterface> = async (event, _context) => {
    try {
        const { orderId = '' } = event.pathParameters;
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const ordersModelInstance = new OrdersModel( DBInstance );

        await DBInstance.connect();

        await ordersModelInstance.removeOrder( orderId );

        await DBInstance.disconnect();

        return successResponse( { message: "Order successfully removed" } );
    } 
    catch (err) {
        return errorResponse( err );
    }
}
