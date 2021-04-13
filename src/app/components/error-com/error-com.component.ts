import { Component, Input, OnInit } from '@angular/core';
import { ErrorCom } from 'src/app/models/ErrorCom';

@Component({
  selector: 'app-error-com',
  templateUrl: './error-com.component.html',
  styleUrls: ['./error-com.component.scss']
})
export class ErrorComComponent implements OnInit {

  @Input() error: ErrorCom = new ErrorCom();

  constructor() { }

  ngOnInit(): void {
  }

}
