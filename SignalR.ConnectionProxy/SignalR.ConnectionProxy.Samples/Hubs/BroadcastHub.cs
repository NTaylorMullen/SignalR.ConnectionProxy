using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SignalR.ConnectionProxy.Samples.Hubs
{
    public class BroadcastHub : Hub
    {
        public void Broadcast(string message)
        {
            Clients.All.broadcast(message);
        }
    }
}