import { Component, OnInit } from '@angular/core';
import { Machine } from "../models/machine";
import { MachineService } from "../machine.service";
import { Group } from "../models/group";
import { GroupService } from "../group.service";
import { tap } from "rxjs/operators";
import { sortBy } from 'lodash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  group: Group = new Group();
  machines: Machine[];

  host: string = '';

  constructor(
    private readonly machineService: MachineService,
    private readonly groupService: GroupService
  ) {
  }

  ngOnInit() {
    this.getMachines();
    this.getGroups();
    this.host = window.location.host;
  }

  getMachines() {
    this.machineService.getMachines().pipe(
      tap(results => {
        results.sort((a,b) => { return a.name.localeCompare(b.name) })
      })).subscribe(m => this.machines = m);
  }

  getGroups() {
    return this.groupService.getGroup().subscribe(g => this.group = g)
  }

}
