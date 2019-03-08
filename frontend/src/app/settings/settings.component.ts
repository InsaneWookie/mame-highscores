import { Component, OnInit } from '@angular/core';
import { Machine } from "../models/machine";
import { MachineService } from "../machine.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  machines: Machine[];

  constructor(private readonly machineService: MachineService) { }

  ngOnInit() {
    this.getMachines();
  }

  getMachines(){
    this.machineService.getMachines().subscribe(m => this.machines = m);
  }

}
