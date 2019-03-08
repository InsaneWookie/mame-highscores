import { Component, OnInit } from '@angular/core';
import { Machine } from "../models/machine";
import { MachineService } from "../machine.service";

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.scss']
})
export class MachineCreateComponent implements OnInit {

  machine: Machine ;
  constructor(private machineService: MachineService) { }

  ngOnInit() {
    this.machine = new Machine();
  }

  onSubmit(){
    this.machineService.save(this.machine).subscribe();
  }

}
