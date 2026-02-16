using DeskManager.Server.DTOs;
using Microsoft.AspNetCore.SignalR;
using NAudio.CoreAudioApi;

namespace DeskManager.Server.WebSocket;

public class WebSocketHub : Hub
{
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

        Console.WriteLine("Sending message: " + normalized);
        var deviceEnumerator = new MMDeviceEnumerator();
        var device = deviceEnumerator
            .GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);

        device.AudioEndpointVolume.MasterVolumeLevelScalar = normalized;
    }
}