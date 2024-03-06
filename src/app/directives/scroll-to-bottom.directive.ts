import { Directive, ElementRef, AfterViewChecked  } from '@angular/core';

@Directive({
  selector: '[scrollToBottom]'
})
export class ScrollToBottomDirective implements AfterViewChecked  {

  constructor(private el: ElementRef) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
    } catch(e) {
      console.log(e);
    }
  }
}