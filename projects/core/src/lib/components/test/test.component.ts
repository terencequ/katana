import {Component} from '@angular/core';
import {createEmptyTestData, TestData} from "./data/test-data";
import {AbstractDataComponent} from "../abstract/abstract-data.component";
import {DataStatus} from "../../models/enums/data-status";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent extends AbstractDataComponent<TestData> {

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    await this.dataHandler.performActionAsync(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return createEmptyTestData();
    });
  }

  incrementTestNumber() {
    this.dataHandler.current$.next({
      ...this.dataHandler.current$.value,
      body: {
        number: (this.current.body?.number ?? 0) + 1
      }
    })
  }

  async saveNumber(){
    await this.dataHandler.performActionAsync(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        ...this.dataHandler.current$.value,
        status: DataStatus.Committed,
      };
    });
  }

  get isValid(): boolean {
    return true;
  }
}
