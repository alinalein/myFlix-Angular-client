import { Component } from '@angular/core';

/**
 * Root component of the application.
 * @Component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  /**
   * Title of the application.
   */
  title = 'myFlix-Angular-client';
}
