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

            [HttpGet]
            [Route("[action]")]
            public IActionResult FindPeople()
            {
                string ConnStr = GetDbConnString();
                string LoggedInUser = GetUserAuth0ID();
                List<FindPeople> findPeoples = new List<FindPeople>();
                using (IDbConnection db = new SqlConnection(ConnStr))
                {
                    string SqlStr = @"select top 30 FullName, Auth0ID from SM_Account_Info ORDER BY NEWID()";
                    findPeoples = db.Query<FindPeople>(SqlStr).ToList();
                };

                return Ok(findPeoples);
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
            }

            */







            // GET: api/People
            [HttpGet]
            public IEnumerable<string> Get()
            {
                return new string[] { "value1", "value2" };
            }

            // GET: api/People/5
            [HttpGet("{id}", Name = "Get")]
            public string Get(int id)
            {
                return "value";
            }

            // POST: api/People
            [HttpPost]
            public void Post([FromBody] string value)
            {
            }

            // PUT: api/People/5
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
}
