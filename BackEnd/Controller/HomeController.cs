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



        public string GetDbConnString()
        {

            return _config["ConnectionStrings:DefaultConnection"];


        }


        /*!!!!!!!!!!!!!!!!!!!!API CALLS FOR HOME PAGE!!!!!!!!!!!!!!*/

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


        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdatePost([FromBody] JObject data)
        {
            string ConnStr = GetDbConnString();
            UpdatePost updatePost = data["UpdatePostData"].ToObject<UpdatePost>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = @"Update SM_Posts set PostContent = @NewPostContent where PostGuid = @PostGuid";
                int result = db.Execute(Sql, new
                {
                    NewPostContent = updatePost.PostContent,
                    PostGuid = updatePost.PostGuid

                });
            }
            return Ok();
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult AddComment([FromBody] JObject data)
        {
            string ConnStr = GetDbConnString();
            string Auth0CommentAuthor = GetUserAuth0ID();
            AddComment addComment = data["AddComment"].ToObject<AddComment>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = "insert into SM_Posts_Comments values (@PostGuid, @Auth0IDCommentAuthor, @DateCreated, @CommentContent)";

                db.Execute(Sql, new
                {
                    PostGuid = addComment.PostGuid,
                    Auth0CommentAuthor = Auth0CommentAuthor,
                    DateCreated = addComment.DateCreated,
                    CommentContent = addComment.CommentContent

                });
            }
            return Ok();
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult EditComment([FromBody] JObject data)
        {
            string ConnStr = GetDbConnString();
            string Auth0CommentAuthor = GetUserAuth0ID();
            AddComment addComment = data["EditComment"].ToObject<AddComment>();

            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = "insert into SM_Posts_Comments values (@PostGuid, @Auth0IDCommentAuthor, @DateCreated, @CommentContent)";

                db.Execute(Sql, new
                {
                    PostGuid = addComment.PostGuid,
                    Auth0CommentAuthor = Auth0CommentAuthor,
                    DateCreated = addComment.DateCreated,
                    CommentContent = addComment.CommentContent

                });
            }
            return Ok();

        }

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

        [HttpPost]
        [Route("[action]")]
        public IActionResult LikeComment([FromBody] JObject data)
        {
            string ConnStr = GetDbConnString();
            string Auth0CommentAuthor = GetUserAuth0ID();
            AddLikedComment addLikedComment = data["AddLikedComment"].ToObject<AddLikedComment>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = @"insert into SM_LikeCommentTable values (@Auth0IDWhoLiked, @PostGuid)";
                db.Execute(Sql, new
                {

                    Auth0IDWhoLiked = addLikedComment.Auth0IDWhoLiked,
                    PostGuid = addLikedComment.PostGuid

                });
            }
            return Ok();
        }


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




        // gets profile images for conversation list s
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetPosts()
        {


            string ConnStr = GetDbConnString();
            string Auth0IDAuthor = GetUserAuth0ID();
            List<GetPosts> getPosts = new List<GetPosts>();


            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                getPosts = db.Query<GetPosts>("select * from SM_Posts where Auth0IDAuthor = @Auth0IDAuthor",
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
