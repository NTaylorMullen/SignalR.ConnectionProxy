/// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../../Scripts/signalR.connectionProxy.d.ts" />
var dataStore = new ConnectionProxy.DataStore();

dataStore.Subscribe("foo", function (value) {
    $("body").append("<p>Foo fired with value: " + value + "</p>");
});

setTimeout(function () {
    dataStore.Publish("foo", "Uno");
}, 1000);
//# sourceMappingURL=Main.js.map
