import DataActionError from "./data-action-error";
import { DataActionStatus } from "./enums/data-action-status";
import { DataActionType } from "./enums/data-action-type";

/**
 * Stores information about an asynchronous action performed on data.
 */
export default class DataAction<TResult> {

    private action: DataActionType;
    private dateStarted: Date;
    private dateEnded?: Date;

    private result?: TResult;
    private error?: DataActionError;

    constructor(action: DataActionType) {
        this.action = action;
        this.dateStarted = new Date(); // Now
    }

    /**
     * Callback method when the action has succeeded.
     * @param result The result of the action.
     */
    public success(result?: TResult) {
        this.dateEnded = new Date(); // Now
        this.result = result;
    }

    /**
     * Callback method when the action has failed.
     * @param error The error that occurred.
     */
    public fail(error: DataActionError) {
        this.dateEnded = new Date(); // Now
        this.error = error;
    }

    /**
     * Get this action's status as an enum.
     * - Success: This action has an end date, and no error. 
     * - Pending: This action has no end date. 
     * - Error: This action has an end date, and an error. 
     * @returns Whether the action is pending, errored or has succeeded. 
     */
    public getStatus(): DataActionStatus {
        if (this.dateEnded) {
            if (this.error) {
                return DataActionStatus.Error;
            } else {
                return DataActionStatus.Success;
            }
        } else {
            return DataActionStatus.Pending;
        }
    }
}