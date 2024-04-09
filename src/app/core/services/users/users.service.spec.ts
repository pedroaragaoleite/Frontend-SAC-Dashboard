import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { User } from '../../interfaces/user';


describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return an Observable of User on getUsers success', (done) => {
    const mockUsers: User[] = [
      { id_user: 1, username: 'John Doe', email: 'john.doe@example.com'}
    ]
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      done();
    });
  
    const req = httpMock.expectOne(`http://localhost:3000/api/users`); // Adjust this URL to match your getUsers() endpoint
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });  

  it('should return an Observable User on getOutboundUsers success', (done) => {
    const mockOutboundUser: User = 
      { id_user: 1, username: 'John Doe', email: 'john.doe@example.com' }
          
    
      
    service.getOutboundUsers().subscribe(user => {
      expect(user).toEqual(mockOutboundUser);
      done();
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/outbound`); // Adjust this URL to match your getUsers() endpoint
    expect(req.request.method).toBe('GET');
    req.flush(mockOutboundUser);
  });  
});
