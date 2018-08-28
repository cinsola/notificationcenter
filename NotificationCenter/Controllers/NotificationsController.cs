using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using NotificationCenter.Data;
using NotificationCenter.Models;
using NotificationCenter.Services;

namespace NotificationCenter.Controllers
{
    [Produces("application/json")]
    [Route("api/Notifications")]
    public class NotificationsController : Controller
    {
        private readonly ITagService _tagService;
        private readonly INotificationService _notificationService;
        private readonly IPushNotificationService _webPushService;
        private readonly ApplicationDbContext _dbContext;

        public NotificationsController(ITagService tagService, IPushNotificationService webPushService, INotificationService notificationService, ApplicationDbContext context)
        {
            _tagService = tagService;
            _dbContext = context;
            _notificationService = notificationService;
            _webPushService = webPushService;
        }

        [HttpGet]
        public IEnumerable<NotificationDTO> GetNotifications()
        {
            var result = _notificationService.GetNotifications();
            return result;
        }

        [HttpGet("{id}")]
        public IActionResult GetNotification([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var notification = _notificationService.GetTaggedNotification(id);
            if (notification == null)
            {
                return NotFound();
            }

            var notificationDto = (NotificationDTO)notification;
            return Ok(notificationDto);
        }

        [HttpPut("{id}")]
        public IActionResult PutNotification([FromRoute] int id, [FromBody] NotificationDTO notification)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != notification.Id)
            {
                return BadRequest();
            }

            var databaseNotification = _notificationService.GetTaggedNotification(id);
            databaseNotification.UpdateWith(notification);

            _tagService.AssignTags<NotificationDTO, Notification, NotificationTags>(notification, databaseNotification);

            _dbContext.SaveChanges();
            return NoContent();
        }

        [HttpPost]
        public IActionResult PostNotification([FromBody] NotificationDTO notification)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Notification notificationResult = (Notification)notification;
            _tagService.AssignTags<NotificationDTO, Notification, NotificationTags>(notification, notificationResult);
            _notificationService.AddNotification(notificationResult);
            _dbContext.SaveChanges();

            return CreatedAtAction("GetNotification", new { id = notificationResult.Id }, (NotificationDTO)notificationResult);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNotification(int id)
        {
            var entry = _notificationService.GetTaggedNotification(id);
            entry.Delete();
            _dbContext.SaveChanges();
            return Ok();
        }

        [HttpPost("broadcast/{id}")]
        public IActionResult Broadcast(int id)
        {
            var notification = _notificationService.GetTaggedNotification(id);
            if(notification != null)
            {
                var subscriptions = _notificationService.GedBroadcastDevices(notification);
                foreach (var subscription in subscriptions)
                {
                    _webPushService.SendNotification(subscription, notification);
                }
            } else
            {
                return NotFound();
            }
            return Ok();
        }
    }
}