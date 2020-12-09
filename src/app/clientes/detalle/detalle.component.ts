import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { FacturasService } from '../../facturas/services/facturas.service';
import { Factura } from '../../facturas/models/factura';
import { templateJitUrl } from '@angular/compiler';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string = "Detalle del Cliente";
  public fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService,
    private facturasService: FacturasService,
    public modalService: ModalService,
    public authService: AuthService) { }

  ngOnInit(): void {
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal('Error al subir', 'Por favor, seleccione un formato válido', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal('Error al subir', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).
        subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.nofiticarUpload.emit(this.cliente);
            swal('La foto se subió completamente', 'La foto se subió exitosamente', 'success');
          }
        })
    }
  }

  cerrarModal() {
    this.modalService.cerraModal();
    this.progreso = 0;
    this.fotoSeleccionada = null;
  }

  delete(factura: Factura): void {
    swal({
      title: 'Está seguro?',
      text: '¿Seguro que desea eliminar la factura?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.facturasService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
            swal(
              'Factura eliminada',
              `La factura ${factura.descripcion} eliminada con éxito!`,
              'success'
            )
          }
        )
      }
    })
  }
  
}
