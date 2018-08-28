using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationCenter.Models
{
    public class VapidSettings
    {
        public string PublicKey {get; set;}
        public string PrivateKey { get; set; }
        public string Subject { get; set; }
    }
}
