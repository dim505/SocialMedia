namespace WebApplication3.Modal
{	//used in addpost endpoint 
    public class AddPost
    {
        public string PostGuid { get; set; }
        public string DateCreated { get; set; }
        public string PostContent { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public string TempTagList { get; set; }


    }
}
