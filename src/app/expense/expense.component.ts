import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { timer } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  @ViewChild('expense') expenseForm!: NgForm;

  categories: any = [];
  errorMessage !: string;
  successMessage !: string;
  showError : boolean = false;
  showSuccess: boolean = false;

  months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  constructor(private dataService: DataService){}

  ngOnInit(): void {
    if(this.dataService.isBudgetDataEmpty()){
      this.dataService.getBudgetData().subscribe((data: any) => {
        this.dataService.setBudgetData(data);
        this.categories = this.dataService.getCategories();
      });
    }
    else{
      this.categories = this.dataService.getCategories();
    }
    // console.log(this.categories);
  }

  async onSubmit(data: any){
    const expense = {
      "category": data.category,
      "amount": data.expense,
      "month": this.months.indexOf(data.month) + 1
    }
    this.dataService.addExpense(expense).subscribe(res => {
      if(res.status){
        this.successMessage = res.status;
        this.DisplaySuccess(5000);
        this.resetForm();
      }
      else{
        this.errorMessage = res.message;
        this.DisplayError(5000);
      }
    })
  }

  DisplayError(duration: number) {
    this.showError = true;
    timer(duration).subscribe(() => {
      this.showError = false;
    });
  }

  DisplaySuccess(duration: number){
    this.showSuccess = true;
    timer(duration).subscribe(() => {
      this.showSuccess = false;
    });
  }

  resetForm(): void {
    this.expenseForm.resetForm();
  }

}
