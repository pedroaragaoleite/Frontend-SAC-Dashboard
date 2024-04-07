import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Customer } from '../../../core/interfaces/customer';

@Component({
  selector: 'app-view-customer',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.scss'
})
export class ViewCustomerComponent {

  // Icons
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  @Input() customerData: Customer | null = null;
  @Output() modalChanged: EventEmitter<void> = new EventEmitter();

  constructor(private cdRef: ChangeDetectorRef) { }

  close() {
    this.modalChanged.emit();
    this.cdRef.detectChanges();
  }

}
