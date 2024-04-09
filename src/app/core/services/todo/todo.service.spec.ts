import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TodoService } from './todo.service';
import { Todo } from '../../interfaces/todo';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable of Todos on getTodos success', (done) => {
    const mockTodos: Todo[] = [
      { id_todo: 1, title: 'Call customer', assigned_date: new Date(), due_date: new Date(), status: 'new', priority: 'high',
        user_id: 1, customer_id: 1
      }
    ]
    
    service.getTodos().subscribe(todos => {
      expect(todos).toEqual(mockTodos);
      done();
    });
  
    const req = httpMock.expectOne(`http://localhost:3000/api/todos`); // Adjust this URL to match your getUsers() endpoint
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });  
});


