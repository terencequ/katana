/**
 * Status of asynchronous operation against data.
 */
export enum DataOperationStatus {
  /**
   * Action has not been started.
   */
  NotStarted = 0,

  /**
   * Action has started and is in progress.
   */
  Started = 1,

  /**
   * Action has completed successfully.
   */
  Completed = 2,

  /**
   * Action has failed.
   */
  Failed = 3
}
