using JWT;
using System.Net;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log, ICollector<string> myQueue)
{
    log.Verbose($"C# HTTP trigger function processed a request. RequestUri={req.RequestUri}");

    var secret = "SuperSecret";

    var headers = req.Headers;
    var scheme = headers.Authorization.Scheme;
    var par = headers.Authorization.Parameter;

    log.Verbose($"AuthScheme={scheme}");
    log.Verbose($"AuthParameter={par}");
    
    
    var decoded = JsonWebToken.Decode(par, secret);

    log.Verbose($"Decoded = {decoded}");

    // parse query parameter
    string name = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
        .Value;

    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    // Set name to query string or body data
    name = name ?? data?.name;

    if(name != null) {
        myQueue.Add($"@{name}");
    }
    

    return name == null
        ? req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a name on the query string or in the request body")
        : req.CreateResponse(HttpStatusCode.OK, "Hello " + name);
}
