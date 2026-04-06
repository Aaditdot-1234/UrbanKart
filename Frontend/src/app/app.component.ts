import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './shared/services/toast.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';

  constructor(public toast: ToastService){}
}
