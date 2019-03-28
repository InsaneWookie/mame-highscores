import { Component, OnInit } from '@angular/core';
import { Machine } from "../models/machine";
import { MachineService } from "../machine.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.scss']
})
export class MachineCreateComponent implements OnInit {

  machine: Machine ;
  constructor(private machineService: MachineService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.machine = new Machine();

    this.route.params.subscribe(params => {
      if(params.id) {
        this.getMachine(params.id);
      }
    });
  }

  onSubmit(){
    this.machineService.save(this.machine).subscribe(() => {
      this.router.navigate(['settings']);
    });
  }

  getMachine(machineId){
    this.machineService.getMachine(machineId).subscribe(m => this.machine = m)
  }

}
