import { DBInterface } from "../../libs/db/DB.interface";
import { diContainer } from "../../libs/di/inversify.config";
import { LoggerInterface } from "../../libs/logger/logger.interface";
import { TYPES } from "../../libs/types";

interface OrderProductRecord {
    id: string, 
    status: string, 
    created_at: string, 
    updated_at: string, 
    count: number, 
    product_id: string 
}

interface OrderStatistics {
    order_id: string,
    products: {  
        id: string,
        count: number
    }[],
    created_at: string,
    updated_at: string,
    status: string
}

interface OrdersModelInterface {
    getOrderById( id: string ): Promise<null | OrderStatistics>
    getAllOrders(): Promise<OrderStatistics[]>
}

class OrdersModel implements OrdersModelInterface {
    private readonly DB: DBInterface;
    private readonly logger: LoggerInterface;
    private mapRecordsToOrderStatistics = ( records: OrderProductRecord[] ): OrderStatistics[] => {
        const orders: OrderStatistics[] = [];

        for( let { id, status, created_at, updated_at, count, product_id } of records ){
            const order: OrderStatistics = orders.find( ({ order_id }) => order_id === id ); 

            if( !order ) {
                orders.push({
                    order_id: id,
                    products: [ { id: product_id, count } ],
                    created_at,
                    updated_at,
                    status
                });

                continue;
            }

            order.products = [ ...order.products, { id: product_id, count } ]
        }

        return orders;
    }

    constructor( DB: DBInterface) {
        this.DB = DB;
        this.logger = diContainer.get<LoggerInterface>( TYPES.LOGGER );
    }

    async getOrderById( id: string ) {
        try {
            const response = await this.DB.query(`
                SELECT orders.id, orders.status, orders.created_at, orders.updated_at, order_products.count, order_products.product_id
                    FROM orders
                        INNER JOIN order_products ON
                            orders.id = order_products.order_id
                                WHERE orders.id = $1
                                    ORDER BY orders.id;`, [ id ]
            );

            if( response?.rows?.length ) {
                const [ result ] = this.mapRecordsToOrderStatistics( response.rows );;
                return result;
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
                `SELECT orders.id, orders.status, orders.created_at, orders.updated_at, order_products.count, order_products.product_id
                    FROM orders
                        INNER JOIN order_products ON
                            orders.id = order_products.order_id
                                ORDER BY orders.id;`
            );

            if( response?.rows?.length )
                return this.mapRecordsToOrderStatistics( response.rows );
            
            return []; 
        } 
        catch (error) {
            this.logger.logError( `Method OrdersModel::getAllOrders. Error: ${ error }` );
            throw new Error( error  );
        }
    }
}

export { OrdersModel, OrderStatistics };
