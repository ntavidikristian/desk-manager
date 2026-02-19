namespace DeskManager.Server.Services;

public class WebSocketSubscriptionsService
{
    private readonly Dictionary<string, HashSet<string>> _eventSubscirptions = new();

    public event Action<ClientRegisteredEvent>? ClientRegistered;


    public void RegisterClient(string clientId, string notificationType)
    {
        if (!_eventSubscirptions.ContainsKey(notificationType))
        {
            _eventSubscirptions.Add(notificationType, []);
        }

        _eventSubscirptions[notificationType].Add(clientId);
        ClientRegistered?.Invoke(new ClientRegisteredEvent(clientId, notificationType));
    }


    public record ClientRegisteredEvent(string ClientId, string EventId);
}