/**
 * Information on an error from a data action.
 */
export default class DataActionError {

    private title: string;
    private message: string;
    private details?: string;
    private stackTrace?: string;

    constructor(title: string, message: string, details?: string, stackTrace?: string) {
        this.title = title;
        this.message = message;
        this.details = details;
        this.stackTrace = stackTrace;
    }
}