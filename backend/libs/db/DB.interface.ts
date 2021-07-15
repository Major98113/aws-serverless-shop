interface DBInterface {
    connect: {
        ( ): Promise <any>
    },
    query: {
        ( query: string, values?: (null | boolean | number | string)[] ): Promise <any>
    },
    disconnect: {
        ( ): Promise <any>
    }
}

export { DBInterface };
