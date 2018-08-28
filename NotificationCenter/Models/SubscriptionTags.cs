using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Models
{
    public class SubscriptionTags : ITagPair
    {
        public int SubscriptionId { get; private set; }
        private Subscription Subscription { get; set; }

        public int TagId { get; set; }
        public Tag Tag { get; set; }
        public SubscriptionTags(Tag tag)
        {
            Tag = tag;
        }
        public SubscriptionTags() { }
    }
}
