import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  form: Object = {
    email: ''
  };

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {

  }
}
