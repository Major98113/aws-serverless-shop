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
    getProductById( id: string ): Promise<null | ProductInterface>
    getAllProducts(): Promise<ProductInterface[]>
    createProduct( product: ProductInterface ): Promise<null | ProductInterface>
    removeProduct( id: string ): Promise<any>
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
                            products.id = $1
                                AND stocks.product_id = $1;`, [ id ]
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

    async createProduct({ title, description, price, logo, count }) {
        try {
            const { rows: [ createdProductRecord ] } = await this.DB.query(
                `INSERT INTO products ( title, description, price, logo ) 
                    VALUES ( $1, $2, $3, $4 ) 
                        RETURNING *`, [ title, description, Number( price ), logo ]
            );

            const { rows: [ createdStockRecord ] } = await this.DB.query(
                `INSERT INTO stocks ( product_id, count ) 
                    VALUES ( $1, $2 ) 
                        RETURNING *`, [ createdProductRecord.id, Number( count ) ]
            ); 

            return {
                ...createdProductRecord,
                count: createdStockRecord.count
            }; 
        } 
        catch (error) {
            this.logger.logError( `Method ProductsModel::createProduct. Error: ${ error }` );
            throw new Error( error  );
        }
    }

    async removeProduct( id: string ) {
        try {
            await Promise.all([
                this.DB.query(`DELETE FROM products WHERE id = $1;`, [ id ]),
                this.DB.query(`DELETE FROM stocks WHERE product_id = $1;`, [ id ])
            ]);
        }
        catch(error) {
            this.logger.logError( `Method ProductsModel::removeProduct. Error: ${ error }` );
            throw new Error( error  );
        }
    }
}

export { ProductsModel, ProductInterface };
