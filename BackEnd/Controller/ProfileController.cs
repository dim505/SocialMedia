﻿using System;
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
                string Sql = @"select count(*) from SM_Account_Info where Auth0ID = @LoggedInUser";
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
                        Auth0ID = accountInfo.Auth0ID,
                        BannerPhotoUrl = "",
                        ProfilePhotoUrl = ""
                    });

                }
                else if (accountInfoCounts[0].count == 1)
                { }



                else if (UpdateAccountInfoAction == "UpdateProfileInfo")
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
                        Auth0ID = accountInfo.Auth0ID,
                        ProfilePhotoUrl = "",
                        BannerPhotoUrl = ""

                    };

                }

                else if (UpdateAccountInfoAction == "UpdateBannerPhoto")
                {

                    Sql = @" Update SM_Account_Info	
								set BannerPhotoUrl = @BannerPhotoUrl,
                                where  Auth0ID = @Auth0ID ";
                    Variables = new
                    {
                        FullName = "",
                        Tagline = "",
                        CompanyName = "",
                        Twitter = "",
                        Facebook = "",
                        WebAddress = "",
                        Auth0ID = accountInfo.Auth0ID,

                        ProfilePhotoUrl = "",
                        BannerPhotoUrl = accountInfo.BannerPhotoUrl

                    };

                }



                else if (UpdateAccountInfoAction == "UpdatePhoto")
                {

                    Sql = @" Update SM_Account_Info	
                                set ProfilePhotoUrl = @ProfilePhotoUrl,
                                where  Auth0ID = @Auth0ID ";
                    Variables = new
                    {
                        FullName = "",
                        Tagline = "",
                        CompanyName = "",
                        Twitter = "",
                        Facebook = "",
                        WebAddress = "",
                        Auth0ID = accountInfo.Auth0ID,
                        ProfilePhotoUrl = accountInfo.BannerPhotoUrl,
                        BannerPhotoUrl = ""

                    };

                }

                result = db.Execute(Sql, Variables);

            }
            return Ok();
        }

    }

}
