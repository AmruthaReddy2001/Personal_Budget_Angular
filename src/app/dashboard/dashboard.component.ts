import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  chartLabels: string[] = [];
  chartData: any[] = [];
  chartColors: any[] = [];
  selectedMonth: any;
  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  constructor(private dataService: DataService){}

  ngOnInit(): void {
    this.populateData();
  }

  populateData(){
    // If there is no data stored in data service
    if(this.selectedMonth == undefined){
      this.selectedMonth = 5;
    }
    if (this.dataService.isBudgetDataEmpty()) {
      this.dataService.getBudgetData().subscribe((data: any) => {
        this.dataService.setBudgetData(data);
        let dataSource = this.dataService.getDataSource();
        this.populateLineChart();
        // Generating Pie Chart
        this.createPieChart(dataSource);
        this.createBarChart();
      });
    } // If data is already stored in data service
    else {
      // Checking for duplicated charts
      let dataSource = this.dataService.getDataSource();
      this.populateLineChart()
      this.createPieChart(dataSource);
      this.createBarChart();
    }
    this.modifyChartTitles();
  }

  modifyCharts(){
    this.modifyChartTitles();
    this.populateLineChart();
    this.createBarChart();
  }

  modifyChartTitles(){
    var selectedMonth = parseInt(this.selectedMonth);
    var selectedMonthName = this.monthNames[selectedMonth - 1];
    let barTitle = document.getElementById("barChartTitle");
    if(barTitle){
      barTitle.textContent = "Budget vs Expenses for " + selectedMonthName
    }
  }

  // Bar Chart
  createBarChart(){
    // console.log("Creating Bar chart");
    let chartStatus = Chart.getChart("barChart")
    if(chartStatus != undefined){
      chartStatus.destroy();
    }
    const categories = this.dataService.getCategories();
    const budgetData = this.dataService.getStoredBudgetData();
    this.dataService.getExpenseData(this.selectedMonth).subscribe(expenseData => {
      // Populate labels
      this.chartLabels = categories;

      let monthlyExpense = [];
      for(let ele in categories){
        let def = 0;
        for(let d in expenseData){
          if(categories[ele] === expenseData[d].category){
            def = (expenseData[d].amount);
          }
        }
        monthlyExpense.push(def);
      }

      // Populate datasets
      this.chartData = [
        { 
          data: budgetData.map(item => item.budget), 
          label: 'Budget Amount',
          backgroundColor: "#FFA500"
        },
        { 
          data: monthlyExpense, 
          label: 'Expenses',
          backgroundColor: "#AA336A"
        }
      ];

      // Set colors
      this.chartColors = [
        { // Budget Amount
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255, 99, 132, 0.8)'
        },
        { // Expenses
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 0.8)'
        }
      ];

      var chrt = document.getElementById("barChart") as HTMLCanvasElement;
      var barChart = new Chart(chrt, {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: this.chartData
        }
      })
    });
  }

  // Line Chart Code
  populateLineChart(): void{
    let chartStatus = Chart.getChart("lineChart")
    if(chartStatus != undefined){
      chartStatus.destroy();
    }
    var ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    this.dataService.getUserExpense().subscribe(res => {
      let monthlyExpense = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for(let ele in res){
        monthlyExpense[res[ele].month - 1] += res[ele].amount;
      }
      var lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.monthNames,
          datasets: [{
            label: "Monthly Expenses",
            data: monthlyExpense,
            borderColor: "#32CD32",
            backgroundColor: "#32CD32"
          }]
        }
      });
    })
  }

  // Pie Chart Code
  createPieChart(dataSource: any){
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;

    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: dataSource
    });
  }

}
