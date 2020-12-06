using System;
using System.Net;

namespace Appliaction.Errors
{
    public class RestException : Exception
    {
        private readonly HttpStatusCode code;
        private readonly object errors;

        public RestException(HttpStatusCode code, object errors = null )
        {
            this.code = code;
            this.errors = errors;
        }
    }
}