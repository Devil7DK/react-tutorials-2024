using System.Security.Cryptography;
using System.Text;

public static class Utils
{
  public static string EncryptPassword(string password)
  {
    var sha256 = SHA256.Create();
    var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
    var builder = new StringBuilder();
    foreach (var t in bytes)
    {
      builder.Append(t.ToString("x2"));
    }
    return builder.ToString();
  }
}