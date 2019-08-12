//region imports
import "reflect-metadata";
import {IEntityInitOptions} from "./types/interfaces/i-entity-init-options";
import {Mongo} from "./db/mongo";
import {IdbConnector} from "./types/interfaces/idb-connector";
import {Class} from "./types/types/class";

//endregion

export function Entity<T extends { new(...args: any[]) }>({collection_name}: IEntityDecoratorOptions = {}) {
    return (Class) => {
        Class.collection_name = collection_name || (Class.name);
        Entity.Classes.push(Class);
        return Class
    }
}

export namespace Entity {
    export let db: IdbConnector;

    export const
        Classes: Class[] = [],
        init: (db: IEntityInitOptions) => Promise<any> = async ({db_config}: IEntityInitOptions): Promise<any> => {
            const db_instance = db_config.mongo_instance || new Mongo();
            Entity.db = db_instance;
            await db_instance.init(db_config)
            await Entity.loadAll()
        },
        loadAll: () => Promise<void> = async () => {
            Entity.Classes.forEach(Class => {
                Class.all()
            })
        },

        clear_db: () => Promise<void> = async () => {
            await Entity.db.delete_db()
        };

}




