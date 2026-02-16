import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('DeskManager.Client');
  ngOnInit(): void {
    let connection = new signalR.HubConnectionBuilder().withUrl('http://localhost:5066/ws').build();
    connection.on('SendMessage', (data) => {
      console.log(data);
    });

    connection.start().then(() => connection.invoke('sendMessage', { person: 'Hello' }));
  }
}
