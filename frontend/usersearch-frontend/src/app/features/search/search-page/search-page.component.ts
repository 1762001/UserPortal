import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  
  query = '';
  users: User[] = [];               
  filteredUsers: User[] = [];       
  roles: string[] = [];            
  selectedRole = '';
  ageSortAsc: boolean | null = null;
  loading = false;
  isMore = true;
  currentPage = 0;
  
  errorMsg = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {this.loadAllUsers();}

  loadAllUsers(page =0): void {
    this.loading = true;

    this.userService.getAllUsers(page).subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...data]; 
        this.populateRoles()
        this.isMore = data.length === 10;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.loading = false;
      }
    });
  }

  onSearchClick() {
    this.triggerSearch();
  }

  onEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter') this.triggerSearch();
  }

  private triggerSearch() {
    this.errorMsg = '';

    if (!this.query || this.query.trim().length < 3) {
      this.errorMsg = 'Enter at least 3 characters to search';
      return;
    }

    this.loading = true;

    this.userService.searchUsers(this.query.trim()).subscribe({
      next: (res) => {
        this.users = res || [];
        this.filteredUsers = [...this.users];
        this.populateRoles();
        this.applyClientFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to fetch users. Please try again later.';
        this.loading = false;
      }
    });
  }

  private populateRoles() {
    const set = new Set<string>();
    this.users.forEach(u => { if (u.role) set.add(u.role); });
    this.roles = Array.from(set).sort();
  }

  onRoleFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRole = selectElement.value;
    this.applyClientFilters();
  }

  toggleAgeSort() {
    if (this.ageSortAsc === null) this.ageSortAsc = true;
    else this.ageSortAsc = !this.ageSortAsc;

    this.applyClientFilters();
  }

  public applyClientFilters() {
    let list = [...this.users];

    if (this.selectedRole) {
      list = list.filter(u => u.role === this.selectedRole);
    }

    if (this.ageSortAsc !== null) {
      list.sort((a, b) => {
        const aAge = a.age ?? 0;
        const bAge = b.age ?? 0;
        return this.ageSortAsc ? aAge - bAge : bAge - aAge;
      });
    }

    this.filteredUsers = list;
  }

  clearAll() {
    this.selectedRole = '';
    this.ageSortAsc = null;
    this.errorMsg = '';

    this.filteredUsers = []; 
    if (this.users.length === 0) {
      this.users = [];
      this.filteredUsers = [];
        return;
      }
    this.loadAllUsers();
  }

  nextPage() {
    this.currentPage++;
    this.loadAllUsers(this.currentPage);
  }

  previousPage() {
    if(this.currentPage ===0) return;
    this.currentPage--;
    this.loadAllUsers(this.currentPage);
  }
}
