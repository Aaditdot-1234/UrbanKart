import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appToggleVisibility]'
})
export class ToggleVisibilityDirective {

  private isVisible: boolean = false;

  constructor(
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) { }

  @Input() set appToggleVisibility(condition: boolean) {
    this.isVisible = condition;
    this.updateView();
  }

  private updateView() {
    if (this.isVisible) {
      if(this.vcr.length === 0){
        this.vcr.createEmbeddedView(this.templateRef);
      }
    } else {
      this.vcr.clear();
    }
  }

}
