import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PHeaderComponent } from './shared/primeng-wrappers/header/p-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Country Explorer';
}
