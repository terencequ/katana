import {Component, Directive, OnInit} from '@angular/core';
import Data from "../../models/data";

@Directive()
export class AbstractDataManagerComponent<TBody, TId = string> implements OnInit {

  /**
   * Cache of all data changed and added when this component was active.
   */
  changedData: Data<TBody, TId>[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
