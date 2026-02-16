using DeskManager.Server.WebSocket;
using Microsoft.AspNetCore.SignalR;
using NAudio.CoreAudioApi;

namespace DeskManager.Server.Services;

public class AudioManagerService : BackgroundService
{
    private readonly MMDeviceEnumerator _deviceEnumerator;
    private readonly IHubContext<WebSocketHub> _hubContext;
    private readonly MMDevice _device;

    public AudioManagerService(IHubContext<WebSocketHub> hubContext)
    {
        _deviceEnumerator = new MMDeviceEnumerator();
        _hubContext = hubContext;
        _device = _deviceEnumerator
            .GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);

        _device.AudioEndpointVolume.OnVolumeNotification += OnVolumeChanged;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        

        return Task.CompletedTask; // event-driven, no loop needed
    }

    private void OnVolumeChanged(AudioVolumeNotificationData data)
    {
        Console.WriteLine($"Volume changed: {data.MasterVolume}");

        // Fire and forget safely
        _ = _hubContext.Clients.All
            .SendAsync("VolumeChange", data.MasterVolume);
    }
}