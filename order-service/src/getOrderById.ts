import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { OrdersModel, OrderStatistics } from "../../libs/models/orders.model";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const getOrderById: ( event ) => Promise<responseInterface> = async ( event ) => {
    try {
        const { orderId = '' } = event.pathParameters;
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const ordersModelInstance = new OrdersModel( DBInstance );

        await DBInstance.connect();
        const order: OrderStatistics| null = await ordersModelInstance.getOrderById( orderId );
        
        if( order )
            return successResponse( { order } );

        await DBInstance.disconnect();

        return successResponse( { message: "Order not found!!!" }, 404 );
    }
    catch ( err ) {
        return errorResponse( err );
    }
}
