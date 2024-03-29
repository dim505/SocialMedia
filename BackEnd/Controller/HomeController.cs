﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AMSBackEnd.Model;
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
    //s [Authorize]

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

        public object DbExecute(string SqlStr, object SqlParameters)
        {
            string LoginUserIdentifier = GetUserAuth0ID();
            string ConnStr = GetDbConnString();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                int result = db.Execute(SqlStr, SqlParameters);
                return Ok(result);
            }
        }

        public IActionResult DbQuery(string SqlStr, object SqlParameters)
        {
            string ConnStr = GetDbConnString();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                System.Collections.Generic.List<dynamic> data = db.Query(SqlStr, SqlParameters).AsList();
                return Ok(data);
            }
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
                string SqlStr = @"insert into SM_Posts values  (@Auth0IDAuthor, @PostGuid, @DateCreated, @PostContent, @DisableSharing, @DisableComments)
                                  insert into SM_Posts_File_Urls values  (@PostGuid, @FileUrl, @FileType, @TempTagList)  
";
                int result = db.Execute(SqlStr, new
                {

                    Auth0IDAuthor = LoginUserIdentifier,
                    PostGuid = addPost.PostGuid,
                    DateCreated = addPost.DateCreated,
                    PostContent = addPost.PostContent,
                    FileUrl = addPost.FileUrl,
                    FileType = addPost.FileType,
                    TempTagList = addPost.TempTagList,
                    DisableSharing = "",
                    DisableComments = ""

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
            string SqlStr = @"delete from SM_Posts where PostGuid= @PostGuid delete from SM_LikeCommentTable where PostGuid= @PostGuid";
            GlobalVariables.Parameter1 = PostGuid;

            var SqlParameters = new { PostGuid = new DbString { Value = GlobalVariables.Parameter1, IsFixedLength = false, IsAnsi = true } };
            dynamic results = DbExecute(SqlStr, SqlParameters);
            return Ok();
        }

        //this endpoint updates a post from the database
        [HttpPost]
        [Route("[action]/{UpdatePostAction}")]
        public IActionResult UpdatePost([FromBody] JObject data, string UpdatePostAction)
        {

            string ConnStr = GetDbConnString();
            UpdatePost updatePost = data["UpdatePostData"].ToObject<UpdatePost>();

            string Sql = "";
            var Variables = new
            {
                NewPostContent = "",
                PostGuid = "",
                DisableSharing = "",
                DisableComments = ""

            };
            if (UpdatePostAction == "UpdatePost")
            {

                Sql = @"Update SM_Posts set PostContent = @NewPostContent where PostGuid = @PostGuid";

                Variables = new
                {
                    NewPostContent = updatePost.PostContent,
                    PostGuid = updatePost.PostGuid,
                    DisableSharing = "",
                    DisableComments = ""

                };

            }
            else if (UpdatePostAction == "DisableSharing")
            {
                Sql = @"Update SM_posts	set DisableSharing = @DisableSharing where PostGuid = @PostGuid";
                Variables = new
                {
                    NewPostContent = "",
                    PostGuid = updatePost.PostGuid,
                    DisableSharing = updatePost.DisableSharing,
                    DisableComments = ""

                };
            }
            else if (UpdatePostAction == "DisableComments")
            {

                Sql = @"Update SM_posts	set DisableComments = @DisableComments where PostGuid = @PostGuid";
                Variables = new
                {

                    NewPostContent = "",
                    PostGuid = updatePost.PostGuid,
                    DisableSharing = "",
                    DisableComments = updatePost.DisableComments

                };

            }

            using (IDbConnection db = new SqlConnection(ConnStr))
            {

                int result = db.Execute(Sql, Variables);
            }
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
                getComments = db.Query<GetComments>("select SM_Account_Info.FullName, SM_Account_Info.ProfilePhotoUrl, PostGuid, Auth0IDCommentAuthor, DateCreated, CommentContent, CommentGuid from SM_Posts_Comments inner join SM_Account_Info on SM_Posts_Comments.Auth0IDCommentAuthor = SM_Account_Info.Auth0ID where PostGuid = @PostGuid order by DateCreated desc", new
                {
                    PostGuid = new DbString
                    {
                        Value = PostGuid,
                        IsFixedLength = false,
                        IsAnsi = true
                    }
                }).ToList();
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
                whoLikedPost = db.Query<WhoLikedPost>("select * from SM_LikeCommentTable where Auth0IDWhoLiked = @Auth0IDWhoLiked", new
                {
                    Auth0IDWhoLiked = new DbString
                    {
                        Value = Auth0IDWhoLiked,
                        IsFixedLength = false,
                        IsAnsi = true
                    }
                }).ToList();
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
                string Sql = "Update SM_Posts_Comments " + "set  CommentContent = @CommentContent" + "   where CommentGuid = @CommentGuid)";

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
        [Route("[action]/{TypeOfPost}/{ViewUserProfile}")]
        public IActionResult GetPosts(string TypeOfPost, string ViewUserProfile)
        {

            string Auth0IDAuthor = "";
            if (ViewUserProfile == "-1")
            {
                Auth0IDAuthor = GetUserAuth0ID();
            }
            else
            {
                Auth0IDAuthor = ViewUserProfile;
            }

            string ConnStr = GetDbConnString();

            List<GetPosts> getPosts = new List<GetPosts>();

            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                var SQL = "";
                if (TypeOfPost == "MainPagePosts")
                {
                    SQL = "select * from ( /*returns loggedin user posts */ select Auth0IDAuthor, a.PostGuid, AcctInfo.FullName, AcctInfo.ProfilePhotoUrl, DateCreated, PostContent, ( select count(*) from SM_LikeCommentTable where a.PostGuid = PostGuid ) as PostLikeCount, case when ( select count(*) from SM_LikeCommentTable where @Auth0IDAuthor = Auth0IDWhoLiked and a.PostGuid = PostGuid ) >= 1 then CAST(1 AS BIT) else CAST(0 AS BIT) end as DidUserLikePost, DisableSharing, DisableComments, FileUrl, FileType, TempTagList, 'False' as DisablePostMenu from ( select Auth0IDAuthor, Post.PostGuid, DateCreated, PostContent, case when post.DisableSharing <> 'True' then 'False' else 'True' end as DisableSharing, case when post.DisableComments <> 'True' then 'False' else 'True' end as DisableComments from SM_Posts Post ) a inner join SM_Account_Info AcctInfo on Auth0IDAuthor = AcctInfo.Auth0ID left join SM_Posts_File_Urls ON a.PostGuid = SM_Posts_File_Urls.PostGuid where Auth0IDAuthor = @Auth0IDAuthor group by Auth0IDAuthor, AcctInfo.FullName, AcctInfo.ProfilePhotoUrl, a.PostGuid, DateCreated, PostContent, DisableSharing, DisableComments, FileUrl, FileType, TempTagList union /*returns followers posts*/ select Auth0IDAuthor, a.PostGuid, AcctInfo.FullName, AcctInfo.ProfilePhotoUrl, DateCreated, PostContent, ( select count(*) from SM_LikeCommentTable where a.PostGuid = PostGuid ) as PostLikeCount, case when ( select count(*) from SM_LikeCommentTable where @Auth0IDAuthor = Auth0IDWhoLiked and a.PostGuid = PostGuid ) >= 1 then CAST(1 AS BIT) else CAST(0 AS BIT) end as DidUserLikePost, DisableSharing, DisableComments, FileUrl, FileType, TempTagList, 'True' as DisablePostMenu from ( select Auth0IDAuthor, Post.PostGuid, DateCreated, PostContent, case when post.DisableSharing <> 'True' then 'False' else 'True' end as DisableSharing, case when post.DisableComments <> 'True' then 'False' else 'True' end as DisableComments from SM_Posts Post ) a inner join SM_Account_Info AcctInfo on Auth0IDAuthor = AcctInfo.Auth0ID LEFT join SM_Follow_Following_Table on Auth0IDAuthor = SM_Follow_Following_Table.FollowingAuth0ID left join SM_Posts_File_Urls ON a.PostGuid = SM_Posts_File_Urls.PostGuid where SM_Follow_Following_Table.FollowerAuth0ID = @Auth0IDAuthor group by Auth0IDAuthor, AcctInfo.FullName, AcctInfo.ProfilePhotoUrl, a.PostGuid, DateCreated, PostContent, DisableSharing, DisableComments, FileUrl, FileType, TempTagList ) subquery order by convert(datetime, DateCreated) desc";
                }

                else if (TypeOfPost == "ProfilePosts")
                {
                    SQL = " IF DBO.IsUserAFollower(@LoggedInUser, @Auth0IDAuthor) > 0 BEGIN SELECT '-1' AS auth0idauthor END ELSE /*profile posts*/ BEGIN SELECT auth0idauthor, AcctInfo.ProfilePhotoUrl, a.postguid, AcctInfo.fullname, datecreated, postcontent, ( select count(*) from SM_LikeCommentTable where a.PostGuid = PostGuid ) as PostLikeCount, case when ( select count(*) from SM_LikeCommentTable where @Auth0IDAuthor = Auth0IDWhoLiked and a.PostGuid = PostGuid ) >= 1 then CAST(1 AS BIT) else CAST(0 AS BIT) end as DidUserLikePost, disablesharing, disablecomments, FileUrl, filetype, TempTagList, case when @LoggedInUser <> @Auth0IDAuthor then 'True' else 'False' end as DisablePostMenu FROM ( SELECT auth0idauthor, Post.postguid, datecreated, postcontent, CASE WHEN post.disablesharing <> 'True' THEN 'False' Else 'True' END AS DisableSharing, CASE WHEN post.disablecomments <> 'True' THEN 'False' else 'True' END AS DisableComments FROM sm_posts Post ) a INNER JOIN sm_account_info AcctInfo ON auth0idauthor = AcctInfo.auth0id LEFT JOIN sm_posts_file_urls ON a.postguid = sm_posts_file_urls.postguid WHERE auth0idauthor = @Auth0IDAuthor GROUP BY auth0idauthor, AcctInfo.ProfilePhotoUrl, AcctInfo.fullname, a.postguid, datecreated, postcontent, disablesharing, disablecomments, fileurl, filetype, TempTagList order by convert(datetime, DateCreated) desc end ";
                }
                getPosts = db.Query<GetPosts>(SQL, new
                {
                    Auth0IDAuthor = new DbString
                    {
                        Value = Auth0IDAuthor,
                        IsFixedLength = false,
                        IsAnsi = true
                    },


                    LoggedInUser = new DbString
                    {
                        Value = GetUserAuth0ID(),
                        IsFixedLength = false,
                        IsAnsi = true
                    }
                }).ToList();
            }
            return Ok(getPosts);





        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetNotifications()
        {
            string SqlStr = "select FollowerAuth0ID, FollowingAuth0ID, FullName  + ' is now following you!' as Message from sm_follow_following_table inner join SM_Account_Info ON SM_Account_Info.Auth0ID = sm_follow_following_table.FollowerAuth0ID where  FollowingAuth0ID = @LoggedInUser  and  UserNotified = 'N'";
            GlobalVariables.Parameter1 = GetUserAuth0ID();
            var SqlParameters = new
            {
                LoggedInUser = new DbString
                {
                    Value = GlobalVariables.Parameter1,
                    IsFixedLength = false,
                    IsAnsi = true
                }
            };
            dynamic results = DbQuery(SqlStr, SqlParameters);
            return results;
        }

        [HttpDelete]
        [Route("[action]/{FollowerAuth0ID}/{FollowingAuth0ID}")]
        public IActionResult DeleteNotification(string FollowerAuth0ID, string FollowingAuth0ID)
        {
            string SqlStr = "Update sm_follow_following_table set UserNotified = 'Y' where FollowerAuth0ID = @FollowerAuth0ID and FollowingAuth0ID = @FollowingAuth0ID";
            GlobalVariables.Parameter1 = FollowerAuth0ID;
            GlobalVariables.Parameter2 = FollowingAuth0ID;
            var SqlParameters = new
            {
                FollowerAuth0ID = new DbString
                {
                    Value = GlobalVariables.Parameter1,
                    IsFixedLength = false,
                    IsAnsi = true
                },
                FollowingAuth0ID = new DbString
                {
                    Value = GlobalVariables.Parameter2,
                    IsFixedLength = false,
                    IsAnsi = true
                }
            };
            dynamic results = DbExecute(SqlStr, SqlParameters);
            return results;
        }

        [HttpGet]
        [Route("[action]/{SearchItem}/{SearchTerm}")]
        public IActionResult Search(string SearchItem, string SearchTerm)
        {
            string SqlStr = "";
            if (SearchItem == "Posts")
            {
                SqlStr = @"select SM_Account_Info.FullName as fullName, Auth0IDAuthor AS auth0IDAuthor, DateCreated AS dateCreated, PostContent AS postContent, DisableSharing AS disableSharing, DisableComments AS disableComments, SM_Posts.PostGuid AS postGuid, FileUrl AS fileUrl, FileType AS fileType, FollowerAuth0ID AS followerAuth0ID, FollowingAuth0ID AS followingAuth0ID, DateFollowed AS dateFollowed, UserNotified AS userNotified from SM_Posts left join SM_Account_Info on SM_Posts.Auth0IDAuthor = SM_Account_Info.Auth0ID left join SM_Posts_File_Urls ON SM_Posts.PostGuid = SM_Posts_File_Urls.PostGuid left join SM_Follow_Following_Table on SM_Posts.Auth0IDAuthor = SM_Follow_Following_Table.FollowingAuth0ID where PostContent like @SearchTerm and (SM_Posts.Auth0IDAuthor = @LoggedInUser OR SM_Posts.Auth0IDAuthor = SM_Follow_Following_Table.FollowingAuth0ID) ";
            }
            else if (SearchItem == "Users")
            {
                SqlStr = @" select * into #GetFollowing from ( select Auth0ID, SM_Follow_Following_Table.followingAuth0ID from SM_Follow_Following_Table left join SM_Account_Info on SM_Follow_Following_Table.FollowingAuth0ID = SM_Account_Info.Auth0ID where FollowerAuth0ID = @LoggedInUser ) a select top 30 GetFollowing.Auth0ID, GetFollowing.FollowingAuth0ID as followingAuth0ID, SM_Account_Info.FullName as fullName, SM_Account_Info.Auth0ID as auth0ID, case when SM_Account_Info.ProfilePhotoUrl <> '' then SM_Account_Info.ProfilePhotoUrl else 'https://api.adorable.io/avatars/285/' + 'Profile' + SM_Account_Info.Auth0ID end as profilePhotoUrl, case when GetFollowing.Auth0ID is not null then CAST(1 AS BIT) else CAST(0 as bit) end as IsFollow from SM_Account_Info left join #GetFollowing GetFollowing on SM_Account_Info.Auth0ID = GetFollowing.Auth0ID where SM_Account_Info.Auth0ID <> @LoggedInUser and SM_Account_Info.FullName <> '' and SM_Account_Info.FullName like @SearchTerm ORDER BY NEWID() drop table #GetFollowing";
            }
            GlobalVariables.Parameter1 = "%" + SearchTerm + "%";
            GlobalVariables.Parameter2 = GetUserAuth0ID();
            var SqlParameters = new
            {
                SearchTerm = new DbString
                {
                    Value = GlobalVariables.Parameter1,
                    IsFixedLength = false,
                    IsAnsi = true
                },
                LoggedInUser = new DbString
                {
                    Value = GlobalVariables.Parameter2,
                    IsFixedLength = false,
                    IsAnsi = true
                }

            };
            dynamic results = DbQuery(SqlStr, SqlParameters);
            return (results);
        }

    }
}