/// <reference path="../Scripts/typings/signalr/signalr.d.ts" />
/// <reference path="../ProxyManager.ts" />

module ConnectionProxy {
    var savedConnectionInit = (<any>$.connection).fn.init;

    (<any>$.connection).fn.init = function () {
        var savedStart = this.start,
            savedStop = this.stop,
            savedSend = this.send,
            connection = this;

        this.start = function (options, callback) {
            var persistConnection = false,
                deferred: JQueryDeferred<any> = $.Deferred();

            if ($.type(options) === "object") {
                persistConnection = !!options.persistConnection;
            }

            if (persistConnection) {
                SharedProxy.RegisterConnection(this);
            }

            SharedProxy.OnReady(() => {
                if (!SharedProxy.IsHost()) {
                    $.signalR.changeState(connection, $.signalR.connectionState.disconnected, $.signalR.connectionState.connecting);
                    $(connection).triggerHandler($.signalR.events.onStarting);
                    $.signalR.changeState(connection, $.signalR.connectionState.connecting, $.signalR.connectionState.connected);
                    deferred.resolve();
                } else {
                    savedStart.apply(this, arguments).done(deferred.resolve).fail(deferred.reject);
                }
            });            

            return deferred.promise();
        };

        this.stop = function () {
            SharedProxy.UnregisterConnection(this);

            savedStop.apply(this, arguments);
        };

        this.send = function (data) {
            if (SharedProxy.IsHost()) {
                savedSend.call(this, data);
            } else {
                SharedProxy.Send(data);
            }

            return this;
        };

        this.received((data) => {
            if (SharedProxy.IsHost() && SharedProxy.ValidConnection(connection)) {
                SharedProxy.Broadcast(data);
            }
        });

        savedConnectionInit.apply(this, arguments);
    };
}