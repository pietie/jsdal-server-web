import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { L2 } from 'l2-lib/dist/L2';
import { retry } from 'rxjs';

@Component({
  selector: 'app-add-edit-policy-dialog',
  templateUrl: './add-edit-policy-dialog.component.html',
  styleUrls: ['./add-edit-policy-dialog.component.css']
})
export class AddEditPolicyDialogComponent implements OnInit {

  data: {
    Name?: string, Enabled: boolean, Default: boolean, CommandTimeoutInSeconds: number,
    DeadlockRetry: { Enabled: boolean, MaxRetries?: number, Type?: 'Linear' | 'Exponential', Value?: number }

  } = {
      Enabled: true,
      Default: false,
      CommandTimeoutInSeconds: 60,
      DeadlockRetry: {
        Enabled: false
      }
    };

  public chartDataSets: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Retry 1'
    ],
    datasets: [
      {
        data: [0],
        label: 'Seconds',
        fill: false,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ],

  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: false,
    plugins: {
      legend: { display: false }
    }
  };


  constructor(public dialogRef: MatDialogRef<AddEditPolicyDialogComponent>) { }

  ngOnInit(): void {
    //Chart.defaults.plugins.legend.display =false;
  }

  updateChart() {
    try {
      console.log("updateChart");
      if (!this.data?.DeadlockRetry?.Enabled) return;

      if (this.data.DeadlockRetry.MaxRetries == null) {
        this.data.DeadlockRetry.MaxRetries = 3;
      }

      if (this.data.DeadlockRetry.Type == null) {
        this.data.DeadlockRetry.Type = 'Linear';
      }

      if (this.data.DeadlockRetry.Value == null) {
        this.data.DeadlockRetry.Value = 2;
      }

      let maxTries = parseInt(<any>this.data.DeadlockRetry.MaxRetries);

      this.chartDataSets.labels = Array.from({ length: maxTries }, (x, i) => `Retry ${i + 1}`);

      this.chartDataSets.datasets[0].data = Array.from({ length: maxTries }, (x, i) => {
        if (this.data.DeadlockRetry.Type == 'Linear') {
          return i * this.data.DeadlockRetry.Value;
        }
        else if (this.data.DeadlockRetry.Type == 'Exponential') {
          return Math.pow(this.data.DeadlockRetry.Value, i + 1);
        }
      });

      this.chartDataSets = { ...this.chartDataSets };
    } catch (e) {
      L2.handleException(e);
    }
  }

  ok() {
    try {

      if (this.data.Name == null || this.data.Name.trim() == "") {
        L2.exclamation("Please enter a name.");
        return;
      }

      if (this.data.CommandTimeoutInSeconds == null) {
        L2.exclamation("Please provide a command timeout value.");
        return;
      }

      let deadlockEnabled = this.data.Enabled && this.data.DeadlockRetry?.Enabled;

      if (deadlockEnabled) {
        if (this.data.DeadlockRetry.MaxRetries == null) {
          L2.exclamation("Please provide a max retries value for the deadlock section.");
          return;
        }

        if (this.data.DeadlockRetry.Value == null) {
          L2.exclamation("Please provide a Base/Delay value for the deadlock section.");
          return;
        }
      }

      alert("TODO: Implement");

    } catch (e) {
      L2.handleException(e);
    }
  }

}
