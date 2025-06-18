namespace RecordTracker.API.Configuration;

public class JwtConfig
{
    public string Key { get; set; } = string.Empty;
    public int ExpiryDays { get; set; }
}
