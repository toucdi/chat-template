import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styles: [`
    .input-group:focus-within input {
      border-color: #0077cc;
      box-shadow: 0 0 0 1px #0077cc;
    }
    .input-group:focus-within button {
      box-shadow: none;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .expanded-chat {
      width: 90vw !important;
      height: 80vh !important;
      max-width: 1200px;
      right: 5vw;
      bottom: 10vh;
    }
    .message-content ::ng-deep ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }
    .message-content ::ng-deep ol {
      list-style-type: decimal;
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }
    .message-content ::ng-deep p {
      margin-bottom: 0.5rem;
    }
    .message-content ::ng-deep strong {
      font-weight: bold;
    }
    .message-content ::ng-deep a {
      color: #0077cc;
      text-decoration: underline;
    }
  `]
})
export class ChatWidgetComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  isOpen = false;
  isExpanded = false;
  messages: { text: string; isUser: boolean; timestamp: Date; sender: string; html?: SafeHtml }[] = [];
  newMessage = '';
  selectedFile: File | null = null;
  userName = 'Mario Rossi'; // Nome utente cablato
  private shouldScroll = false;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.addWelcomeMessage();
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '' && !this.selectedFile) return;

    // Aggiungi il messaggio dell'utente
    let messageText = this.newMessage;
    
    if (this.selectedFile) {
      messageText += this.newMessage ? 
        ` (File allegato: ${this.selectedFile.name})` : 
        `File allegato: ${this.selectedFile.name}`;
    }

    this.messages.push({
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      sender: this.userName
    });
    
    this.shouldScroll = true;

    // Simula una risposta dell'AI
    setTimeout(() => {
      // Esempio di risposta con HTML
      const htmlResponse = this.selectedFile 
        ? `<p>Grazie per il tuo messaggio. Un operatore ti risponderà presto.</p>
           <p>Ho ricevuto il tuo file <strong>"${this.selectedFile.name}"</strong>.</p>
           <ul>
             <li>Il file verrà analizzato</li>
             <li>Riceverai una risposta a breve</li>
           </ul>`
        : `<p>Grazie per il tuo messaggio. Un operatore ti risponderà presto.</p>
           <p>Ecco alcune <strong>informazioni utili</strong>:</p>
           <ul>
             <li>Orari di supporto: 9:00-18:00</li>
             <li>Email: <a href="mailto:supporto@esempio.it">supporto@esempio.it</a></li>
           </ul>`;
      
      this.messages.push({
        text: 'Grazie per il tuo messaggio. Un operatore ti risponderà presto.',
        isUser: false,
        timestamp: new Date(),
        sender: 'Assistente AI',
        html: this.sanitizer.bypassSecurityTrustHtml(htmlResponse)
      });
      
      this.shouldScroll = true;
    }, 1000);

    this.newMessage = '';
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Notifica l'utente che il file è stato selezionato
      const fileHtml = `
        <p>File selezionato: <strong>${this.selectedFile.name}</strong></p>
        <p>Dimensione: ${(this.selectedFile.size / 1024).toFixed(2)} KB</p>
        <p>Tipo: ${this.selectedFile.type || 'Non specificato'}</p>
      `;
      
      this.messages.push({
        text: `File selezionato: ${this.selectedFile.name}`,
        isUser: false,
        timestamp: new Date(),
        sender: 'Assistente AI',
        html: this.sanitizer.bypassSecurityTrustHtml(fileHtml)
      });
      
      this.shouldScroll = true;
    }
  }
  
  startNewChat(): void {
    this.messages = [];
    this.addWelcomeMessage();
    this.shouldScroll = true;
  }
  
  private addWelcomeMessage(): void {
    // Messaggio di benvenuto con HTML
    const welcomeHtml = `
      <p>Ciao! Come posso aiutarti oggi?</p>
      <p>Sono qui per rispondere alle tue domande.</p>
    `;
    
    this.messages.push({
      text: 'Ciao! Come posso aiutarti oggi?',
      isUser: false,
      timestamp: new Date(),
      sender: 'Assistente AI',
      html: this.sanitizer.bypassSecurityTrustHtml(welcomeHtml)
    });
  }
}
