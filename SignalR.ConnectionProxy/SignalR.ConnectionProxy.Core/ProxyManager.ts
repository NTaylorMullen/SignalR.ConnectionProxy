/// <reference path="Scripts/typings/signalr/signalr.d.ts" />
/// <reference path="DataStore/DataStore.ts" />
/// <reference path="DataStore/Store.ts" />
/// <reference path="ProxyPingHandler.ts" />
/// <reference path="ProxyCommunicator.ts" />

module ConnectionProxy {

    export class ProxyManager {

        private _dataStore: DataStore;
        private _connections: Array<SignalR>;
        private _pingHandler: ProxyPingHandler;
        private _communicator: ProxyCommunicator;
        private _isHost: boolean;
        private _onReady: Array<() => void>;

        constructor() {
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

            this._communicator = new ProxyCommunicator(this._dataStore, (data) => {
                if (!this.IsHost()) {
                    for (var i = 0; i < this._connections.length; i++) {
                        $(this._connections[i]).triggerHandler($.signalR.events.onReceived, [data]);
                    }
                }
            },
                (data) => {
                    if (this.IsHost()) {
                        // TODO only send from correct connection
                        for (var i = 0; i < this._connections.length; i++) {
                            this._connections[i].send(data);
                        }
                    }
                });
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

        public Send(data: any): void {
            this._communicator.Send(data);
        }

        public Broadcast(data: any): void {
            this._communicator.Broadcast(data);
        }

        public ValidConnection(connection: SignalR): boolean {
            for (var i = 0; i < this._connections.length; i++) {
                if (this._connections[i] === connection) {
                    return true;
                }
            }

            return false;
        }

        private TriggerOnReady(): void {
            for (var i = 0; i < this._onReady.length; i++) {
                this._onReady[i]();
            }
        }
    }

    export var SharedProxy = new ProxyManager();
}