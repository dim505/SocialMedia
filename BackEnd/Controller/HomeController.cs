using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using SocialMedia.model;
using WebApplication3.Modal;

namespace SocialMedia.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class HomeController : ControllerBase
    {



        private readonly IConfiguration _config;

        public HomeController(IConfiguration config)
        {
            _config = config;


        }


        //function used to get auth0ID for signed in user 
        public string GetUserAuth0ID()
        {

            string LoginUserIdentifier = "";

            try
            {
                //gets the login token from Auth0
                return LoginUserIdentifier = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            }
            catch (Exception)
            {
                return LoginUserIdentifier = "";


            }

        }


        //function used to get DB string for User 
        public string GetDbConnString()
        {

            return _config["ConnectionStrings:DefaultConnection"];


        }


        /*!!!!!!!!!!!!!!!!!!!!API CALLS FOR HOME PAGE!!!!!!!!!!!!!!*/
        //this endpoint adds a post to the database 
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddPost([FromBody] JObject data)
        {
            string LoginUserIdentifier = GetUserAuth0ID();
            string ConnStr = GetDbConnString();
            AddPost addPost = data["AddPost"].ToObject<AddPost>();

            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string SqlStr = @"insert into SM_Posts values  (@Auth0IDAuthor, @PostGuid, @DateCreated, @PostContent)";
                int result = db.Execute(SqlStr, new
                {

                    Auth0IDAuthor = LoginUserIdentifier,
                    PostGuid = addPost.PostGuid,
                    DateCreated = addPost.DateCreated,
                    PostContent = addPost.PostContent

                }

                    );
            }

            return Ok();
        }




        //this end point deletes a post from the database 
        [HttpDelete]
        [Route("[action]/{PostGuid}")]
        public IActionResult DeletePost(string PostGuid)
        {
            string ConnStr = GetDbConnString();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = @"delete from SM_Posts where PostGuid= @PostGuid";
                db.Execute(Sql, new
                {
                    PostGuid = PostGuid
                });

            }

            return Ok();
        }

        //this endpoint updates a post from the database
        [HttpPost]
        [Route("[action]/{UpdatePostAction}")]
        public IActionResult UpdatePost([FromBody] JObject data, string UpdatePostAction)
        {

            /*
            string ConnStr = GetDbConnString();
            UpdatePost updatePost = data["UpdatePostData"].ToObject<UpdatePost>();

            string Sql = "";
            var Variables = new
            {
            };
            if (UpdatePostAction == "UpdatePost")
            {

                Sql = @"Update SM_Posts set PostContent = @NewPostContent where PostGuid = @PostGuid";


                Variables = new
                {
                    NewPostContent = "",
                    PostGuid = ""

                };

            }
            else if (UpdatePostAction == "DisableComments")
            {
                Sql = @"Update SM_Posts set PostContent = @NewPostContent where PostGuid = @PostGuid";
                Variables = new
                {



                };
            }
            else if (UpdatePostAction == "DisableSharing")
            {


                Sql = @"Update SM_Posts set PostContent = @NewPostContent where PostGuid = @PostGuid";

            }

            using (IDbConnection db = new SqlConnection(ConnStr))
            {

                int result = db.Execute(Sql, Variables
                );
            }*/
            return Ok();
        }


        // this endpoint gets all posts related to the user 
        [HttpGet]
        [Route("[action]/{PostGuid}")]
        public IActionResult GetComments(string PostGuid)
        {
            string ConnStr = GetDbConnString();
            List<GetComments> getComments = new List<GetComments>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                getComments = db.Query<GetComments>("select * from SM_Posts_Comments where PostGuid = @PostGuid",
                  new { PostGuid = new DbString { Value = PostGuid, IsFixedLength = false, IsAnsi = true } }).ToList();
            }
            return Ok(getComments);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetLikes()
        {
            string Auth0IDWhoLiked = GetUserAuth0ID();
            string ConnStr = GetDbConnString();
            List<WhoLikedPost> whoLikedPost = new List<WhoLikedPost>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                whoLikedPost = db.Query<WhoLikedPost>("select * from SM_LikeCommentTable where Auth0IDWhoLiked = @Auth0IDWhoLiked",
                  new { Auth0IDWhoLiked = new DbString { Value = Auth0IDWhoLiked, IsFixedLength = false, IsAnsi = true } }).ToList();
            }
            return Ok(whoLikedPost);
        }


        //this endpoint adds a comment to the database 
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddComment([FromBody] JObject data)
        {

            string ConnStr = GetDbConnString();
            string Auth0CommentAuthor = GetUserAuth0ID();
            AddComment addComment = data["AddComment"].ToObject<AddComment>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = "insert into SM_Posts_Comments values (@PostGuid, @Auth0IDCommentAuthor, @DateCreated, @CommentContent,@CommentGuid)";

                db.Execute(Sql, new
                {
                    PostGuid = addComment.PostGuid,
                    Auth0IDCommentAuthor = Auth0CommentAuthor,
                    DateCreated = addComment.DateCreated,
                    CommentContent = addComment.CommentContent,
                    CommentGuid = addComment.CommentGuid

                });
            }
            return Ok();
        }

        //this endpoint edits a comment in the database 
        [HttpPost]
        [Route("[action]")]
        public IActionResult EditComment([FromBody] JObject data)
        {
            string ConnStr = GetDbConnString();
            string Auth0CommentAuthor = GetUserAuth0ID();
            EditComment EditComment = data["EditComment"].ToObject<EditComment>();

            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = "Update SM_Posts_Comments " +
                                    "set  CommentContent = @CommentContent" +
                                    "   where CommentGuid = @CommentGuid)";

                db.Execute(Sql, new
                {

                    CommentContent = EditComment.CommentContent

                });
            }
            return Ok();

        }

        //this endpoint deletes a comment in the database 
        [HttpDelete]
        [Route("[action]/{CommentGuid}")]
        public IActionResult DeleteComment(string CommentGuid)
        {
            string ConnStr = GetDbConnString();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = @"Delete from SM_Posts_Comments where CommentGuid = @CommentGuid";
                db.Execute(Sql, new
                {
                    CommentGuid = CommentGuid
                });

            }

            return Ok();
        }


        //this endpoint adds a like to a post 
        [HttpPost]
        [Route("[action]")]
        public IActionResult LikeComment([FromBody] JObject data)
        {
            string ConnStr = GetDbConnString();
            string Auth0IDWhoLiked = GetUserAuth0ID();
            AddLikedComment addLikedComment = data["AddLikedComment"].ToObject<AddLikedComment>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = @"insert into SM_LikeCommentTable values (@Auth0IDWhoLiked, @PostGuid)";
                db.Execute(Sql, new
                {

                    Auth0IDWhoLiked = Auth0IDWhoLiked,
                    PostGuid = addLikedComment.PostGuid

                });
            }
            return Ok();
        }

        //this endpoint deletes the like on a post 
        [HttpDelete]
        [Route("[action]/{PostGuid}")]
        public IActionResult DeleteLikedPost(string PostGuid)

        {
            string ConnStr = GetDbConnString();
            string Auth0IDWhoLiked = GetUserAuth0ID();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = @"delete from SM_LikeCommentTable where PostGuid = @PostGuid and Auth0IDWhoLiked = @Auth0IDWhoLiked";
                db.Execute(Sql, new
                {
                    Auth0IDWhoLiked = Auth0IDWhoLiked,
                    PostGuid = PostGuid
                });
            }
            return Ok();

        }




        // this endpoint gets all posts related to the user 
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetPosts()
        {


            string ConnStr = GetDbConnString();
            string Auth0IDAuthor = GetUserAuth0ID();
            List<GetPosts> getPosts = new List<GetPosts>();


            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                getPosts = db.Query<GetPosts>("select Auth0IDAuthor, PostGuid, DateCreated, PostContent , count (Auth0IDWhoLiked) as PostLikeCount from ( select Auth0IDAuthor, Post.PostGuid, DateCreated, PostContent, Auth0IDWhoLiked from SM_Posts Post left join (select * from SM_LikeCommentTable ) LikedComm on Post.Auth0IDAuthor = LikedComm.Auth0IDWhoLiked and Post.PostGuid = LikedComm.PostGuid ) a where Auth0IDAuthor = Auth0IDAuthor group by Auth0IDAuthor, PostGuid, DateCreated, PostContent",
                  new { Auth0IDAuthor = new DbString { Value = Auth0IDAuthor, IsFixedLength = false, IsAnsi = true } }).ToList();
            }
            return Ok(getPosts);



        }

















        // GET: api/Home
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Home/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Home
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Home/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
