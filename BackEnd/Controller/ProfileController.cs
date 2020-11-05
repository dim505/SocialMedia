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
    public class ProfileController : ControllerBase
    {

        private readonly IConfiguration _config;

        public ProfileController(IConfiguration config)
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

        [HttpPost]
        [Route("[action]/{UpdateAccountInfoAction}")]
        public IActionResult Add_Update_Account_Info([FromBody] JObject data, string UpdateAccountInfoAction)
        {
            string ConnStr = GetDbConnString();
            string LoggedInUser = GetUserAuth0ID();
            AccountInfo accountInfo = data["AccountInfo"].ToObject<AccountInfo>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string Sql = @"select count(*) as count from SM_Account_Info where Auth0ID = @LoggedInUser";
                List<Count> accountInfoCounts = new List<Count>();
                accountInfoCounts = db.Query<Count>(Sql, new
                {
                    LoggedInUser = new DbString
                    {
                        Value = LoggedInUser,
                        IsFixedLength = false,
                        IsAnsi = true
                    }
                }).ToList();
                int result = 0;
                Sql = "";
                var Variables = new
                {
                    FullName = "",
                    Tagline = "",
                    CompanyName = "",
                    Twitter = "",
                    Facebook = "",
                    WebAddress = "",
                    Auth0ID = "",
                    ProfilePhotoUrl = "",
                    BannerPhotoUrl = ""

                };
                if (accountInfoCounts[0].count == 0)
                {

                    Sql = @"insert into SM_Account_Info values (@FullName, @Tagline, @CompanyName, @Twitter, @Facebook, @WebAddress, @Auth0ID, @BannerPhotoUrl, @ProfilePhotoUrl)";
                    result = db.Execute(Sql, new
                    {

                        FullName = accountInfo.FullName,
                        Tagline = accountInfo.Tagline,
                        CompanyName = accountInfo.CompanyName,
                        Twitter = accountInfo.Twitter,
                        Facebook = accountInfo.Facebook,
                        WebAddress = accountInfo.WebAddress,
                        Auth0ID = LoggedInUser,
                        BannerPhotoUrl = "",
                        ProfilePhotoUrl = ""
                    });

                }
                else if (accountInfoCounts[0].count > 0)
                {

                    if (UpdateAccountInfoAction == "UpdateProfileInfo")
                    {

                        Sql = @" Update SM_Account_Info	
                                set FullName = @FullName,
                                Tagline = @Tagline,
                                CompanyName = @CompanyName,
                                Twitter = @Twitter,
                                Facebook = @Facebook,
                                WebAddress = @WebAddress
                                where  Auth0ID = @Auth0ID ";

                        Variables = new
                        {
                            FullName = accountInfo.FullName,
                            Tagline = accountInfo.Tagline,
                            CompanyName = accountInfo.CompanyName,
                            Twitter = accountInfo.Twitter,
                            Facebook = accountInfo.Facebook,
                            WebAddress = accountInfo.WebAddress,
                            Auth0ID = LoggedInUser,
                            ProfilePhotoUrl = "",
                            BannerPhotoUrl = ""

                        };

                    }

                    else if (UpdateAccountInfoAction == "UpdateBannerPhoto")
                    {

                        Sql = @" Update SM_Account_Info 	set BannerPhotoUrl = @BannerPhotoUrl where  Auth0ID = @Auth0ID ";
                        Variables = new
                        {
                            FullName = "",
                            Tagline = "",
                            CompanyName = "",
                            Twitter = "",
                            Facebook = "",
                            WebAddress = "",
                            Auth0ID = LoggedInUser,

                            ProfilePhotoUrl = "",
                            BannerPhotoUrl = accountInfo.BannerPhotoUrl

                        };

                    }

                    else if (UpdateAccountInfoAction == "UpdateProfilePhoto")
                    {

                        Sql = @" Update SM_Account_Info set ProfilePhotoUrl = @ProfilePhotoUrl where  Auth0ID = @Auth0ID ";
                        Variables = new
                        {
                            FullName = "",
                            Tagline = "",
                            CompanyName = "",
                            Twitter = "",
                            Facebook = "",
                            WebAddress = "",
                            Auth0ID = LoggedInUser,
                            ProfilePhotoUrl = accountInfo.ProfilePhotoUrl,
                            BannerPhotoUrl = ""

                        };

                    }

                }

                result = db.Execute(Sql, Variables);

            }
            return Ok();
        }

        // this endpoint gets all posts related to the user 
        [HttpGet]
        [Route("[action]/{ViewUserProfile}")]
        public IActionResult GetAccountInfo(string ViewUserProfile)
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
            List<AccountInfo> accountInfo = new List<AccountInfo>();

            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                accountInfo = db.Query<AccountInfo>("select case when DBO.IsUserAFollower(@LoggedInUser, @Auth0ID) > 0 then '-1' else '' end as IsUserAFollower, FullName,Tagline,CompanyName,Twitter,Facebook,WebAddress,Auth0ID, case when BannerPhotoUrl <> '' then  BannerPhotoUrl else 'https://api.adorable.io/avatars/285/' + 'Banner' + Auth0ID end as BannerPhotoUrl, case when ProfilePhotoUrl <> '' then ProfilePhotoUrl else 'https://api.adorable.io/avatars/285/' + 'Profile' + Auth0ID end as ProfilePhotoUrl  from SM_Account_Info  where Auth0ID = @Auth0ID", new
                {
                    Auth0ID = new DbString
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
            return Ok(accountInfo);

        }

        // this endpoint gets all posts related to the user 
        [HttpGet]
        [Route("[action]/{ViewUserProfile}")]
        public IActionResult GetProfileStats(string ViewUserProfile)
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

            List<GetProfileStats> getProfileStats = new List<GetProfileStats>();

            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                getProfileStats = db.Query<GetProfileStats>("select (select count(*)  from SM_LikeCommentTable where Auth0IDWhoLiked = @Auth0ID) as Likes, (select count(*)  from SM_Follow_Following_Table where FollowingAuth0ID = @Auth0ID) as NumOfFollwing, (select count(*) from SM_Follow_Following_Table where FollowerAuth0ID = @Auth0ID) as NumOfFollowers", new
                {
                    Auth0ID = new DbString
                    {
                        Value = Auth0IDAuthor,
                        IsFixedLength = false,
                        IsAnsi = true
                    }
                }).ToList();
            }
            return Ok(getProfileStats);

        }

    }

}