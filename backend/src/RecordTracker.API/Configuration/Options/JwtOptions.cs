namespace RecordTracker.API.Configuration.Options;

public class JwtOptions
{
    public string Key { get; set; } = string.Empty;
    public int ExpiryDays { get; set; }
}
