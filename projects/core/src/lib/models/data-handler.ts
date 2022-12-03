import {DataStatus} from "./enums/data-status";
import {BehaviorSubject} from "rxjs";
import {DataOperationStatus} from "./enums/data-operation-status";
import Data from "./data";

/**
 * Manages a unit of data (i.e. an entity, or a document),
 * and allows keeping track of all stages of asynchronous CRUD when interacting with aforementioned data.
 */
export default class DataHandler<TBody, TId = string> {
  // FIELDS
  /**
   * The id of the data.
   */
  get id(): TId | undefined {
    return this.current$.value.id;
  }

  /**
   * Most recent snapshot of the data. Reflects either the initial state of the data, or the most recently committed version of the data.
   * This will also be what the data will become if the data is reset.
   */
  _snapshot: Data<TBody, TId>;

  // OBSERVABLES
  /**
   * The status of any asynchronous action against the data.
   */
  public operationStatus$: BehaviorSubject<DataOperationStatus>;

  /**
   * The main, current state of the data.
   */
  public current$: BehaviorSubject<Data<TBody, TId>>;

  // CONSTRUCTORS
  /**
   * Constructor for creating a new DataHandler.
   * @param data The data, and its initial status.
   */
  constructor(data: Data<TBody, TId> = { id: undefined, body: undefined, status: DataStatus.New }) {
    this._snapshot = data;
    this.current$ = new BehaviorSubject<Data<TBody, TId>>(this.getSnapshotClone());
    this.operationStatus$ = new BehaviorSubject<DataOperationStatus>(DataOperationStatus.NotStarted);
  }

  // METHODS
  /**
   * Resets the current data with the saved data (i.e. the most recent committed/initial snapshot of the data).
   */
  public copySnapshotToCurrent(): void {
    // Deep copies the saved data into the current data.
    this.current$.next(this.getSnapshotClone());
  }

  /**
   * Asynchronously load new data into this data handler. Will override the snapshot.
   * @param loadDataAsync The asynchronous function that will load the data.
   */
  public async performActionAsync(loadDataAsync: () => Promise<Data<TBody, TId>>): Promise<void> {
    this.operationStatus$.next(DataOperationStatus.Started);
    try {
      this._snapshot = await loadDataAsync();
      this.copySnapshotToCurrent();
    } catch (error) {
      this.operationStatus$.next(DataOperationStatus.Failed);
    }
    this.operationStatus$.next(DataOperationStatus.Completed);
  }

  // HELPER METHODS
  /**
   * Get a deep copy of the snapshot.
   * @private
   */
  private getSnapshotClone(): Data<TBody, TId> {
    return structuredClone(this._snapshot);
  }
}
