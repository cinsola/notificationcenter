using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Models
{
    public class NotificationTags : ITagPair
    {
        public int TagId { get; private set; }
        public Tag Tag { get; set; }

        public int NotificationId { get; set; }
        private Notification Notification { get; set; }
        public NotificationTags(Tag tag)
        {
            this.Tag = tag;
        }

        public NotificationTags() { }
    }
}
