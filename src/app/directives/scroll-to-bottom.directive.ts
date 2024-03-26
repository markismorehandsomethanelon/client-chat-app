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
    // const nativeElement = this.el.nativeElement;
    // const isAtBottom = nativeElement.scrollHeight - nativeElement.scrollTop === nativeElement.clientHeight;
    // console.log(nativeElement.scrollHeight);
    // console.log(isAtBottom);
    // if (isAtBottom) {
    //   this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
    // }
  }
}