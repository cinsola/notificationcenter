using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Models
{
    public class Notification : BaseModel, ITaggableData<NotificationTags>
    {
        public int Id { get; internal set; }
        public ICollection<NotificationTags> Tags { get; } = new List<NotificationTags>();
        [Required(ErrorMessage = "Campo obbligatorio")]
        [MaxLength(50, ErrorMessage = "Il nome della notifica deve essere di massimo 50 caratteri")]
        public string NotificationName { get; internal set; }


        [Required(ErrorMessage = "Campo obbligatorio")]
        [MaxLength(50, ErrorMessage = "Il titolo della notifica deve essere di massimo 50 caratteri")]
        public string NotificationTitle { get; internal set; }
        public string NotificationLink { get; internal set; }
        public string NotificationLinkTitle { get; internal set; }
        public string NotificationLinkIcon { get; internal set; }
        public string NotificationImage { get; internal set; }
        public string NotificationIcon { get; internal set; }
        [Required(ErrorMessage = "Campo obbligatorio")]
        [MaxLength(180, ErrorMessage = "Il testo della notifica deve essere di massimo 180 caratteri")]
        public string NotificationText { get; internal set; }
        public Notification()
        {
            this.SetupAt = DateTime.UtcNow;
        }
        public void UpdateWith(NotificationDTO notification)
        {
            this.LastUpdate = DateTime.UtcNow;
            this.NotificationIcon = notification.NotificationIcon;
            this.NotificationImage = notification.NotificationImage;
            this.NotificationLink = notification.NotificationLink;
            this.NotificationLinkIcon = notification.NotificationLinkIcon;
            this.NotificationLinkTitle = notification.NotificationLinkTitle;
            this.NotificationName = notification.NotificationName;
            this.NotificationText = notification.NotificationText;
            this.NotificationTitle = notification.NotificationTitle;
        }

        internal void Delete()
        {
            this.IsDeleted = true;
        }
    }

    public class WebPushAdapter {
        public class WebPushOptions
        {
            public WebPushOptions(string action, string title, string icon)
            {
                Action = action;
                Title = title;
                Icon = icon;
            }

            [JsonProperty("action")]
            public string Action { get; set; }
            [JsonProperty("title")]
            public string Title { get; set; }
            [JsonProperty("icon")]
            public string Icon { get; set; }
        }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("body")]
        public string Body { get; set; }
        [JsonProperty("image")]
        public string Image { get; set; }
        [JsonProperty("icon")]
        public string Icon { get; set; }
        [JsonProperty("actions")]
        public List<WebPushOptions> Actions { get; set; }
        public static explicit operator WebPushAdapter(Notification n)
        {
            return new WebPushAdapter
            {
                Actions = string.IsNullOrEmpty(n.NotificationLink) ? new List<WebPushOptions>() : new List<WebPushOptions> { new WebPushOptions(n.NotificationLink, n.NotificationLinkTitle, n.NotificationLinkIcon) },
                Body = n.NotificationText,
                Icon = n.NotificationIcon,
                Image = string.IsNullOrEmpty(n.NotificationImage) ? null : n.NotificationImage,
                Title = n.NotificationTitle
            };
        }
    }

    public class NotificationDTO : ITaggableDto
    {
        public class GroupDTODescriptor
        {
            [JsonProperty("id")]
            public string Key { get; set; }
            [JsonProperty("text")]
            public string Value { get; set; }
        }
        [JsonProperty("id")]
        public int? Id { get; set; }
        [JsonProperty("groupsId")]
        [Required(ErrorMessage = "Campo obbligatorio")]
        public IEnumerable<GroupDTODescriptor> Groups { get; set; }
        [JsonProperty("notificationName")]
        [Required(ErrorMessage = "Campo obbligatorio")]
        [MaxLength(50, ErrorMessage = "Il nome della notifica deve essere di massimo 50 caratteri")]
        public string NotificationName { get; set; }
        [JsonProperty("notificationTitle")]
        [Required(ErrorMessage = "Campo obbligatorio")]
        [MaxLength(50, ErrorMessage = "Il titolo della notifica deve essere di massimo 50 caratteri")]
        public string NotificationTitle { get; set; }
        [JsonProperty("notificationImage")]
        public string NotificationImage { get; set; }
        [JsonProperty("notificationLink")]
        public string NotificationLink { get; set; }
        [JsonProperty("notificationText")]
        [Required(ErrorMessage = "Campo obbligatorio")]
        [MaxLength(180, ErrorMessage = "Il testo della notifica deve essere di massimo 180 caratteri")]
        public string NotificationText { get; set; }
        [JsonProperty("notificationLinkTitle")]
        public string NotificationLinkTitle { get; set; }
        [JsonProperty("notificationLinkIcon")]
        public string NotificationLinkIcon { get; set; }
        [JsonProperty("notificationIcon")]
        public string NotificationIcon { get; set; }

        public static explicit operator Notification(NotificationDTO o)
        {
            var notification = new Notification
            {
                NotificationImage = o.NotificationImage,
                NotificationLink = o.NotificationLink,
                NotificationTitle = o.NotificationTitle,
                NotificationName = o.NotificationName,
                NotificationText = o.NotificationText,
                NotificationIcon = o.NotificationIcon,
                NotificationLinkIcon = o.NotificationLinkIcon,
                NotificationLinkTitle = o.NotificationLinkTitle,
            };

            if (o.Id.HasValue && o.Id != default(int))
            {
                notification.Id = o.Id.Value;
            }
            return notification;
        }

        public static explicit operator NotificationDTO(Notification n)
        {
            var tags = n.Tags.Where(x => x.Tag.IsDeleted == false);
            return new NotificationDTO
            {
                Id = n.Id,
                Groups = tags.Select(x => new GroupDTODescriptor { Key = x.TagId.ToString(), Value = x.Tag.TagName }),
                NotificationImage = n.NotificationImage,
                NotificationLink = n.NotificationLink,
                NotificationName = n.NotificationName,
                NotificationText = n.NotificationText,
                NotificationTitle = n.NotificationTitle,
                NotificationIcon = n.NotificationIcon,
                NotificationLinkTitle = n.NotificationLinkTitle,
                NotificationLinkIcon = n.NotificationLinkIcon
                
            };
        }
    }
}
