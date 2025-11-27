namespace RecordTracker.API.Configuration.Options;

public class AuthOptions
{
    public JwtOptions Jwt { get; set; } = new();
    public AuthCookieOptions Cookie {  get; set; } = new();

}

public class JwtOptions
{
    public string Key { get; set; } = string.Empty;
    public int ExpiryDays { get; set; }
}

public class AuthCookieOptions
{
    public string Name { get; set; } = string.Empty;
    public bool Secure { get; set; }
    public string SameSite { get; set; } = string.Empty;
    public int ExpiryDays { get; set; }
}