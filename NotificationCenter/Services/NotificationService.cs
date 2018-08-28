using Microsoft.EntityFrameworkCore;
using NotificationCenter.Data;
using NotificationCenter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Services
{
    public interface INotificationService
    {
        Notification GetTaggedNotification(int id);
        IEnumerable<NotificationDTO> GetNotifications();
        void AddNotification(Notification notification);
        IEnumerable<Subscription> GedBroadcastDevices(Notification notification);
    }
    public class NotificationService : INotificationService
    {
        readonly ApplicationDbContext _context;
        public NotificationService(ApplicationDbContext dbContext)
        {
            this._context = dbContext;
        }

        public Notification GetTaggedNotification(int id)
        {
            return _context.Notifications.Include("Tags.Tag").First(x => x.Id == id && x.IsDeleted == false);
        }

        public IEnumerable<NotificationDTO> GetNotifications()
        {
            return _context.Notifications.Include("Tags.Tag").Where(x => x.IsDeleted == false).ToList().Select(x => (NotificationDTO)x);
        }

        public void AddNotification(Notification notification)
        {
            _context.Notifications.Add(notification);
        }

        public IEnumerable<Subscription> GedBroadcastDevices(Notification notification)
        {
            var notificationBroadcastLists = notification.Tags.Where(x => x.Tag.IsDeleted == false).Select(z => z.TagId);
            if(notificationBroadcastLists != null)
            {
                return _context.Subscriptions.Where(s => s.Tags.Where(x => x.Tag.IsDeleted == false).Select(t => t.TagId).Any(tagId => notificationBroadcastLists.Contains(tagId)));
            }
            return new List<Subscription>();
        }
    }
}
