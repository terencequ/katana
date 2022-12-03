import { Directive, Input, OnInit, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import DataHandler from "../main/data-handler";
import Data from "../main/models/data";

@Directive()
export default abstract class AbstractDataComponent<TBody, TPersistedId = string> implements OnInit {
    
    /**
     * If this is defined on input, then this will be used when loading persisted data. 
     * If this is undefined on input, then this will be treated as a new data object.
     */
    @Input()
    persistedId?: TPersistedId;

    /**
     * Will do nothing if persistedId is undefined.
     * If this is defined on input, then no persisted data will be requested and this data will be used.
     * If this is undefined on input, then persisted data will be requested.
     */
    @Input()
    existingPersistedData?: TBody;


    /**
     * Emits upon changes to persisted data object.
     */
    @Output()
    data$ = new BehaviorSubject<Data<TBody> | undefined>(undefined);

    /**
     * Emits upon changes to unpersisted data object. This is the data that is currently being edited.
     */
    @Output()
    unpersistedData$ = new BehaviorSubject<Data<TBody> | undefined>(undefined);

    /**
     * Emits upon if data differs from unpersisted data.
     */
    @Output()
    hasUnpersistedData$ = new BehaviorSubject<boolean>(false);


    constructor(private handler: DataHandler<TBody, TPersistedId>) { }

    async ngOnInit(): Promise<void> {
        await this.handler.initAsync(this.persistedId, this.existingPersistedData);
        
        // Subscribe to data changes
        this.handler.data$.subscribe((data) => {
            this.data$.next(data);
        });
        this.handler.unpersistedData$.subscribe((data) => {
            this.unpersistedData$.next(data);
        });
        this.handler.hasUnpersistedData$.subscribe((hasUnpersistedData) => {
            this.hasUnpersistedData$.next(hasUnpersistedData);
        });
    }

}