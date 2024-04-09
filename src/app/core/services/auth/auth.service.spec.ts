import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user and return it', () => {
    const newUser = { username: 'testUser', email: 'test@example.com', password: '123456Ab', role: 'supervisor' };
  
    service.registerUser(newUser).subscribe(user => {
      expect(user).toEqual(newUser);
    });
  
    const req = httpMock.expectOne(`http://localhost:3000/api/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(newUser);
  });

  it('should update a user and return it', () => {
    const updateUser = { username: 'testUser', email: 'test@example.com', role: 'supervisor' };
  
    service.registerUser(updateUser).subscribe(user => {
      expect(user).toEqual(updateUser);
    });
  
    const req = httpMock.expectOne(`http://localhost:3000/api/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(updateUser);
    req.flush(updateUser);
  });

  it('should delete a user and return a confirmation', () => {
    const userToDelete = { id_user: '1' }; 
    const deletionResponse = { message: 'User deleted' };
  
    service.deleteUser(userToDelete).subscribe(response => {
      expect(response).toEqual(deletionResponse);
    });
  
    const req = httpMock.expectOne(`http://localhost:3000/api/delete/${userToDelete.id_user}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(deletionResponse);
  });


});
