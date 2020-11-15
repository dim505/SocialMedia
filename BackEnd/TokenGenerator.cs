using Microsoft.Extensions.Configuration;

using System;

using System.Collections.Generic;
using Twilio.Jwt.AccessToken;


namespace SocialMedia
{

    public interface ITokenGenerator
    {
        string Generate(string identity, string endpendpointIdointId);


    }
    public class TokenGenerator : ITokenGenerator
    {

        private readonly IConfiguration _config;

        public TokenGenerator(IConfiguration config)
        {
            _config = config;
        }

        public string Generate(string identity, string endpointId)
        {
            var grants = new HashSet<IGrant>
            {

                new ChatGrant   {EndpointId = endpointId, ServiceSid = _config["TwilioAccount:ChatServiceSid"], }

            };

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
