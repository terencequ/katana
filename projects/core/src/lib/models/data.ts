import {DataStatus} from "./enums/data-status";

/**
 * Structure of uniquely identifiable data.
 */
export default interface Data<TBody, TId = string> {
  id?: TId;
  body?: TBody;
  status: DataStatus;
}
