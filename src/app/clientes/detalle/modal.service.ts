import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;

  private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  get nofiticarUpload(): EventEmitter<any> {
    return this._notificarUpload;
  }

  abrirModal() {
    this.modal = true;
  }

  cerraModal() {
    this.modal = false;
  }
}
