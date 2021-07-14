import { DBInterface } from "../../libs/db/DB.interface";
import { diContainer } from "../../libs/di/inversify.config";
import { LoggerInterface } from "../../libs/logger/logger.interface";
import { TYPES } from "../../libs/types";

interface OrderInterface {
    id: string,
    status: string,
    created_at: string,
    updated_at: string
}

interface OrderProduct {
    order_id: string
    product_id: string,
    count: number
}

interface OrdersModelInterface {
    getOrderById( id: string ): Promise<null | OrderInterface>
    getAllOrders(): Promise<OrderInterface[]>
}

class OrdersModel implements OrdersModelInterface {
    private readonly DB: DBInterface;
    private readonly logger: LoggerInterface;

    constructor( DB: DBInterface) {
        this.DB = DB;
        this.logger = diContainer.get<LoggerInterface>( TYPES.LOGGER );
    }

    async getOrderById( id: string ) {
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
            this.logger.logError( `Method OrdersModel::getOrderById. Error: ${ error }` );
            throw new Error( error  );
        }
    }

    async getAllOrders() {
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
            this.logger.logError( `Method OrdersModel::getAllOrders. Error: ${ error }` );
            throw new Error( error  );
        }
    }
}

export { OrdersModel, OrderInterface };
