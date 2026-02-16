using DeskManager.Server.Services;
using DeskManager.Server.WebSocket;
using NAudio.CoreAudioApi;

var builder = WebApplication.CreateBuilder(args);
//
//
// var deviceEnumerator = new MMDeviceEnumerator();
// var mic = deviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Capture, Role.Multimedia);
// var inputs = deviceEnumerator.EnumerateAudioEndPoints(DataFlow.Capture, DeviceState.Active);
//
// foreach (var input in inputs)
// {
//     Console.WriteLine(input);
//     var name = input.DeviceFriendlyName;
//     Console.WriteLine(name);
//     Console.WriteLine(input.ID);
//     Console.WriteLine(input.AudioEndpointVolume.Mute);
//     
// }
// var micStatus = mic.AudioEndpointVolume.Mute;
// // mic.AudioEndpointVolume.Mute = true;
// Console.WriteLine(mic);
// Console.WriteLine($"mic status : {micStatus}");


// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddHostedService<AudioManagerService>();
builder.Services.AddSingleton<WebsocketManagerService>();
builder.Services.AddSignalR();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:4200").AllowCredentials()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();
app.MapHub<WebSocketHub>("/ws");
app.Run();