import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserGridComponent } from './user-grid.component';
import { UserService } from 'src/app/core/services/user.service';
import { of, throwError } from 'rxjs';
import { User } from '../../../core/models/user.model';

describe('UserGridComponent', () => {

  let component: UserGridComponent;
  let fixture: ComponentFixture<UserGridComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    {
      id: 1,
      firstName: 'Ashwini',
      lastName: 'Kumar',
      email: 'ash@example.com',
      ssn: '123',
      age: 25,
      image: '',
      role: 'admin'
    }
  ];

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getAllUsers']);

    await TestBed.configureTestingModule({
      declarations: [UserGridComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGridComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all users on init', () => {
    userServiceMock.getAllUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(userServiceMock.getAllUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should update user list after successful API call', () => {
    userServiceMock.getAllUsers.and.returnValue(of(mockUsers));

    component.loadAllUsers();

    expect(component.users).toEqual(mockUsers);
    expect(component.loading).toBeFalse();
  });

  it('should handle error while loading users', () => {
    userServiceMock.getAllUsers.and.returnValue(
      throwError(() => new Error('API Failed'))
    );

    spyOn(console, 'error');

    component.loadAllUsers();

    expect(component.loading).toBeFalse();
    expect(component.users.length).toBe(0);
    expect(console.error).toHaveBeenCalled();
  });
});
