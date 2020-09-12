using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialMedia.model
{
    public class GetPosts
    {
        public string Auth0IDAuthor { get; set; }
        public string PostGuid { get; set; }
        public string DateCreated { get; set; }
        public string PostContent { get; set; }
    }
}
