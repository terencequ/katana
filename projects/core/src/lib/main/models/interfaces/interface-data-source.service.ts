/**
 * Interface for a service that can be used to perform CRUD operations on data.
 */
export default interface IDataSourceService<TBody, TPersistedId = string> {

    createAsync(newData: TBody): Promise<TPersistedId>;

    getByIdAsync(id: TPersistedId): Promise<TBody>;

    updateByIdAsync(id: TPersistedId, newData: TBody): Promise<TPersistedId>;

    deleteByIdAsync(id: TPersistedId): Promise<void>;

}