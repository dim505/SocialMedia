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
    public class PeopleController : ControllerBase
    {

        private readonly IConfiguration _config;

        public PeopleController(IConfiguration config)
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

        [HttpGet]
        [Route("[action]")]
        public IActionResult FindPeople()
        {
            string ConnStr = GetDbConnString();
            string LoggedInUser = GetUserAuth0ID();
            List<FindPeople> findPeoples = new List<FindPeople>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string SqlStr = @"select top 100 FullName, Auth0ID, case when ProfilePhotoUrl <> '' then ProfilePhotoUrl else 'https://api.adorable.io/avatars/285/' + 'Profile' + Auth0ID end as ProfilePhotoUrl from SM_Account_Info left JOIN SM_Follow_Following_Table on SM_Account_Info.Auth0ID =  SM_Follow_Following_Table.FollowingAuth0ID where Auth0ID <> @LoggedInUser and FullName <> '' and (FollowerAuth0ID is null OR FollowerAuth0ID <> @LoggedInUser ) ORDER BY NEWID()";
                findPeoples = db.Query<FindPeople>(SqlStr, new { LoggedInUser = new DbString { Value = LoggedInUser, IsFixedLength = false, IsAnsi = true } }).ToList();
            };

            return Ok(findPeoples);
        }



        [HttpGet]
        [Route("[action]")]
        public IActionResult GetFollowing()
        {
            string ConnStr = GetDbConnString();
            string LoggedInUser = GetUserAuth0ID();
            List<Followers> followers = new List<Followers>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string SqlStr = @"select SM_Account_Info.FullName, case when ProfilePhotoUrl <> '' then ProfilePhotoUrl else 'https://api.adorable.io/avatars/285/' + 'Profile' + Auth0ID end as ProfilePhotoUrl, SM_Follow_Following_Table.* from SM_Follow_Following_Table left join SM_Account_Info on SM_Follow_Following_Table.FollowingAuth0ID = SM_Account_Info.Auth0ID where FollowerAuth0ID = @LoggedInUser";
                followers = db.Query<Followers>(SqlStr, new { LoggedInUser = new DbString { Value = LoggedInUser, IsFixedLength = false, IsAnsi = true } }).ToList();
            };

            return Ok(followers);
        }




        [HttpPost]
        [Route("[action]/{PersonToFollow}")]
        public IActionResult FollowPerson([FromRoute] string PersonToFollow)
        {
            string ConnStr = GetDbConnString();
            string LoggedInUser = GetUserAuth0ID();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string SqlStr = @"insert into SM_Follow_Following_Table values (@FollowerAuth0ID, @FollowingAuth0ID, @DateFollowed, @UserNotified)";
                int result = db.Execute(SqlStr, new
                {
                    FollowerAuth0ID = LoggedInUser,
                    FollowingAuth0ID = PersonToFollow,
                    DateFollowed = DateTime.Now.ToString(),
                    UserNotified = 'N'
                }

                    );
            }
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateNotification([FromBody] JObject data)
        {
            string ConnStr = GetDbConnString();
            string LoggedInUser = GetUserAuth0ID();
            RemoveNoti removeNoti = data["RemoveNoti"].ToObject<RemoveNoti>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string SqlStr = @"update SM_Follow_Following_Table set UserNotified = 'Y' where FollowerAuth0ID = @FollowerAuth0ID and FollowingAuth0ID = @FollowingAuth0ID";
                int result = db.Execute(SqlStr, new
                {
                    FollowerAuth0ID = removeNoti.FollowerAuth0ID,
                    FollowingAuth0ID = removeNoti.FollowingAuth0ID,

                }

                    );
            }
            return Ok();
        }



        [HttpDelete]
        [Route("[action]/{UnfollowPerson}")]
        public IActionResult DeleteFollowPerson([FromRoute] string UnfollowPerson)
        {
            string ConnStr = GetDbConnString();
            string LoggedInUser = GetUserAuth0ID();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string SqlStr = @"Delete from SM_Follow_Following_Table where FollowerAuth0ID = @LoggedInUser and FollowingAuth0ID = @UnfollowPerson";
                int result = db.Execute(SqlStr, new
                {
                    LoggedInUser = LoggedInUser,
                    UnfollowPerson = UnfollowPerson

                });
            }

            return Ok();
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCircle()
        {
            string ConnStr = GetDbConnString();
            string LoggedInUser = GetUserAuth0ID();
            List<YourCircle> yourCircle = new List<YourCircle>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {

                string SqlStr = @"select FollowingAuth0ID, FullName from SM_Follow_Following_Table FollowTbl
                                inner join SM_account_info AcctInfo
                                on FollowTbl.FollowingAuth0ID = AcctInfo.Auth0ID 
                                where FollwerAuth0ID = @FollwerAuth0ID";
                yourCircle = db.Query<YourCircle>(SqlStr, new { FollwerAuth0ID = new DbString { Value = LoggedInUser, IsFixedLength = false, IsAnsi = true } }).ToList();



            }


            return Ok(yourCircle);
        }


        /*
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAzureStorageToken()
        {
            string Key = _config["AzureStorageKey"];
            StorageSharedKeyCredential sharedKeyCredentials = new StorageSharedKeyCredential("<shellstorage123>", Key);
            AccountSasBuilder sasBuilder = new AccountSasBuilder()
            {
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(5),
                Services = AccountSasServices.Blobs,
                ResourceTypes = AccountSasResourceTypes.All,
                Protocol = SasProtocol.Https
            };
            sasBuilder.SetPermissions(AccountSasPermissions.All);
            string sasToken = sasBuilder.ToSasQueryParameters(sharedKeyCredentials).ToString();
            return Ok(sasToken);
        }*/



        [HttpGet]
        [Route("[action]")]
        public IActionResult GetFollowers()
        {
            string ConnStr = GetDbConnString();
            string LoggedInUser = GetUserAuth0ID();
            List<Followers> followers = new List<Followers>();
            using (IDbConnection db = new SqlConnection(ConnStr))
            {
                string SqlStr = @"select  SM_Account_Info.FullName, case when ProfilePhotoUrl <> '' then ProfilePhotoUrl else 'https://api.adorable.io/avatars/285/' + 'Profile' + Auth0ID end as ProfilePhotoUrl, SM_Follow_Following_Table.* from SM_Follow_Following_Table left join SM_Account_Info on SM_Follow_Following_Table.FollowerAuth0ID = SM_Account_Info.Auth0ID where FollowingAuth0ID = @LoggedInUser";
                followers = db.Query<Followers>(SqlStr, new { LoggedInUser = new DbString { Value = LoggedInUser, IsFixedLength = false, IsAnsi = true } }).ToList();
            };

            return Ok(followers);
        }

    }
}
