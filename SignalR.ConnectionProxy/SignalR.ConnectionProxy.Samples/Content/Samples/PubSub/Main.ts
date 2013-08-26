/// <reference path="../../../Scripts/typings/signalr/signalr.d.ts" />
/// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../../Scripts/signalR.connectionProxy.d.ts" />

var broadcastHub = (<any>$.connection).broadcastHub,
    messageHolder: JQuery = $("#messages"),
    broadcastButton: JQuery = $("#broadcast"),
    broadcastText: JQuery = $("#broadcastText");

broadcastHub.client.broadcast = function (msg) {
    messageHolder.append("<p>Broadcasted: " + msg + "</p>");
};

$.connection.hub.start({ persistConnection: true }).done(function () {
    broadcastButton.click(function () {
        broadcastHub.server.broadcast(broadcastText.val());
    });

    messageHolder.append("<p>Started</p>");
});