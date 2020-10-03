using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialMedia.model
{	//used in GetPosts endpoint.  returns the posts for a user.
    public class GetPosts
    {
        public string Auth0IDAuthor { get; set; }
		public string FullName { get; set; }
        public string PostGuid { get; set; }
        public string DateCreated { get; set; }
        public string PostContent { get; set; }

        public string PostLikeCount { get; set; }

        public bool DisableSharing { get; set; }

        public bool DisableComments { get; set; }

        public string DidUserLikePost { get; set; }
    }
}

