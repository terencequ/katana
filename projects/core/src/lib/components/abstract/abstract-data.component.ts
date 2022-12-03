import {Directive, OnInit, Output} from '@angular/core';
import DataHandler from "../../models/data-handler";
import {BehaviorSubject} from "rxjs";
import Data from "../../models/data";
import {DataOperationStatus} from "../../models/enums/data-operation-status";
import {DataStatus} from "../../models/enums/data-status";

/**
 * Base class for a component that handles and manages the persistence of one unit of data.
 */
@Directive()
export abstract class AbstractDataComponent<TBody, TId = string> implements OnInit {

  // Data handler
  public dataHandler: DataHandler<TBody, TId> = new DataHandler<TBody, TId>();

  // Fields for UI
  public current: Data<TBody, TId> = this.dataHandler.current$.value;
  public operationStatus: DataOperationStatus = this.dataHandler.operationStatus$.value;

  // Enums for UI
  public DataOperationStatus = DataOperationStatus;

  // Observables
  @Output()
  public current$: BehaviorSubject<Data<TBody, TId>> = this.dataHandler.current$;
  @Output()
  public operationStatus$: BehaviorSubject<DataOperationStatus> = this.dataHandler.operationStatus$;

  /**
   * Component initialization.
   */
  async ngOnInit() {
    // Subscribe whenever current data changes
    this.dataHandler.current$.subscribe((data: Data<TBody, TId>) => {
      this.current = data;
    });
    // Subscribe to whenever operation status changes
    this.dataHandler.operationStatus$.subscribe((status: DataOperationStatus) => {
      this.operationStatus = status;
    });
  }

  /**
   * Check if data exists.
   */
  get isDataLoaded(): boolean {
    return !!this.current.body;
  }

  /**
   * Check if any asynchronous operation is in progress.
   */
  get isOperationInProgress(): boolean {
    return this.operationStatus === DataOperationStatus.Started;
  }

  /**
   * Get the data's status as a string.
   */
  get dataStatusName(): string {
    switch (this.current.status) {
      case DataStatus.New:
        return "New";
      case DataStatus.Committed:
        return "Committed";
      case DataStatus.Deleted:
        return "Deleted";
    }
  }

  /**
   * Check if the data, and this component's state is valid, or needs attention. (i.e. maybe the form is left in an invalid state.)
   */
  abstract get isValid(): boolean;
}
