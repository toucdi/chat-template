import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ChatWidgetElement } from './app/chat-widget/chat-widget.element';

platformBrowserDynamic().bootstrapModule(ChatWidgetElement)
  .catch(err => console.error(err));
