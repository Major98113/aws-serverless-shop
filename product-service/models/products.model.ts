import { DBInterface } from "../../libs/db/DB.interface";
import { diContainer } from "../../libs/di/inversify.config";
import { LoggerInterface } from "../../libs/logger/logger.interface";
import { TYPES } from "../../libs/types";

interface ProductInterface {
    id?: string,
    title: string,
    description: string,
    price: number,
    logo: string,
    count?: number
}

interface ProductsModelInterface {
    getProductById( id: string ): Promise< null | ProductInterface >
    getAllProducts(): Promise< ProductInterface[] >
}

class ProductsModel implements ProductsModelInterface{
    private readonly DB: DBInterface;
    private readonly logger: LoggerInterface;

    constructor( DB: DBInterface) {
        this.DB = DB;
        this.logger = diContainer.get<LoggerInterface>( TYPES.LOGGER );
    }

    async getProductById( id: string ) {
        try {
            const response = await this.DB.query(`
                SELECT products.id, products.title, products.description, products.price, products.logo, stocks.count 
                FROM products 
                INNER JOIN stocks ON 
                products.id = '${ id }'
                AND stocks.product_id = '${ id }';`
            );

            if( response?.rows?.length ) {
                const { rows: [ product ] } = response;

                return product;
            }
            
            return null;

        }
        catch( error ) {
            this.logger.logError( `Method ProductsModel::getProductById. Error: ${ error }` );
            throw new Error( error  );
        }
    }

    async getAllProducts() {
        try {
            const response = await this.DB.query(
                `SELECT products.id, products.title, products.description, products.price, products.logo, stocks.count 
                    FROM products 
                        INNER JOIN stocks ON 
                            products.id = stocks.product_id;`
            );

            if( response?.rows?.length ) {
                const { rows } = response;

                return rows;
            }
            
            return []; 
        } 
        catch (error) {
            this.logger.logError( `Method ProductsModel::getAllProducts. Error: ${ error }` );
            throw new Error( error  );
        }
    }
}

export { ProductsModel, ProductInterface };
