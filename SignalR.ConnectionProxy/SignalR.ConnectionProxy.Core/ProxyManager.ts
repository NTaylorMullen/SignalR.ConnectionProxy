/// <reference path="Scripts/typings/signalr/signalr.d.ts" />
/// <reference path="DataStore/DataStore.ts" />
/// <reference path="DataStore/Store.ts" />
/// <reference path="ProxyPingHandler.ts" />

module ConnectionProxy {

    export class ProxyManager {
        public static ReceiveChannel: string = "Receive";

        private _dataStore: DataStore;
        private _connections: Array<SignalR>;
        private _pingHandler: ProxyPingHandler;
        private _isHost: boolean;
        private _onReady: Array<() => void>;

        constructor() {
            var savedProcessMessages = $.signalR.transports._logic.processMessages;

            this._onReady = new Array<() => {}>();
            this._isHost = undefined;
            this._dataStore = new DataStore();
            this._connections = new Array<SignalR>();
            this._pingHandler = new ProxyPingHandler(this._dataStore);

            this._pingHandler.Ping(() => {
                this._isHost = false;
                this.TriggerOnReady();
            }, () => {
                this._isHost = true;
                this.TriggerOnReady();
            });

            this._dataStore.Subscribe(ProxyManager.ReceiveChannel, (data) => {
                if (!this.IsHost()) {
                    for (var i = 0; i < this._connections.length; i++) {
                        savedProcessMessages.call($.signalR.transports._logic, this._connections[i], data);
                    }
                }
            });

            $.signalR.transports._logic.processMessages = (connection: SignalR, minData: any) => {
                if (this.IsHost() && this.ValidConnection(connection)) {
                    this._dataStore.Publish(ProxyManager.ReceiveChannel, minData);
                }

                savedProcessMessages.apply($.signalR.transports._logic, arguments);
            };
        }

        public RegisterConnection(connection: SignalR): void {
            this._connections.push(connection);
        }

        public UnregisterConnection(connection: SignalR): void {
            for (var i = 0; i < this._connections.length; i++) {
                if (this._connections[i] === connection) {
                    this._connections.splice(i, 1);
                }
            }
        }

        public IsHost(): boolean {
            return this._isHost;
        }

        public OnReady(onReady: () => void): void {
            if (typeof this._isHost === "undefined") {
                this._onReady.push(onReady);
            } else {
                setTimeout(() => {
                    onReady();
                }, 0);
            }
        }

        private TriggerOnReady(): void {
            for (var i = 0; i < this._onReady.length; i++) {
                this._onReady[i]();
            }
        }

        private ValidConnection(connection: SignalR): boolean {
            for (var i = 0; i < this._connections.length; i++) {
                if (this._connections[i] === connection) {
                    return true;
                }
            }

            return false;
        }
    }

    export var SharedProxy = new ProxyManager();
}