using DeskManager.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace DeskManager.Server.Controllers;

[ApiController]
[Route("/wss")]
public class WebsocketController : ControllerBase
{
    private readonly WebsocketManagerService _websocketManagerService;

    public WebsocketController(WebsocketManagerService websocketManagerService)
    {
        _websocketManagerService = websocketManagerService;
    }

    // [HttpGet]
    // public async Task Get()
    // {
    //     if (HttpContext.WebSockets.IsWebSocketRequest)
    //     {
    //         using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
    //         // await _websocketManagerService.HandleWebsocket(webSocket);
    //     }
    //     else
    //     {
    //         HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
    //     }
    // }
}