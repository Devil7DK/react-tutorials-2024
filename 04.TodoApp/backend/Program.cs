using System.Text.Json.Serialization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Migrations.Internal;
using System.Text;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DataContext>();

builder.Services.AddCors();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer((options) =>
{
    string? secretKey = builder.Configuration.GetValue<string>("JWTSecretKey");

    if (secretKey is null)
    {
        throw new Exception("JWTSecretKey is missing in appsettings.json");
    }

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/login", [AllowAnonymous] async (DataContext dataContext, [FromBody] LoginPayload loginPayload) =>
{
    var user = await dataContext.Users.FirstOrDefaultAsync(x => x.Email == loginPayload.Email);

    if (user is null)
    {
        return Results.Unauthorized();
    }

    if (user.Password != Utils.EncryptPassword(loginPayload.Password))
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new { AccessToken = CreateAccessToken(user) });
});

app.MapPost("/api/register", [AllowAnonymous] async (DataContext dataContext, [FromBody] RegisterPayload registerPayload) =>
{
    var user = await dataContext.Users.FirstOrDefaultAsync(x => x.Email == registerPayload.Email);

    if (user is not null)
    {
        return Results.BadRequest();
    }

    user = new User
    {
        Id = Guid.NewGuid(),
        Name = registerPayload.Name,
        Email = registerPayload.Email,
        Password = Utils.EncryptPassword(registerPayload.Password)
    };

    dataContext.Users.Add(user);
    await dataContext.SaveChangesAsync();

    return Results.Created($"/user/{user.Id}", new { AccessToken = CreateAccessToken(user) });
});

app.MapGet("/api/user", (DataContext dataContext, [FromHeader(Name = "Authorization")] string authoriztion) =>
{
    string token = authoriztion.Replace("Bearer ", "");

    Guid userId = getUserIdFromToken(token);

    User? user = dataContext.Users.FirstOrDefault(x => x.Id == userId);

    if (user is null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(user);
}).RequireAuthorization();

app.MapGet("/api/todos", (DataContext dataContext) =>
{
    return Results.Ok(dataContext.ToDos.OrderBy(x => x.UpdatedAt));
}).RequireAuthorization();

app.MapPost("/api/todos", (DataContext dataContext, [FromBody] PaginationPayload paginationPayload) =>
{
    return Results.Ok(dataContext.ToDos.Skip((paginationPayload.PageNumber - 1) * 10).Take(10).OrderBy(x => x.UpdatedAt));
}).RequireAuthorization();

app.MapGet("/api/todo/{id}", async (DataContext dataContext, [FromRoute] Guid id) =>
{
    var toDo = await dataContext.ToDos.FindAsync(id);

    if (toDo is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(toDo);
}).RequireAuthorization();

app.MapPost("/api/todo", async (DataContext dataContext, [FromBody] ToDo toDo) =>
{
    toDo.Id = Guid.NewGuid();
    dataContext.ToDos.Add(toDo);
    await dataContext.SaveChangesAsync();

    return Results.Created($"/todo/{toDo.Id}", toDo);
}).RequireAuthorization();

app.MapPut("/api/todo/{id}", async (DataContext dataContext, [FromRoute] Guid id, [FromBody] ToDo toDo) =>
{
    var existingToDo = await dataContext.ToDos.FindAsync(id);
    if (existingToDo is null)
    {
        return Results.NotFound();
    }

    existingToDo.Description = toDo.Description;
    existingToDo.Status = toDo.Status;
    existingToDo.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds() * 1000;

    await dataContext.SaveChangesAsync();

    return Results.Ok(existingToDo);
}).RequireAuthorization();

app.MapDelete("/api/todo/{id}", async (DataContext dataContext, [FromRoute] Guid id) =>
{
    var toDo = await dataContext.ToDos.FindAsync(id);
    if (toDo is null)
    {
        return Results.NotFound();
    }

    dataContext.ToDos.Remove(toDo);
    await dataContext.SaveChangesAsync();

    return Results.NoContent();
}).RequireAuthorization();

using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    dataContext.Database.EnsureCreated();
}

app.Run();

string CreateAccessToken(User user)
{
    string? secretKey = builder.Configuration.GetValue<string>("JWTSecretKey");

    if (secretKey is null)
    {
        throw new Exception("JWTSecretKey is missing in appsettings.json");
    }

    JwtSecurityTokenHandler tokenHandler = new();

    SecurityTokenDescriptor tokenDescriptor = new()
    {
        Subject = new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Name, user.Id.ToString())
        }),
        Expires = DateTime.UtcNow.AddDays(7),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)), SecurityAlgorithms.HmacSha256Signature)
    };

    SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

    return tokenHandler.WriteToken(token);
}

Guid getUserIdFromToken(string token)
{
    string? secretKey = builder.Configuration.GetValue<string>("JWTSecretKey");

    if (secretKey is null)
    {
        throw new Exception("JWTSecretKey is missing in appsettings.json");
    }

    var tokenHandler = new JwtSecurityTokenHandler();

    tokenHandler.ValidateToken(token, new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey))
    }, out SecurityToken validatedToken);

    var jwtToken = (JwtSecurityToken)validatedToken;

    return Guid.Parse(jwtToken.Claims.First(x => x.Type == "unique_name").Value);
}

public class DataContext : DbContext
{
    protected readonly IConfiguration Configuration;

    public DataContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
        options.ReplaceService<IMigrationsAssembly, MigrationsAssembly>();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ToDo>().HasData(
            // Add some seed TODOs related to software development
            new ToDo { Id = Guid.NewGuid(), Description = "Create a new project", Status = ToDoStatus.Done },
            new ToDo { Id = Guid.NewGuid(), Description = "Add a new feature", Status = ToDoStatus.InProgress },
            new ToDo { Id = Guid.NewGuid(), Description = "Fix a bug", Status = ToDoStatus.Pending },
            new ToDo { Id = Guid.NewGuid(), Description = "Deploy the app", Status = ToDoStatus.Pending },
            new ToDo { Id = Guid.NewGuid(), Description = "Test the app", Status = ToDoStatus.Pending }
        );

        modelBuilder.Entity<User>().HasData(
            new User { Id = Guid.NewGuid(), Name = "Admin User", Email = "admin@email.com", Password = Utils.EncryptPassword("Password123") }
        );
    }

    public DbSet<ToDo> ToDos { get; set; }

    public DbSet<User> Users { get; set; }
}

public enum ToDoStatus
{
    Pending = 1,
    InProgress = 2,
    Done = 3
}

public class ToDo
{
    public Guid Id { get; set; }
    public string Description { get; set; } = "";
    public ToDoStatus Status { get; set; } = ToDoStatus.Pending;
    public long UpdatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds() * 1000;
}

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    [JsonIgnore]
    public string Password { get; set; }
}

public class LoginPayload
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = "";

    [JsonPropertyName("password")]
    public string Password { get; set; } = "";
}

public class RegisterPayload
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("email")]
    public string Email { get; set; } = "";

    [JsonPropertyName("password")]
    public string Password { get; set; } = "";
}

public class PaginationPayload
{
    [JsonPropertyName("pageNumber")]
    public int PageNumber { get; set; }
}
