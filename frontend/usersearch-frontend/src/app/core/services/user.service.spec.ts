import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { environment } from '../../../enviroments/enviroment';



describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call backend API for searchUsers()', () => {
    const mockUsers: User[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@x.com', ssn: '1234', age: 30, role: 'Admin', image: " " }
    ];

    service.searchUsers('John').subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].firstName).toBe('John');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/search?query=John`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should call backend API for getAllUsers()', () => {
    const mockUsers: User[] = [
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@x.com', ssn: '5678', age: 25, role: 'User', image: " " }
    ];

    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].email).toBe('jane@x.com');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/allusers`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
