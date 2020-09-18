namespace WebApplication3.Modal
{	////used in the end point  AddComment to model comment data 
    public class AddComment
    {
        public string PostGuid { get; set; }
        public string DateCreated { get; set; }
        public string CommentContent { get; set; }

        public string CommentGuid { get; set; }
    }
}
