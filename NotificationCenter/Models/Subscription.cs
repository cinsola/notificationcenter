using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NotificationCenter.Models
{
    public class Subscription : BaseModel, ITaggableData<SubscriptionTags>
    {
        public int Id { get; set; }
        [JsonProperty("endpoint")]
        public string EndPoint { get; set; }
        public string Auth { get; set; }
        public string Code { get; set; }
        [JsonProperty("expirationTime")]
        public DateTime? ExpirationTime { get; set; }
        public string Device { get; set; }
        public string Platform { get; set; }
        public string PlatformVersion { get; set; }
        public string Browser { get; set; }
        public string BrowserVersion { get; set; }
        public ICollection<SubscriptionTags> Tags { get; } = new List<SubscriptionTags>();
        public string Description { get; set; }
        public bool IsDisabled { get; set; }
        public Subscription()
        {
            this.SetupAt = DateTime.UtcNow;
        }

        internal void Update(SubscriptionDTO model)
        {
            this.Description = model.Description;
            this.LastUpdate = DateTime.UtcNow;
        }
    }

    public class SubscriptionDTO : BaseModel, ITaggableDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("endpoint")]
        public string EndPoint { get; set; }
        [JsonProperty("keys")]
        public IDictionary<string, string> Keys { get; set; }
        [JsonProperty("expirationTime")]
        public DateTime? ExpirationTime { get; set; }
        [JsonProperty("tagsCount")]
        public int TagsCount { get; set; }
        [JsonProperty("device")]
        public string Device { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("platform")]
        public string Platform { get; set; }
        [JsonProperty("platformVersion")]
        public string PlatformVersion { get; set; }
        [JsonProperty("browser")]
        public string Browser { get; set; }
        [JsonProperty("browserVersion")]
        public string BrowserVersion { get; set; }
        [JsonProperty("groupsId")]
        public IEnumerable<NotificationDTO.GroupDTODescriptor> Groups { get; set; }

        public static explicit operator SubscriptionDTO(Subscription subscription)
        {
            var tags = subscription.Tags.Where(x => x.Tag.IsDeleted == false);
            var dto = new SubscriptionDTO
            {
                Id = subscription.Id,
                EndPoint = subscription.EndPoint,
                ExpirationTime = subscription.ExpirationTime,
                Device = subscription.Device,
                Browser = subscription.Browser,
                BrowserVersion = subscription.BrowserVersion,
                Platform = subscription.Platform,
                PlatformVersion = subscription.PlatformVersion,
                IsDeleted = subscription.IsDeleted,
                Keys = null,
                Description = subscription.Description,
                LastUpdate = subscription.LastUpdate,
                SetupAt = subscription.SetupAt,
                TagsCount = tags.Count(),
                Groups = tags.Select(x => new NotificationDTO.GroupDTODescriptor { Key = x.TagId.ToString(), Value = x.Tag.TagName }),
            };
            return dto;
        }
    }
}
