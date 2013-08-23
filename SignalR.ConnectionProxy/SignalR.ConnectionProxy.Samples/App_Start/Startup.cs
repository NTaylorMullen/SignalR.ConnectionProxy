using Owin;

namespace SignalR.ConnectionProxy.Samples
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapHubs();
        }
    }
}