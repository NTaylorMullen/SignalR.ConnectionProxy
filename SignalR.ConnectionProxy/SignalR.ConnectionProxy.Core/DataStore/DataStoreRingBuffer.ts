/// <reference path="Store.ts" />
/// <reference path="IDataStoreMessage.ts" />

module ConnectionProxy {

    export class DataStoreRingBuffer {
        public static MaxSize: number = 100;

        private _index: number;

        constructor(private _key: string, private _store: Store) {           
            this.UpdateIndex();
        }

        public Push(value: IDataStoreMessage): void {
            var buffer = this.GetBuffer() || [];

            // Ensure our index is pointing at the next open slot
            this.UpdateIndex();

            buffer[this._index] = value;

            this._store.Set(this._key, buffer);
        }

        public Peak(): IDataStoreMessage {
            this.UpdateIndex();

            return this.GetBuffer()[this._index - 1];
        }

        public Read(index: number): IDataStoreMessage {
            return this.GetBuffer()[index];
        }

        private UpdateIndex(): void {
            this._index = this.GetBuffer().length % DataStoreRingBuffer.MaxSize;
        }

        private GetBuffer(): Array<IDataStoreMessage> {
            return this._store.Get(this._key);
        }
    }

}