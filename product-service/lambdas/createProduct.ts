import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { ProductsModel, ProductInterface } from "../models/products.model";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const createProduct: ( event, _context ) => Promise<responseInterface> = async (event, _context) => {
    try {
        const { title, description, price, logo, count } = JSON.parse( event.body );
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const productsModelInstance = new ProductsModel( DBInstance );

        await DBInstance.connect();

        const product: ProductInterface = await productsModelInstance.createProduct(
            { title, description, price, logo, count }
        );

        return successResponse( { product } );
    } 
    catch (err) {
        return errorResponse( err );
    }
}