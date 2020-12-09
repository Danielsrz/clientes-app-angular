import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent implements OnInit {

  listaCurso: string[] = ['Typescript', 'Javascript', 'Java', 'C#', 'Python'];
  habilitar: boolean = true;
  setHabilitar(): void {
    this.habilitar = (this.habilitar == true) ? false : true;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
