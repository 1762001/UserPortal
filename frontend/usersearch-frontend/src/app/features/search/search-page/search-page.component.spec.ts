import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPageComponent } from './search-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { UserGridComponent } from '../user-grid/user-grid.component';
import { User } from '../../../core/models/user.model';

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    { id: 1, firstName: 'Alice', lastName: 'Brown', email: 'a@b.com', ssn: '111', age: 22, role: 'Admin', image: " " },
    { id: 2, firstName: 'Bob', lastName: 'Jones', email: 'b@b.com', ssn: '222', age: 30, role: 'User', image: " " }
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['searchUsers']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [SearchPageComponent, UserGridComponent],
      providers: [{ provide: UserService, useValue: mockUserService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not search if query is less than 3 characters', () => {
    component.query = 'ab';
    component.onSearchClick();
    expect(mockUserService.searchUsers).not.toHaveBeenCalled();
    expect(component.errorMsg).toContain('3 characters');
  });

  it('should call searchUsers when valid query is entered', () => {
    mockUserService.searchUsers.and.returnValue(of(mockUsers));
    component.query = 'Ali';
    component.onSearchClick();
    expect(mockUserService.searchUsers).toHaveBeenCalledWith('Ali');
    expect(component.users.length).toBe(2);
  });

  it('should show error if backend call fails', () => {
    mockUserService.searchUsers.and.returnValue(throwError(() => new Error('API error')));
    component.query = 'Ali';
    component.onSearchClick();
    expect(component.errorMsg).toContain('Failed to fetch users');
  });

  it('should filter users by selected role', () => {
    component.users = [...mockUsers];
    component.roles = ['Admin', 'User'];
    component.selectedRole = 'Admin';
    component.applyClientFilters();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].role).toBe('Admin');
  });

  it('should sort users by age ascending and descending', () => {
    component.users = [...mockUsers];
    component.ageSortAsc = true;
    component.applyClientFilters();
    expect(component.filteredUsers[0].firstName).toBe('Alice'); 

    component.ageSortAsc = false;
    component.applyClientFilters();
    expect(component.filteredUsers[0].firstName).toBe('Bob');
  });

  it('should load user on calling this.loadUsers()', () => {
      component.users =[...mockUsers];
      component.loadAllUsers();
      expect(component.users.length).toBe(2);
      expect(component.users[0].firstName).toBe('Alice');
  })

});
