import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { OrdersModel, OrderInterface } from "../../libs/models/orders.model";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const getAllOrders: ( event ) => Promise<responseInterface> = async ( _event ) => {
    try {
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const ordersModelInstance = new OrdersModel( DBInstance );

        await DBInstance.connect();

        const orders: OrderInterface[] = await ordersModelInstance.getAllOrders();

        await DBInstance.disconnect();

        return successResponse( orders );
    } 
    catch (err) {
        return errorResponse( err );
    }
}
