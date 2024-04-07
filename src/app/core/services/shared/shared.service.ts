import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  /*
  Uso un servicio compartido para que los dos componentes puedan acceder
  se puede usar un Subject o BehaviourSubject para emitir eventos a los que los
  componente se puedan suscribirse
  */
  private eventRefresh = new Subject<void>;

  // Obsevable al que se suscribirá HomeComponent
  eventRefresh$ = this.eventRefresh.asObservable();

  // Método para llamar desde ModalComponent para emitir evento
  notifyEventChange() {
    this.eventRefresh.next();
  }

  // Shared service to open user modal
  // private modalActionSource = new BehaviorSubject<{ open: boolean; mode?: 'create' | 'edit'; userData?: User }>({ open: false });
  // modalAction$: Observable<{ open: boolean; userData?: User; mode?: 'create' | 'edit' }> = this.modalActionSource.asObservable();

  // openModal(mode?: 'create' | 'edit', userData?: User) {
  //   this.modalActionSource.next({ open: true, mode, userData });
  // }

  // closeModal() {
  //   this.modalActionSource.next({ open: false })
  // }
}