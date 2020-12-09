import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  regiones: Region[];
  public titulo: string = "Crear Cliente";
  public errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    })
  }

  public create(): void {
    this.clienteService.create(this.cliente)
      .subscribe(cliente => {
        this.router.navigate([''])
        swal('Nuevo Cliente', `El cliente ${cliente.nombre} se ha creado con éxito!`, 'success')
      },
        err => {
          this.errores = err.error.errors as string[];
        })
  }

  update(): void {
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente)
      .subscribe(json => {
        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `Cliente ${json.cliente.nombre} actualizado con éxito!`, 'success')
      },
        err => {
          this.errores = err.error.errors as string[];
        })
  }

  compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false : o1.id === o2.id;
  }
}
