using System;
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

namespace SocialMedia.Controller
{
    [Route("api/[controller]")]
    [ApiController]

    public class MessengerController : ControllerBase
    {




        private readonly ITokenGenerator _tokenGenerator;
        private readonly IConfiguration _config;
        public MessengerController(IConfiguration config, ITokenGenerator tokenGenerator)
        {
            _config = config;
            _tokenGenerator = tokenGenerator;
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


        [HttpGet]
        [Route("[action]")]
        public IActionResult GetMessengerUsers()
        {
            /* LoggedInUserAuth0ID	FollowingAuth0ID	FullName	ProfilePhotoUrl ChatStarted */
            var SqlStr = @"select @LoggedInUser as LoggedInUserAuth0ID, Auth0ID as FollowingAuth0ID, FullName, ProfilePhotoUrl, CASE when ChatStarted.LoggedInUserAuth0ID is not null then cast(1 as bit) else cast(0 as bit) end as ChatStarted from ( select distinct t2.FollowerAuth0ID from SM_Follow_Following_Table t1 inner join SM_Follow_Following_Table t2 on t1.FollowerAuth0ID = t2.FollowingAuth0ID where @LoggedInUser = t1.FollowerAuth0ID and @LoggedInUser = t2.FollowingAuth0ID and t1.FollowingAuth0ID = t2.FollowerAuth0ID ) as SubQuery left join ChatStarted on ChatStarted.FollowingAuth0ID = SubQuery.FollowerAuth0ID inner join SM_Account_Info on SubQuery.FollowerAuth0ID = SM_Account_Info.Auth0ID";
            var SqlParameters = new
            {
                LoggedInUser = new DbString
                {
                    Value = GetUserAuth0ID(),
                    IsFixedLength = false,
                    IsAnsi = true
                }
            };
            dynamic results = DbQuery(SqlStr, SqlParameters);
            return (results);
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetToken([FromBody] JObject data)
        {

            GetToken getToken = data["GetToken"].ToObject<GetToken>();


            if (getToken.device == null || getToken.LoggedInUserAuth0ID == null)
            {
                return null;
            }
            var token = _tokenGenerator.Generate(getToken.LoggedInUserAuth0ID, getToken.channelName, getToken.device, getToken.TokenType);
            return Ok(token);

        }

        //this end point deletes a post from the database 
        [HttpPost]
        [Route("[action]/{FollowingAuth0ID}")]
        public IActionResult ChatStarted(string FollowingAuth0ID)
        {
            string SqlStr = @"insert into ChatStarted values (@LoggedInUserAuth0ID,@FollowingAuth0ID), (@FollowingAuth0ID, @LoggedInUserAuth0ID) ";
            var SqlParameters = new
            {
                FollowingAuth0ID = new DbString { Value = FollowingAuth0ID, IsFixedLength = false, IsAnsi = true },
                LoggedInUserAuth0ID = new DbString { Value = GetUserAuth0ID(), IsFixedLength = false, IsAnsi = true }
            };
            dynamic results = DbExecute(SqlStr, SqlParameters);
            return Ok();
        }
















        // GET: api/Messenger
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Messenger/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Messenger
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Messenger/5
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
