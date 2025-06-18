namespace RecordTracker.API.Configuration;

public class JwtOptions
{
    public string Key { get; set; } = string.Empty;
    public int ExpiryDays { get; set; }
}
