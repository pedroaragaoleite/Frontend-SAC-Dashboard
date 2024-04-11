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


  // private userSubject: BehaviorSubject<User | null>

  // constructor() {
  //   const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  //   console.log(storedUser);

  //   this.userSubject = new BehaviorSubject<User | null>(storedUser)
  // }

  // getUser(): Observable<User | null> {
  //   return this.userSubject.asObservable();
  // }

  // updateUser(user: User | null): void {
  //   this.userSubject.next(user);
  // }
}