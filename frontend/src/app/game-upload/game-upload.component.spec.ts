import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameUploadComponent } from './game-upload.component';

describe('GameUploadComponent', () => {
  let component: GameUploadComponent;
  let fixture: ComponentFixture<GameUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
