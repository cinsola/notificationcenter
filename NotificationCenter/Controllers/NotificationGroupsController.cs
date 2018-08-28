using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotificationCenter.Data;
using NotificationCenter.Models;
using NotificationCenter.Services;

namespace NotificationCenter.Controllers
{
    [Produces("application/json")]
    [Route("api/NotificationGroups")]
    public class NotificationGroupsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ITagService _tagService;

        public NotificationGroupsController(ApplicationDbContext context, ITagService tagService)
        {
            _context = context;
            _tagService = tagService;
        }

        // GET: api/NotificationGroups
        [HttpGet]
        public IEnumerable<TagDto> GetNotificationsGroup()
        {
            return _tagService.Get();
        }

        // GET: api/NotificationGroups/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationGroup([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var notificationGroup = await _context.Tags.SingleOrDefaultAsync(m => m.Id == id);

            if (notificationGroup == null)
            {
                return NotFound();
            }

            return Ok(notificationGroup);
        }

        // PUT: api/NotificationGroups/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotificationGroup([FromRoute] int id, [FromBody] Tag notificationGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != notificationGroup.Id)
            {
                return BadRequest();
            }

            _context.Entry(notificationGroup).State = EntityState.Modified;

                await _context.SaveChangesAsync();


            return NoContent();
        }

        // POST: api/NotificationGroups
        [HttpPost]
        public async Task<IActionResult> PostNotificationGroup([FromBody] Tag notificationGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Tags.Add(notificationGroup);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotificationGroup", new { id = notificationGroup.Id }, notificationGroup);
        }

        // DELETE: api/NotificationGroups/5
        [HttpDelete("{id}")]
        public IActionResult DeleteNotificationGroup([FromRoute] int id)
        {
            var entry = _tagService.Get(id);
            entry.Delete();
            _context.SaveChanges();
            return Ok();
        }
    }
}