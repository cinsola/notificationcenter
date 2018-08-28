using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace NotificationCenter.Models
{
    public class Tag : BaseModel
    {
        public int Id { get; private set; }
        [JsonProperty("groupName")]
        [MaxLength(50, ErrorMessage = "Lunghezza massima: 50 caratteri")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Inserisci un nome per il gruppo")]
        public string TagName { get; private set; }
        public ICollection<SubscriptionTags> Subscriptions { get; } = new List<SubscriptionTags>();
        public ICollection<NotificationTags> Notifications { get; } = new List<NotificationTags>();
        public Tag(string name)
        {
            this.TagName = name;
            this.SetupAt = DateTime.UtcNow;
        }

        public Tag() { }

        internal void Delete()
        {
            this.IsDeleted = true;
            this.LastUpdate = DateTime.UtcNow;
        }
    }

    public class TagDto : BaseModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("groupName")]
        public string TagName { get; set; }
        [JsonProperty("deviceCount")]
        public int DeviceCount { get; set; }
        [JsonProperty("notificationCount")]
        public int NotificationCount { get; set; }

        public static explicit operator TagDto(Tag tag)
        {
            return new TagDto
            {
                Id = tag.Id,
                TagName = tag.TagName,
                DeviceCount = tag.Subscriptions.Count,
                NotificationCount = tag.Notifications.Count,
                SetupAt = tag.SetupAt,
                LastUpdate = tag.LastUpdate
            };
        }
    }
}