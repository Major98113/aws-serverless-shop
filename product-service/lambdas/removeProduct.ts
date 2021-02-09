import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { ProductsModel } from "../models/products.model";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const removeProduct: ( event, _context ) => Promise<responseInterface> = async (event, _context) => {
    try {
        const { productId = '' } = event.pathParameters;
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const productsModelInstance = new ProductsModel( DBInstance );

        await DBInstance.connect();

        await productsModelInstance.removeProduct( productId );

        return successResponse( { message: "Product successfully removed" } );
    } 
    catch (err) {
        return errorResponse( err );
    }
}