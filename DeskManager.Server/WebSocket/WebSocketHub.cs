using DeskManager.Server.DTOs;
using DeskManager.Server.Models;
using DeskManager.Server.Services;
using Microsoft.AspNetCore.SignalR;
using NAudio.CoreAudioApi;

namespace DeskManager.Server.WebSocket;

public class WebSocketHub : Hub
{
    private readonly WebSocketSubscriptionsService _webSocketSubscriptionsService;

    public WebSocketHub(WebSocketSubscriptionsService webSocketSubscriptionsService)
    {
        _webSocketSubscriptionsService = webSocketSubscriptionsService;
    }

    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"{Context.ConnectionId} connected");
        return base.OnConnectedAsync();
    }

    public async Task SendMessage(object message)
    {
        Console.WriteLine("Sending message: " + message);
    }

    public async Task SetVolume(SetVolumeDto message)
    {
        var normalized = message.Volume / 100;

        Console.WriteLine($"Client {Context.ConnectionId} requested volumechange");

        Console.WriteLine("Sending message: " + normalized);
        var deviceEnumerator = new MMDeviceEnumerator();
        var device = deviceEnumerator
            .GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);

        device.AudioEndpointVolume.MasterVolumeLevelScalar = normalized;
    }

    public async Task GetEvents(string eventName)
    {
        _webSocketSubscriptionsService.RegisterClient(Context.ConnectionId, eventName);
    }
}