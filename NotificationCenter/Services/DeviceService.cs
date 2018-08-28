using Microsoft.EntityFrameworkCore;
using NotificationCenter.Data;
using NotificationCenter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Services
{
    public interface IDeviceService
    {
        Subscription GetTaggedSubscription(int id);
        IEnumerable<SubscriptionDTO> Get();
    }
    public class DeviceService : IDeviceService
    {
        private readonly ApplicationDbContext _context;
        public DeviceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<SubscriptionDTO> Get()
        {
            return _context.Subscriptions.Include("Tags.Tag").Where(x => x.IsDeleted == false).ToList().Select(x => (SubscriptionDTO)x);
        }

        public Subscription GetTaggedSubscription(int id)
        {
            return _context.Subscriptions.Include("Tags.Tag").First(x => x.Id == id);
        }
    }
}
