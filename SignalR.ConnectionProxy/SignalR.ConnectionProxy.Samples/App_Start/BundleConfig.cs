using System.Web;
using System.Web.Optimization;

namespace SignalR.ConnectionProxy.Samples
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/signalr")
                .Include("~/Scripts/jquery-{version}.js")
                .Include("~/Scripts/jquery.signalR-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/mainjs")
                        .Include("~/Scripts/signalR.connectionProxy.js"));

            bundles.Add(new StyleBundle("~/bundles/maincss")
                        .Include("~/Styles/common.css")
                        .Include("~/Bootstrap/bootstrap.css"));
        }
    }
}