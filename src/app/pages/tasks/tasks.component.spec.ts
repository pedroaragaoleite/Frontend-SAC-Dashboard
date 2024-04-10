import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TasksComponent } from './tasks.component';
import { TodoService } from '../../core/services/todo/todo.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TasksComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        TodoService,
        ChangeDetectorRef
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call getTasks and getUsers on ngOnInit', () => {
  //   spyOn(component, 'getTasks');
  //   spyOn(component, 'getUsers');


  //   component.ngOnInit();

  //   expect(component.getTasks).toHaveBeenCalled();
  //   expect(component.getUsers).toHaveBeenCalled();

  // });

  // it('should fetch tasks and populate related arrays on getTasks call', () => {
  //   const mockTasks = [
  //     { id_todo: 1, title: 'Call customer', assigned_date: new Date(), due_date: new Date(), status: 'new', priority: 'high',
  //     user_id: 1, customer_id: 1},
  //     { id_todo: 1, title: 'Call customer', assigned_date: new Date(), due_date: new Date(), status: 'new', priority: 'high',
  //     user_id: 1, customer_id: 1 }
  //   ];
  //   spyOn(todoService, 'getTodos').and.returnValue(of( mockTasks ));

  //   component.getTasks();

  //   expect(component.tasks.length).toBe(2);
  //   expect(component.importantTasks.length).toBe(1);
  //   expect(component.newTasks.length).toBe(1);
  // });

});
