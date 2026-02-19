using NAudio.CoreAudioApi;

namespace DeskManager.Server.Models;

public class InputDeviceSnapshot
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public DeviceState State { get; set; }
    public float Volume { get; set; }
    public bool Muted { get; set; }
}

public static class Extensions
{
    public static InputDeviceSnapshot ToInputDeviceSnapshot(this MMDevice device)
    {
        var isPresent = device.State == DeviceState.Active;

        var snapshot = new InputDeviceSnapshot()
        {
            Id = device.ID,
            Name = device.FriendlyName,
            // Muted = device.AudioEndpointVolume.Mute,
            State = device.State,
            // Volume = device.AudioEndpointVolume.MasterVolumeLevelScalar * 100,
        };

        if (isPresent)
        {
            snapshot.Muted = device.AudioEndpointVolume.Mute;
            snapshot.Volume = device.AudioEndpointVolume.MasterVolumeLevelScalar * 100;
        }

        return snapshot;
    }
}