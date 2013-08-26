/// <reference path="DataStore/DataStore.ts" />

module ConnectionProxy {

    export class ProxyCommunicator {
        public static ReceiveChannel: string = "Receive";
        public static SendChannel: string = "Send";

        constructor(private _dataStore: DataStore, onReceive: (data) => void, onSend: (data) => void) {
            this._dataStore.Subscribe(ProxyCommunicator.ReceiveChannel, (data) => {
                onReceive(data);
            });
            this._dataStore.Subscribe(ProxyCommunicator.SendChannel, (data) => {
                onSend(data);
            });
        }

        public Broadcast(data: any): void {
            this._dataStore.Publish(ProxyCommunicator.ReceiveChannel, data);
        }

        public Send(data: any): void {
            this._dataStore.Publish(ProxyCommunicator.SendChannel, data);
        }
    }

}