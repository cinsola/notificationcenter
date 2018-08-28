using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Models
{
    public interface ITaggableDto
    {
        IEnumerable<NotificationDTO.GroupDTODescriptor> Groups { get; set; }
    }

    public interface ITaggableData<T> where T: ITagPair
    {
        ICollection<T> Tags { get; }
    }

    public interface ITagPair
    {
        int TagId { get; }
        Tag Tag { get; set; }
    }
}
