using System;
using System.Net;

namespace Appliaction.Errors
{
    public class RestException : Exception
    {

        public HttpStatusCode Code { get; set; }
        public object Errors { get; set; }

        public RestException(HttpStatusCode code, object errors = null)
        {
            Errors = errors;
            Code = code;

        }
    }
}