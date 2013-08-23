/// <reference path="Store.ts" />
/// <reference path="IDataStoreMessage.ts" />

module ConnectionProxy {

    export class DataStoreRingBuffer {
        public static MaxSize: number = 100;

        constructor(private _key: string, private _store: Store) {}

        public Push(value: IDataStoreMessage): void {
            var buffer = this.GetBuffer() || [];

            buffer.push(value);

            // If we're pushing the MaxSize + 1th item we need to remove one from the front of the buffer
            if (buffer.length > DataStoreRingBuffer.MaxSize) {
                buffer.shift();
            }

            this._store.Set(this._key, buffer);
        }

        public Peak(): IDataStoreMessage {
            var buffer = this.GetBuffer();

            return buffer[buffer.length - 1];
        }

        public Read(index: number): IDataStoreMessage {
            return this.GetBuffer()[index];
        }

        private GetBuffer(): Array<IDataStoreMessage> {
            return this._store.Get(this._key);
        }
    }

}