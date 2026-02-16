using System.Net.WebSockets;

namespace DeskManager.Server.Services;

public class WebsocketManagerService
{

    public WebsocketManagerService( )
    {
    }

    public Task HandleWebsocket(System.Net.WebSockets.WebSocket socket)
    {
        // socket.
        return Task.CompletedTask;
    }
}