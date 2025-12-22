import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component';
import { UserGridComponent } from './user-grid/user-grid.component';
import { HttpClientModule } from '@angular/common/http';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  { path: '', component: SearchPageComponent },
  { path: 'users/:id', component: UserDetailsComponent },
];

@NgModule({
  declarations: [SearchPageComponent, UserGridComponent, UserDetailsComponent],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule.forChild(routes)]
})
export class SearchModule {}
