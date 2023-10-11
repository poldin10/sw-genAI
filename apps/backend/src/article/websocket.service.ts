import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private socket: Socket) {}

  connect() {
    this.socket.connect();
    console.log('test');
  }

  lockArticle(articleId: string, username: string) {
    this.socket.emit('lock-article', { articleId, username });
  }

  unlockArticle(articleId: string) {
    this.socket.emit('unlock-article', { articleId });
  }
}