import { Component } from '@angular/core';
import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  animations: [
    trigger('routeFade', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({ position: 'absolute', inset: 0 })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
          ], { optional: true }),
          query(':enter', [
            animate('320ms 60ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class MainLayoutComponent {
  prepareRoute(outlet: RouterOutlet): string {
    if (!outlet || !outlet.isActivated) return '';
    return outlet.activatedRoute.routeConfig?.path ?? '';
  }
}
