/// <reference path="Store.ts" />
/// <reference path="DataStoreSubscription.ts" />

module ConnectionProxy {

    export class DataStore {
        public static DataStoreIdLocation: string = "dataStoreIds";

        private _store: Store;
        private _id: number;
        private _eventHandler: DataStoreEventHandler;
        private _subscriptions: { [event: string]: DataStoreSubscription };

        constructor() {
            this._store = new Store();

            this.RegisterId();

            this._eventHandler = new DataStoreEventHandler(this._store, this._id, (event: string, data: any) => {
                this.ProcessEvent(event, data);
            });

            this._subscriptions = {};
        }

        public Subscribe(event: string, callback: (data: any) => void): void {
            if (!(this._subscriptions[event] instanceof DataStoreSubscription)) {
                this._subscriptions[event] = new DataStoreSubscription(event, this._store, this._id);
            }

            this._subscriptions[event].Subscribe(callback);
        }

        public Publish(event: string, data: any): void {
            // We dispatch the data to other browsers
            this._subscriptions[event].Dispatch(data);
        }

        private ProcessEvent(event: string, data: any): void {
            // If we have an event for the subscriptions then we need to trigger it
            if (this._subscriptions[event] instanceof DataStoreSubscription) {
                this._subscriptions[event].Publish(data);
            }
        }

        // This assumes that pages aren't racing to set data store ID's (very very unlikely)
        private RegisterId(): void {
            var location = DataStore.DataStoreIdLocation;

            if (this._store.Get(location) === null) {
                this._id = 0;
            } else {
                this._id = parseInt(this._store.Get(location));
            }

            this._store.Set(location, this._id + 1);
        }
    }
}