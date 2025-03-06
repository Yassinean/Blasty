import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParkingService } from '../../../../core/services/parking.service';
import { PlaceService } from '../../../../core/services/place.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics.component.html',
    
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  @ViewChild('occupancyChart') occupancyChartRef!: ElementRef;
  
  // Charts
  revenueChart: Chart | null = null;
  occupancyChart: Chart | null = null;
  
  // Data
  selectedPeriod: string = 'month';
  totalRevenue: number = 0;
  revenueChange: number = 0;
  occupancyRate: number = 0;
  occupancyChange: number = 0;
  totalParkings: number = 0;
  parkingsChange: number = 0;
  totalPlaces: number = 0;
  placesChange: number = 0;
  
  // Parking performance data
  parkingPerformance: any[] = [];
  
  // Chart data
  revenueData: any[] = [];
  occupancyData: any[] = [];

  constructor(
    private parkingService: ParkingService,
    private placeService: PlaceService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  
  ngAfterViewInit(): void {
    // Initialize charts after view is initialized
    setTimeout(() => {
      this.initCharts();
    }, 500);
  }
  
  loadData(): void {
    // Load KPI data
    this.loadKPIData();
    
    // Load chart data
    this.loadChartData();
    
    // Load parking performance data
    this.loadParkingPerformance();
  }
  
  loadKPIData(): void {
    // In a real application, these would be API calls
    // For now, we'll use mock data
    this.totalRevenue = 24680.50;
    this.revenueChange = 12.5;
    this.occupancyRate = 78;
    this.occupancyChange = 5.2;
    this.totalParkings = 15;
    this.parkingsChange = 2;
    this.totalPlaces = 450;
    this.placesChange = 25;
  }
  
  loadChartData(): void {
    // Mock revenue data
    this.revenueData = [
      { date: '2023-01', value: 18500 },
      { date: '2023-02', value: 19200 },
      { date: '2023-03', value: 21000 },
      { date: '2023-04', value: 20500 },
      { date: '2023-05', value: 22300 },
      { date: '2023-06', value: 23100 },
      { date: '2023-07', value: 24680.50 }
    ];
    
    // Mock occupancy data
    this.occupancyData = [
      { date: '2023-01', value: 65 },
      { date: '2023-02', value: 68 },
      { date: '2023-03', value: 72 },
      { date: '2023-04', value: 70 },
      { date: '2023-05', value: 74 },
      { date: '2023-06', value: 76 },
      { date: '2023-07', value: 78 }
    ];
  }
  
  loadParkingPerformance(): void {
    // Mock parking performance data
    this.parkingPerformance = [
      { 
        name: 'Parking Central', 
        address: '123 Rue Principale', 
        capacity: 120, 
        occupancyRate: 85, 
        revenue: 8250.75, 
        status: 'open' 
      },
      { 
        name: 'Parking Gare', 
        address: '45 Avenue de la Gare', 
        capacity: 80, 
        occupancyRate: 92, 
        revenue: 6430.25, 
        status: 'open' 
      },
      { 
        name: 'Parking Marché', 
        address: '78 Place du Marché', 
        capacity: 60, 
        occupancyRate: 65, 
        revenue: 4120.50, 
        status: 'open' 
      },
      { 
        name: 'Parking Université', 
        address: '12 Boulevard des Étudiants', 
        capacity: 100, 
        occupancyRate: 75, 
        revenue: 5880.00, 
        status: 'maintenance' 
      },
      { 
        name: 'Parking Plage', 
        address: '34 Promenade des Sables', 
        capacity: 90, 
        occupancyRate: 0, 
        revenue: 0, 
        status: 'closed' 
      }
    ];
  }
  
  initCharts(): void {
    this.initRevenueChart();
    this.initOccupancyChart();
  }
  
  initRevenueChart(): void {
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    
    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    
    // Format data for chart
    const labels = this.revenueData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    });
    
    const data = this.revenueData.map(item => item.value);
    
    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenu (€)',
          data: data,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value as number);
              }
            }
          }
        }
      }
    });
  }
  
  initOccupancyChart(): void {
    if (this.occupancyChart) {
      this.occupancyChart.destroy();
    }
    
    const ctx = this.occupancyChartRef.nativeElement.getContext('2d');
    
    // Format data for chart
    const labels = this.occupancyData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    });
    
    const data = this.occupancyData.map(item => item.value);
    
    this.occupancyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Taux d'occupation (%)",
          data: data,
          backgroundColor: '#3B82F6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + '%';
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }
  
  updateCharts(): void {
    // In a real application, this would fetch new data based on the selected period
    // For this example, we'll just reinitialize the charts with the same data
    this.loadData();
    this.initCharts();
  }
  
  refreshData(): void {
    // Simulate data refresh
    this.loadData();
    this.initCharts();
  }
}