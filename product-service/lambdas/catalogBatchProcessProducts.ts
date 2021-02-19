import { errorResponse, responseInterface, successResponse } from "../../libs/response-helpers";
import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { ProductsModel } from "../../libs/models/products.model";

export const catalogBatchProcessProducts: ( event, _context ) => Promise<responseInterface> = async ( event, _context ) => {
    try {
        const { Records } = event;
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const productsModelInstance = new ProductsModel( DBInstance );
        await DBInstance.connect();

        for (const { body } of Records) {
            const { title = "", description = "", price = "", logo = "", count = 0 } = JSON.parse( body );

            await productsModelInstance.createProduct(
                { title, description, price, logo, count }
            );
        }

        return successResponse( { message: "Products successfully imported to DB" } );
    }
    catch (err) {
        return errorResponse( err );
    }
}
