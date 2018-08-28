using Microsoft.Extensions.Options;
using NotificationCenter.Models;
using WebPush;
namespace NotificationCenter.Services
{
    public interface IPushNotificationService
    {
        void SendNotification(Subscription subscription, Notification payload);
    }

    internal class WebPushPushNotificationService : IPushNotificationService
    {
        private readonly VapidSettings _options;
        private readonly WebPushClient _pushClient;

        public string PublicKey { get { return _options.PublicKey; } }

        public WebPushPushNotificationService(IOptions<VapidSettings> optionsAccessor)
        {
            _options = optionsAccessor.Value;

            _pushClient = new WebPushClient();
            _pushClient.SetVapidDetails(_options.Subject, _options.PublicKey, _options.PrivateKey);
        }

        public void SendNotification(Subscription subscription, Notification payload)
        {
            var webPushSubscription = new WebPush.PushSubscription(
                subscription.EndPoint,
                subscription.Code,
                subscription.Auth);

            _pushClient.SendNotification(webPushSubscription, Newtonsoft.Json.JsonConvert.SerializeObject((WebPushAdapter) payload));
        }
    }
}
