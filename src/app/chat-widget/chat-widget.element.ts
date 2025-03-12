import { createCustomElement } from '@angular/elements';
import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { ChatWidgetComponent } from './chat-widget.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ChatWidgetComponent  // Import instead of declare since it's standalone
  ],
  declarations: []  // Remove from declarations
})
export class ChatWidgetElement implements DoBootstrap {
  constructor(private injector: Injector) {
    const chatWidget = createCustomElement(ChatWidgetComponent, { injector });
    customElements.define('support-chat-widget', chatWidget);
  }

  ngDoBootstrap() {}
}