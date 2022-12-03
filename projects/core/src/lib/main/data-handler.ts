import { BehaviorSubject } from "rxjs";
import Data from "./models/data";
import DataAction from "./models/data-action";
import DataActionError from "./models/data-action-error";
import { DataActionType } from "./models/enums/data-action-type";
import * as _ from "lodash";

/**
 * Main class to handle one data object
 */
export default class DataHandler<TBody, TPersistedId = string> {

    // Id of the data object in the persistence data source. i.e. an API.
    protected persistedId?: TPersistedId;

    // Data
    public data$ = new BehaviorSubject<Data<TBody> | undefined>(undefined);
    public unpersistedData$ = new BehaviorSubject<Data<TBody> | undefined>(undefined);
    public hasUnpersistedData$ = new BehaviorSubject<boolean>(false);

    // Audit
    protected dataActions: DataAction<any>[];
    public mostRecentDataAction$ = new BehaviorSubject<DataAction<any> | undefined>(undefined);


    constructor(protected service: IDataSourceService<TBody, TPersistedId>) {
        this.data$.next(undefined);
        this.dataActions = [];
        this.mostRecentDataAction$.next(undefined);
    }

    /**
     * Get the most recent data action of a specific type.
     * @param persistedId Persisted id of the data object.
     * @param data Treated as a data override. If this is provided, no load attempt will be made and this data will be used.
     */
    public async initAsync(persistedId?: TPersistedId, data?: TBody): Promise<void>{
        if(!!persistedId){
            this.persistedId = persistedId;
            if(!data){
                await this.loadAsync();
            }
        }
        if(!!data){
            this.replacePersistedData(data);
        }
    }

    /**
     * Make unpersisted changes to the data.
     * @param newData An object representing new data.
     */
    public async replaceUnpersistedData(newData: TBody) {
        let data = new Data<TBody>();
        data.setBody(newData);
        this.unpersistedData$.next(data);

        // Check if unpersisted data differs from data
        var different = !_.isEqual(this.unpersistedData$.value, this.data$.value);
        this.hasUnpersistedData$.next(different);
    }

    /**
     * Performs action to load data. Will replace uncommitted data.
     * @param newData An object representing new data.
     */
    public async replacePersistedData(newData: TBody) {
        let data = new Data<TBody>();
        data.setBody(newData);
        this.data$.next(data);
        this.unpersistedData$.next(structuredClone(data));
        this.hasUnpersistedData$.next(false);
    }

    /**
     * Performs action to load data from the configured data source. i.e. an API.
     */
    public async loadAsync(): Promise<void> {
        const dataAction = new DataAction<TBody>(DataActionType.Read);
        this.pushDataAction(dataAction);
        try {
            // id null check
            if(!this.persistedId){
                throw new Error("Cannot load persisted data, no ID is present. Have you tried initializing the data handler first?");   
            }

            const body = await this.service.getByIdAsync(this.persistedId);
            this.replacePersistedData(body);
            dataAction.success(body);
        } catch (err) {
            dataAction.fail(err as DataActionError);
        }
    }

    /**
     * Performs action to save unpersisted data to the configured data source. i.e. an API.
     * @param shouldReload Refresh the data from the data source after saving.
     */
    public async persistAsync(shouldReload?: boolean): Promise<void> {
        const dataAction = new DataAction<TPersistedId>(DataActionType.Update);
        this.pushDataAction(dataAction);
        try {
            // body null check
            const body = this.unpersistedData$.value?.getBody();
            if(!body){
                throw new Error("Cannot persist data, there is no data available to persist. Check that the data has been loaded properly.");   
            }

            if(this.persistedId){
                this.persistedId = await this.service.updateByIdAsync(this.persistedId, body);
            } else {
                this.persistedId = await this.service.createAsync(body);
            }
            dataAction.success(this.persistedId);

        } catch (err) {
            dataAction.fail(err as DataActionError);
        }

        if(!!shouldReload){
            await this.loadAsync();
        }
    }

    /**
     * Performs action to mark this data as deleted to the configured data source. i.e. an API.
     */
    public async deleteAsync(): Promise<void> {
        const dataAction = new DataAction<TPersistedId>(DataActionType.Delete);
        this.pushDataAction(dataAction);
        try {
            // id null check
            if(!this.persistedId){
                throw new Error("Cannot delete persisted data, no ID is present. Have you tried persisting the data first, or initializing the data handler first?");   
            }

            await this.service.deleteByIdAsync(this.persistedId);
            dataAction.success();
        } catch (err) {
            dataAction.fail(err as DataActionError);
        }
    }

    /**
     * Revert data to the state of the most recently persisted data.
     */
    public revert(): void {
        this.unpersistedData$.next(structuredClone(this.data$.value));
        this.hasUnpersistedData$.next(false);
    }

    /**
     * Update audit variables with a new action.
     */
    protected pushDataAction(dataAction: DataAction<any>) {
        this.dataActions.push(dataAction);
        this.mostRecentDataAction$.next(dataAction);
    }

}