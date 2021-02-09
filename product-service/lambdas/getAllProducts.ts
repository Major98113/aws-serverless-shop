import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { ProductsModel, ProductInterface } from "../models/products.model";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const getAllProducts: (event, _context) => Promise<responseInterface> = async (event, _context) => {
    try {
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const productsModelInstance = new ProductsModel( DBInstance );

        await DBInstance.connect();

        const products: ProductInterface[] = await productsModelInstance.getAllProducts();

        return successResponse( { products } );
    } 
    catch (err) {
        return errorResponse( err );
    }
}