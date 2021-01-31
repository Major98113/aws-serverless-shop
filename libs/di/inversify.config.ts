import { Container } from "inversify";
import "reflect-metadata";
import { DBInterface } from "../db/DB.interface";
import { TYPES } from "../types";
import { PostgresDB } from "../db/postgres.db";

const diContainer = new Container();

diContainer.bind<DBInterface>(TYPES.DB).to(PostgresDB);
// diContainer.bind<Weapon>(TYPES.LOGGER).to(Katana);
export { diContainer };
