interface DBInterface {
    connect: {
        ( ): Promise <any>
    },
    query: {
        ( query: string ): Promise <any>
    }
}

export { DBInterface };
