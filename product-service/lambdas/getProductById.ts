import 'source-map-support/register';
import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const getProductById: (event, _context) => Promise<responseInterface> = async (event, _context) => {
    try {
        // @ts-ignore
        const { productId = '' } = event.pathParameters;
        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        // @ts-ignore
        // const DBInstance: DBInterface = new DB( process.env );
        await DBInstance.connect();

        const res = await DBInstance.query('select * from products');
        console.log(res);
        return successResponse( { message: res } );
    }
    catch ( err ) {
        return errorResponse( err );
    }
}
