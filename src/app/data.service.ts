import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://165.227.117.225:3000/api/';
  private budgetData: any[] = [];
  private dataSource = {
    labels: [''],
    datasets:[
        {
            data: [''],
            backgroundColor: [''],
        }
    ]
  };

  constructor(private http: HttpClient) { }

  populateDataSource(data: any): void{
    for(var i = 0; i < data.length; i++){
      this.dataSource.datasets[0].data[i] = data[i].budget;
      this.dataSource.labels[i] = data[i].title;
      this.dataSource.datasets[0].backgroundColor[i] = data[i].color;
    }
  }

  setBudgetData(data: any[]): void {
    this.budgetData = data;
    this.populateDataSource(data);
  }

  removeData(): void {
    this.dataSource = {
      labels: [''],
      datasets:[
          {
              data: [''],
              backgroundColor: [''],
          }
      ]
    }
    this.budgetData = []
  }
  
  getUserExpense(): Observable<any>{
    const username = localStorage.getItem('username');
    return this.http.get(this.apiUrl + "expense/" + username);
  }
  
  getBudgetData(): Observable<any> {
    const username = localStorage.getItem("username");
    return this.http.get(this.apiUrl + "budget/" + username);
  }

  getExpenseData(month: any): Observable<any> {
    const username = localStorage.getItem('username');
    return this.http.get(this.apiUrl + "expense/" + username + "/" + month);
  }

  addBudget(data: any): Observable<any>{
    data.username = localStorage.getItem("username");
    return this.http.post(this.apiUrl + "budget", data);
  }

  addExpense(data: any): Observable<any>{
    data.username = localStorage.getItem("username")
    return this.http.post(this.apiUrl + "expense", data);
  }

  getCategories(): any[]{
    return this.dataSource.labels;
  }

  getDataSource(): any{
    return this.dataSource;
  }

  getStoredBudgetData(): any[] {
    return this.budgetData;
  }

  isBudgetDataEmpty(): boolean {
    return this.budgetData.length === 0;
  }

  getBudget(): Observable<any> {
    return this.http.get(this.apiUrl + "budget");
  }
}
