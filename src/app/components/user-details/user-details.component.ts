import { Component } from '@angular/core';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [OrderHistoryComponent, MatCardModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {}
