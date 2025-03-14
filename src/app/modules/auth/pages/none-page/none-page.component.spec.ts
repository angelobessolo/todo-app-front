import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonePageComponent } from './none-page.component';

describe('NonePageComponent', () => {
  let component: NonePageComponent;
  let fixture: ComponentFixture<NonePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
