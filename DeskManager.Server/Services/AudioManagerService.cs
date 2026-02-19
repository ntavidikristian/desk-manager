using DeskManager.Server.Models;
using DeskManager.Server.WebSocket;
using Microsoft.AspNetCore.SignalR;
using NAudio.CoreAudioApi;
using NAudio.CoreAudioApi.Interfaces;

namespace DeskManager.Server.Services;

public class AudioManagerService : BackgroundService
{
    private readonly MMDeviceEnumerator _deviceEnumerator;
    private readonly IHubContext<WebSocketHub> _hubContext;
    private readonly MMDevice _device;
    private readonly WebSocketSubscriptionsService _webSocketSubscriptionsService;

    public AudioManagerService(IHubContext<WebSocketHub> hubContext,
        WebSocketSubscriptionsService webSocketSubscriptionsService)
    {
        _webSocketSubscriptionsService = webSocketSubscriptionsService;
        _deviceEnumerator = new MMDeviceEnumerator();
        _hubContext = hubContext;
        _device = _deviceEnumerator
            .GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);

        _device.AudioEndpointVolume.OnVolumeNotification += (evt) => { OnVolumeChanged(evt, _device.ID); };
        _deviceEnumerator.RegisterEndpointNotificationCallback(new NotificationClient());
        _webSocketSubscriptionsService.ClientRegistered += OnClientRegistered;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.CompletedTask; // event-driven, no loop needed
    }

    private void OnVolumeChanged(AudioVolumeNotificationData data, string deviceId)
    {
        Console.WriteLine(
            $"Volume changed from event: {data.MasterVolume} {data.Muted} {data.EventContext}, {data.Guid}");

        // Fire and forget safely
        _ = _hubContext.Clients.All
            .SendAsync("volumeChange", new
            {
                Volume = data.MasterVolume * 100,
                deviceId = deviceId
            });
    }

    private void OnClientRegistered(WebSocketSubscriptionsService.ClientRegisteredEvent clientRegistered)
    {
        if (clientRegistered.EventId == WebSocketSubscription.AudioOutput)
        {
            var snapshots = _deviceEnumerator.EnumerateAudioEndPoints(DataFlow.Render, DeviceState.All)
                .Select(device => device.ToInputDeviceSnapshot()).ToList();

            _hubContext.Clients.Client(clientRegistered.ClientId).SendAsync("outputSnapshots", new
            {
                DefaultDeviceId = _deviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia).ID,
                Snapshots = snapshots
            });
        }
    }


    class NotificationClient : IMMNotificationClient
    {
        public void OnDeviceStateChanged(string deviceId, DeviceState newState)
        {
            Console.WriteLine($"Device state changed: {deviceId} {newState}");
        }

        public void OnDeviceAdded(string pwstrDeviceId)
        {
            Console.WriteLine($"Device added: {pwstrDeviceId}");
        }

        public void OnDeviceRemoved(string deviceId)
        {
            Console.WriteLine($"Device device removed: {deviceId}");
        }

        public void OnDefaultDeviceChanged(DataFlow flow, Role role, string defaultDeviceId)
        {
            Console.WriteLine($"default device changed: {flow} {role} {defaultDeviceId}");
        }

        public void OnPropertyValueChanged(string pwstrDeviceId, PropertyKey key)
        {
            Console.WriteLine($"PropertyValue changed: {pwstrDeviceId} {key.formatId} {key.propertyId}");
        }
    }
}