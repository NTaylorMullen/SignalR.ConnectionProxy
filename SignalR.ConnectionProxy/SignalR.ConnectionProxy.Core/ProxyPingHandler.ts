/// <reference path="DataStore/DataStore.ts" />

module ConnectionProxy {

    export class ProxyPingHandler {
        private static PingChannel: string = "PING";
        private static PongChannel: string = "PONG";
        private static FailAfter: number = 2000;

        private _onSuccess: () => void;

        constructor(private _dataStore: DataStore) {
            this._dataStore.Subscribe(ProxyPingHandler.PingChannel, (data) => {
                this._dataStore.Publish(ProxyPingHandler.PongChannel, data);
            });

            this._dataStore.Subscribe(ProxyPingHandler.PongChannel, (data) => {
                this._onSuccess();
            });
        }

        public Ping(onSuccess: () => void, onFail: () => void): void {
            var onFailHandle;

            this._onSuccess = () => {
                this._onSuccess = () => { };
                clearTimeout(onFailHandle);
                onSuccess();
            };

            this._dataStore.Publish(ProxyPingHandler.PingChannel, { from: this._dataStore.ID });

            // Fail the ping after 2 seconds with no response
            onFailHandle = setTimeout(() => {
                this._onSuccess = () => { };
                onFail();
            }, ProxyPingHandler.FailAfter)
        }
    }

}