/// <reference path="DataStoreRingBuffer.ts" />
/// <reference path="Store.ts" />

module ConnectionProxy {

    export class DataStoreSubscription {
        private _ringBuffer: DataStoreRingBuffer;
        private _subscribers: Array<(data: any) => void>;

        constructor(key: string, store: Store, private _dataStoreId: number) {
            this._ringBuffer = new DataStoreRingBuffer(key, store);
            this._subscribers = new Array<(data: any) => void>();
        }

        public Subscribe(callback: (data: any) => void): void {
            this._subscribers.push(callback);
        }

        public Publish(data: any): void {
            for (var i = 0; i < this._subscribers.length; i++) {
                this._subscribers[i](data);
            }
        }

        public Dispatch(data: any): void {
            this._ringBuffer.Push({
                DataStoreID: this._dataStoreId,
                Data: data
            });
        }
    }

}