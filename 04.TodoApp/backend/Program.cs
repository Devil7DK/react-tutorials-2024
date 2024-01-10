using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Migrations.Internal;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DataContext>();

var app = builder.Build();

app.MapGet("/api/todos", (DataContext dataContext) =>
{
    return Results.Ok(dataContext.ToDos);
});

app.MapGet("/api/todo/{id}", async (DataContext dataContext, [FromRoute] Guid id) =>
{
    var toDo = await dataContext.ToDos.FindAsync(id);
    
    if (toDo is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(toDo);
});

app.MapPost("/api/todo", async (DataContext dataContext, [FromBody] ToDo toDo) =>
{
    toDo.Id = Guid.NewGuid();
    dataContext.ToDos.Add(toDo);
    await dataContext.SaveChangesAsync();

    return Results.Created($"/todo/{toDo.Id}", toDo);
});

app.MapPut("/api/todo/{id}", async (DataContext dataContext, [FromRoute] Guid id, [FromBody] ToDo toDo) =>
{
    var existingToDo = await dataContext.ToDos.FindAsync(id);
    if (existingToDo is null)
    {
        return Results.NotFound();
    }

    existingToDo.Description = toDo.Description;
    existingToDo.Status = toDo.Status;

    await dataContext.SaveChangesAsync();

    return Results.Ok(existingToDo);
});

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
});

using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    dataContext.Database.EnsureCreated();
}

app.Run();

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
    }

    public DbSet<ToDo> ToDos { get; set; }
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
}
