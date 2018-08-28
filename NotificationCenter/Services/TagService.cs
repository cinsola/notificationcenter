using Microsoft.EntityFrameworkCore;
using NotificationCenter.Data;
using NotificationCenter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Services
{
    public interface ITagService
    {
        /// <summary>
        /// Assegna i tag disponibili
        /// </summary>
        /// <param name="notification">Gruppi richiesti</param>
        /// <param name="databaseNotification">Gruppi a dati</param>
        void AssignTags<T, U, P>(T futureNotification, U databaseNotification)
                    where T : ITaggableDto
                    where U : ITaggableData<P>
                    where P : ITagPair, new();
        IEnumerable<TagDto> Get();
        Tag Get(int id);
    }
    public class TagService : ITagService
    {
        readonly ApplicationDbContext _context;
        public TagService(ApplicationDbContext dbContext)
        {
            this._context = dbContext;
        }

        public void AssignTags<T, U, P>(T dto, U data) 
            where T : ITaggableDto
            where U : ITaggableData<P>
            where P : ITagPair, new()
        {
            var groups = dto.Groups.Select(x => x.Value).ToList();
            var alreadyPresentTags = data.Tags.Select(x => x.Tag.TagName).Intersect(groups);
            var tagsToAdd = groups.Except(alreadyPresentTags).ToList();
            var tagsToRemove = data.Tags.Where(x => !groups.Contains(x.Tag.TagName)).ToList();

            tagsToRemove.ForEach(x => data.Tags.Remove(x));
            tagsToAdd.ForEach(x => data.Tags.Add(new P() { Tag = _context.Tags.FirstOrDefault(y => y.TagName == x) ?? new Tag(x) }));
        }

        public IEnumerable<TagDto> Get()
        {
            return _context.Tags.Include(x => x.Subscriptions).Include(x => x.Notifications).Where(x => x.IsDeleted == false).ToList().Select(x => (TagDto)x);
        }

        public Tag Get(int id)
        {
            return _context.Tags.FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
        }
    }
}
