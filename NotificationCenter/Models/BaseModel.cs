using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Models
{
    public class BaseModel
    {
        public DateTime? LastUpdate { get; protected set; }
        public DateTime SetupAt { get; protected set; }
        public bool IsDeleted { get; protected set; }
    }
}
