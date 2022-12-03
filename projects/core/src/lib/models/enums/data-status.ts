/**
 * Status of data. Can drive the UI to show three different themed views: New (Create), Committed (Edit), and Deleted (Restore Deleted).
 */
export enum DataStatus {
  /**
   * Data that has never been committed before.
   */
  New = 0,

  /**
   * Data that has been committed.
   */
  Committed = 1,

  /**
   * Data that has been deleted.
   */
  Deleted = 2,
}
