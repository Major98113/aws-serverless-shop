import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { ProductsModel, ProductInterface } from "../models/products.model";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const getProductById: (event, _context) => Promise<responseInterface> = async (event, _context) => {
    try {
        const { productId = '' } = event.pathParameters;
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const productsModelInstance = new ProductsModel( DBInstance );

        await DBInstance.connect();
        const product: ProductInterface | null = await productsModelInstance.getProductById( productId );

        return successResponse( { product } );
    }
    catch ( err ) {
        return errorResponse( err );
    }
}
