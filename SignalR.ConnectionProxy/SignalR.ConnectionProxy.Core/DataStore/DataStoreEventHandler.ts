/// <reference path="DataStore.ts" />
/// <reference path="Store.ts" />
/// <reference path="IDataStoreMessage.ts" />

module ConnectionProxy {

    export class DataStoreEventHandler {
        private static InternalEvents: Array<string> = new Array<string>(DataStore.DataStoreIdLocation);

        constructor(store: Store, dataStoreId: number, onEvent: (event: string, data: any) => void) {
            var storageEvent = (event: StorageEvent) => {
                var eventKey: string = store.CleanKey(event.key),
                    messages: Array<IDataStoreMessage> = JSON.parse(event.newValue),
                    message: IDataStoreMessage = messages[messages.length - 1];

                if (this.IsExternalEventKey(eventKey) && dataStoreId !== message.DataStoreID) {
                    onEvent(eventKey, message.Data);
                }
            };

            if (!window.addEventListener) {
                window.attachEvent("onstorage", storageEvent);
            } else {
                window.addEventListener("storage", storageEvent, false);
            }
        }

        private IsExternalEventKey(event: string): boolean {
            var internalEvents = DataStoreEventHandler.InternalEvents;

            for (var i = 0; i < internalEvents.length; i++) {
                if (internalEvents[i] === event) {
                    return false;
                }
            }

            return true;
        }
    }

}