import { Directive, Input, OnInit } from "@angular/core";
import DataHandler from "../data-handler";
import Data from "../models/data";
import { DataEditorMode } from "./enums/data-editor-mode";
import { DataEditorWriteMode } from "./enums/data-editor-write-mode";

@Directive()
export default class AbstractDataEditorComponent<TBody, TId = string> implements OnInit {

    @Input()
    initialMode?: DataEditorMode;

    @Input()
    initialBody?: TBody;

    @Input()
    initialPersistenceId?: TId;
    
    mode: DataEditorMode;
    writeMode?: DataEditorWriteMode;

    constructor(private dataHandler: DataHandler<TBody, TId>) { 
        this.mode = this.initialMode ?? DataEditorMode.Read;
    }

    async ngOnInit(): Promise<void> {
        await this.dataHandler.initAsync(this.initialPersistenceId, this.initialBody);
    }

}