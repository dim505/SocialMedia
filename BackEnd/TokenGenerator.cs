using Microsoft.Extensions.Configuration;

using System;

using System.Collections.Generic;
using Twilio.Jwt.AccessToken;


namespace SocialMedia
{

    public interface ITokenGenerator
    {
        string Generate(string identity, string endpendpointIdointId, string TokenType);


    }
    public class TokenGenerator : ITokenGenerator
    {

        private readonly IConfiguration _config;

        public TokenGenerator(IConfiguration config)
        {
            _config = config;
        }

        public string Generate(string identity, string endpointId, string TokenType)
        {


            HashSet<IGrant> grants = null;
            if (TokenType == "Chat")
            {

                grants = new HashSet<IGrant>
            {

                new ChatGrant   {EndpointId = endpointId, ServiceSid = _config["TwilioAccount:ChatServiceSid"], }

            };
            }
            else if (TokenType == "Voice")
            {
                var grant = new VoiceGrant();
                grant.OutgoingApplicationSid = _config["TwiloVoiceAppSid"];
                grants = new HashSet<IGrant>
                {
                    {grant}
                };

            }
            else if (TokenType == "Video")
            {
                var grant = new VideoGrant();
                grant.Room = "TestRoom";
                grants = new HashSet<IGrant> { grant };

            }



            var token = new Token(
                                _config["TwilioAccount:AccountSid"],
                _config["TwilioAccount:ApiKey"],
                _config["TwilioAccount:ApiSecret"],
                identity,
                grants: grants

                );

            return token.ToJwt();

        }





    }
}
