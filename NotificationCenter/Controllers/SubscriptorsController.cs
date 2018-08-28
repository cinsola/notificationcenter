using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NotificationCenter.Data;
using NotificationCenter.Models;
using NotificationCenter.Services;
using Wangkanai.Detection;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NotificationCenter.Controllers
{
    [Produces("application/json")]
    [Route("api/Subscriptors")]
    public class SubscriptorsController : Controller
    {
        private readonly IPushNotificationService _notificationService;
        private readonly IDetection _detection;
        private readonly IDeviceService _deviceService;
        private readonly ApplicationDbContext _context;
        private ITagService _tagService;

        public SubscriptorsController(ApplicationDbContext context, 
            IDetection detection, 
            IPushNotificationService notificationService,
            ITagService tagService,
            IDeviceService deviceService)
        {
            _context = context;
            _notificationService = notificationService;
            _detection = detection;
            _deviceService = deviceService;
            _tagService = tagService;
        }

        [HttpGet]
        public IActionResult GetSubscriptors()
        {
            var subscriptions = _deviceService.Get(); 
            return Ok(subscriptions);
        }

        [HttpGet]
        [Route("{id}")]
        // POST: /<controller>/
        public IActionResult GetSubscriptor(int id)
        {
            if (_context.Subscriptions.Any(x => x.Id == id) == true)
            {
                var result = _deviceService.GetTaggedSubscription(id);
                return Ok((SubscriptionDTO)result);
            }
            return NotFound();
        }

        [HttpPut]
        [Route("{id}")]
        // POST: /<controller>/
        public IActionResult PutSubscriptor(int id, [FromBody] SubscriptionDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.Id)
            {
                return BadRequest();
            }

            var databaseSubscription = _deviceService.GetTaggedSubscription(id);
            databaseSubscription.Update(model);
            _tagService.AssignTags<SubscriptionDTO, Subscription, SubscriptionTags>(model, databaseSubscription);
            _context.SaveChanges();
            return NoContent();
        }



        [HttpPost]
        // POST: /<controller>/
        public async Task<IActionResult> PostSubscriptor([FromBody] SubscriptionDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_context.Subscriptions.Any(x => x.Auth == model.Keys["auth"]) == false)
            {
                Subscription subscription = new Subscription
                {
                    Browser = _detection.Browser?.Name,
                    BrowserVersion = _detection.Browser?.Version?.Major,
                    PlatformVersion = _detection.Platform?.Version?.Major.ToString(),
                    Platform = _detection.Platform?.Type.ToString(),
                    Device = _detection.Device?.Type.ToString(),
                    EndPoint = model.EndPoint,
                    Auth = model.Keys["auth"],
                    Code = model.Keys["p256dh"],
                    ExpirationTime = model.ExpirationTime
                };
                var result = _context.Subscriptions.Add(subscription);
                await _context.SaveChangesAsync();
                return CreatedAtAction("PostSubscriptor", new { id = subscription.Id }, subscription);
            }

            return Ok();
        }
    }
}
