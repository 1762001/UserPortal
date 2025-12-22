import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { UserService } from 'src/app/core/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/user.model';

describe('UserDetailsComponent', () => {

  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let userServiceMock: any;

  const mockUser: User = {
    id: 1,
    firstName: 'Ashwini',
    lastName: 'Kumar',
    email: 'ash@example.com',
    ssn: '123-567',
    age: 25,
    image: 'https://dummy.com/user.png',
    role: 'admin'
  };

  beforeEach(waitForAsync(() => {
    userServiceMock = {
      getUserById: jasmine.createSpy('getUserById')
    };

    TestBed.configureTestingModule({
      declarations: [UserDetailsComponent],
      imports: [CommonModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map([['id', '1']])
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user details when valid ID exists', () => {
    userServiceMock.getUserById.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
    expect(component.user).toEqual(mockUser);
    expect(userServiceMock.getUserById).toHaveBeenCalledOnceWith(1);
  });

  it('should handle error if user fetch fails', () => {
    userServiceMock.getUserById.and.returnValue(throwError(() => new Error('API Error')));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeTrue();
    expect(component.user).toBeUndefined();
    expect(userServiceMock.getUserById).toHaveBeenCalled();
  });

});
