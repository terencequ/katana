import Data from "../../../models/data";
import {DataStatus} from "../../../models/enums/data-status";

export interface TestData {
  number: number;
}

export function createEmptyTestData() : Data<TestData>{
  return {
    id: "",
    body: {
      number: 0,
    },
    status: DataStatus.New
  }
}
