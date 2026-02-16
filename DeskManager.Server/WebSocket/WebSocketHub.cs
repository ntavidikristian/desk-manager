using Microsoft.AspNetCore.SignalR;

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
}