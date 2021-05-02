import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiningComponent } from './mining/mining.component';

const routes: Routes = [
  { path: '', component: MiningComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
