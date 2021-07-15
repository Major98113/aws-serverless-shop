import { DBInterface } from "../../libs/db/DB.interface";
import { diContainer } from "../../libs/di/inversify.config";
import { LoggerInterface } from "../../libs/logger/logger.interface";
import { TYPES } from "../../libs/types";

interface OrderProductRecord {
    id: string, 
    status: string, 
    created_at?: string, 
    updated_at?: string, 
    count: number, 
    product_id: string 
}

interface OrderStatistics {
    items: {
        order_id: string,
        products: {  
            id: string,
            count: number
        }[],
        created_at: string,
        updated_at: string,
        status: string
    },
    address: OrderUserInfo
}

interface CreatedOrderStatistics {
    items: {
        order_id: string,
        products: {  
            id: string,
            count: number
        }[],
        status: string
    },
    address: OrderUserInfo
}

interface NewOrderPayload {
    items: { productId: string, count: number }[],
    address: NewOrderUserInfo
}

interface NewOrderUserInfo {
    address: string,
    comment: string,
    firstName: string,
    lastName: string
}

interface NewOrderProductRecord{
    order_id: string,
    product_id: string,
    count: number
}

interface OrderUserInfo {
    order_id: string,
    address: string,
    comment: string,
    firstname: string,
    lastname: string
}



class OrdersModel {
    private readonly DB: DBInterface;
    private readonly logger: LoggerInterface;
    private mapRecordsToOrderStatistics = ( records: OrderProductRecord[], adresses: OrderUserInfo[] ): OrderStatistics[] => {
        const ordersStat: OrderStatistics[] = [];

        for( let { id, status, created_at, updated_at, count, product_id } of records ){
            const order: OrderStatistics = ordersStat.find( ({ items: { order_id }}) => order_id === id ); 
            const address = adresses.find(({ order_id }) => order_id === id);
            
            if( !order ) {
                ordersStat.push({
                    items: {
                        order_id: id,
                        products: [ { id: product_id, count } ],
                        created_at,
                        updated_at,
                        status
                    },
                    address
                });

                continue;
            }

            order.items.products = [ ...order.items.products, { id: product_id, count } ]
        }

        return ordersStat;
    }

    private mapCreatedOrderRecordStatistics( orderProducts: NewOrderProductRecord[], address: OrderUserInfo ): CreatedOrderStatistics {
        const products: { id: string, count: number }[] = orderProducts.map( ({ product_id: id, count }) => ({ id, count })); 
        
        return {
            items: {
                order_id: address.order_id,
                products,
                status: 'open'
            },
            address
        }
    }

    constructor( DB: DBInterface) {
        this.DB = DB;
        this.logger = diContainer.get<LoggerInterface>( TYPES.LOGGER );
    }

    async getOrderById( id: string ): Promise<null | OrderStatistics> {
        try {
            const itemsResponse = await this.DB.query(`
                SELECT orders.id, orders.status, orders.created_at, orders.updated_at, order_products.count, order_products.product_id
                    FROM orders
                        INNER JOIN order_products ON
                            orders.id = order_products.order_id
                                WHERE orders.id = $1
                                    ORDER BY orders.id;`, [ id ]
            );

            const adressResponse = await this.DB.query(`
                SELECT orders.id order_id, order_user_info.address, order_user_info.comment, order_user_info.firstname, order_user_info.lastname
                    FROM orders
                        INNER JOIN order_user_info ON
                            orders.id = order_user_info.order_id
                                where order_id = $1
                                ORDER BY orders.id;`, [ id ]
            );

            if( itemsResponse?.rows?.length && adressResponse?.rows?.length ) {
                const [ result ] = this.mapRecordsToOrderStatistics( itemsResponse.rows, adressResponse.rows );
                return result;
            }
            
            return null;

        }
        catch( error ) {
            this.logger.logError( `Method OrdersModel::getOrderById. Error: ${ error }` );
            throw new Error( error  );
        }
    }

    async getAllOrders(): Promise<OrderStatistics[]> {
        try {
            const itemsResponse = await this.DB.query(
                `SELECT orders.id, 
                        orders.status, 
                        orders.created_at, 
                        orders.updated_at, 
                        order_products.count, 
                        order_products.product_id
                    FROM orders
                        INNER JOIN order_products ON
                            orders.id = order_products.order_id
                                ORDER BY orders.id;`
            );

            const adressResponse = await this.DB.query(
                `SELECT orders.id order_id, 
                        order_user_info.address, 
                        order_user_info.comment, 
                        order_user_info.firstname, 
                        order_user_info.lastname
                    FROM orders
                        INNER JOIN order_user_info ON
                            orders.id = order_user_info.order_id
                                ORDER BY orders.id;`
            );

            if( itemsResponse?.rows?.length && adressResponse?.rows?.length )
                return this.mapRecordsToOrderStatistics( itemsResponse.rows, adressResponse.rows );
            
            return []; 
        } 
        catch (error) {
            this.logger.logError( `Method OrdersModel::getAllOrders. Error: ${ error }` );
            throw new Error( error  );
        }
    }

    async createOrder( order: NewOrderPayload ): Promise<CreatedOrderStatistics> {
        try { 
            const INSERT_PROMISE: Promise<any>[] = [];
            const { items, address: { address, comment, firstName, lastName } } = order;
            
            const { rows: [ { id: orderId } ] } = await this.DB.query(
                `INSERT INTO orders ( status ) 
                    VALUES ( 'open' ) RETURNING *`
            );

            const { rows: [ newUserInfoRecord ] } = await this.DB.query(
                `INSERT INTO order_user_info ( order_id, address, comment, firstName, lastName ) 
                        VALUES ( $1, $2, $3, $4, $5 ) 
                            RETURNING *`, [ orderId, address, comment, firstName, lastName ]
            );

            for( let { productId, count } of items ) {
                INSERT_PROMISE.push(
                    this.DB.query(
                        `INSERT INTO order_products ( order_id, product_id, count ) 
                            VALUES ( $1, $2, $3 ) 
                                RETURNING *`, [ orderId, productId, count ]
                ))
            }

            const response: any[] = await Promise.all( INSERT_PROMISE );
            const resultRows = response.map( ({ rows: [ orderProductRecord ] }) => orderProductRecord );

            return this.mapCreatedOrderRecordStatistics( resultRows, newUserInfoRecord );
        }
        catch (error) {
            this.logger.logError( `Method OrdersModel::createOrder. Error: ${ error }` );
            throw new Error( error  );
        }
    }
}

export { OrdersModel, OrderStatistics, CreatedOrderStatistics };
