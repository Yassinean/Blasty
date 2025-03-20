import { Component, type OnInit, type AfterViewInit, ViewChild, type ElementRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ParkingService } from "../../../../core/services/parking.service"
import { PlaceService } from "../../../../core/services/place.service"
import { ToastService } from "../../../../core/services/toast.service"
import { Chart, registerables } from "chart.js"
import {
  type ParkingOccupancyResponse,
  type ParkingRevenueResponse,
  ParkingStatus,
} from "../../../../core/models/parking.model"
import { FilterPipe } from "../../../../shared/pipes/filter.pipe"

// Register Chart.js components
Chart.register(...registerables)

// Update the imports array to include FilterPipe
@Component({
  selector: "app-statistics",
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: "./statistics.component.html",
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild("revenueChart") revenueChartRef!: ElementRef
  @ViewChild("occupancyChart") occupancyChartRef!: ElementRef

  // Charts
  revenueChart: Chart | null = null
  occupancyChart: Chart | null = null

  // Data
  selectedPeriod = "month"
  totalRevenue = 0
  revenueChange = 0
  occupancyRate = 0
  occupancyChange = 0
  totalParkings = 0
  parkingsChange = 0
  totalPlaces = 0
  placesChange = 0

  // Parking performance data
  parkingPerformance: any[] = []

  // Chart data
  revenueData: ParkingRevenueResponse[] = []
  occupancyData: ParkingOccupancyResponse[] = []

  // Loading states
  isLoading = false

  // Add these properties to the class
  selectedParking: any = null
  parkings: any[] = []
  viewMode: "occupancy" | "revenue" = "occupancy"

  constructor(
    private parkingService: ParkingService,
    private placeService: PlaceService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  ngAfterViewInit(): void {
    // Initialize charts after view is initialized
    setTimeout(() => {
      this.initCharts()
    }, 500)
  }

  loadData(): void {
    this.isLoading = true

    // Load all parkings to get total count and capacity
    this.parkingService.getAllParkings().subscribe({
      next: (parkings) => {
        this.parkings = parkings
        this.totalParkings = parkings.length

        // Calculate total places from all parkings
        this.totalPlaces = parkings.reduce((total, parking) => total + parking.capacity, 0)

        // Load occupancy data for all parkings
        this.loadOccupancyData()

        // Load revenue data for all parkings
        this.loadRevenueData()

        this.isLoading = false
      },
      error: (error) => {
        this.toastService.showToast('error',"Erreur lors du chargement des données des parkings")
        console.error("Error loading parkings:", error)
        this.isLoading = false
      },
    })
  }

  loadOccupancyData(): void {
    this.parkingService.getAllParkingsOccupancy().subscribe({
      next: (data) => {
        this.occupancyData = data

        // Calculate average occupancy rate
        if (this.occupancyData.length > 0) {
          this.occupancyRate = Math.round(
            this.occupancyData.reduce((sum, item) => sum + item.occupancyRate, 0) / this.occupancyData.length,
          )

          // For now, set a random change percentage (in a real app, you'd compare with previous period)
          this.occupancyChange = +(Math.random() * 10 - 5).toFixed(1)
        }

        // Update the occupancy chart
        if (this.occupancyChart) {
          this.initOccupancyChart()
        }

        // Update parking performance data
        this.updateParkingPerformance()
      },
      error: (error) => {
        this.toastService.showToast('error',"Erreur lors du chargement des données d'occupation")
        console.error("Error loading occupancy data:", error)
      },
    })
  }

  loadRevenueData(): void {
    this.parkingService.getAllParkingsRevenue(this.selectedPeriod).subscribe({
      next: (data) => {
        this.revenueData = data

        // Calculate total revenue
        this.totalRevenue = this.revenueData.reduce((sum, item) => sum + item.totalRevenue, 0)

        // For now, set a random change percentage (in a real app, you'd compare with previous period)
        this.revenueChange = +(Math.random() * 15 - 5).toFixed(1)

        // Update the revenue chart
        if (this.revenueChart) {
          this.initRevenueChart()
        }

        // Update parking performance data
        this.updateParkingPerformance()
      },
      error: (error) => {
        this.toastService.showToast('error',"Erreur lors du chargement des données de revenus")
        console.error("Error loading revenue data:", error)
      },
    })
  }

  updateParkingPerformance(): void {
    if (!this.parkings || !this.occupancyData || !this.revenueData) return

    // Map parkings to performance data
    this.parkingPerformance = this.parkings.map((parking) => {
      // Find occupancy data for this parking
      const occupancyData = this.occupancyData.find((o) => o.parkingId === parking.id)

      // Find revenue data for this parking
      const revenueData = this.revenueData.find((r) => r.parkingId === parking.id)

      return {
        id: parking.id,
        name: parking.name,
        address: parking.address,
        capacity: parking.capacity,
        occupancyRate: occupancyData ? occupancyData.occupancyRate : 0,
        revenue: revenueData ? revenueData.totalRevenue : 0,
        status: this.mapParkingStatus(parking.status),
      }
    })
  }

  mapParkingStatus(status: ParkingStatus): string {
    switch (status) {
      case ParkingStatus.OPEN:
        return "open"
      case ParkingStatus.CLOSED:
        return "closed"
      case ParkingStatus.MAINTENANCE:
        return "maintenance"
      default:
        return "unknown"
    }
  }

  initCharts(): void {
    this.initRevenueChart()
    this.initOccupancyChart()
  }

  initRevenueChart(): void {
    if (this.revenueChart) {
      this.revenueChart.destroy()
    }

    if (!this.revenueChartRef) return

    const ctx = this.revenueChartRef.nativeElement.getContext("2d")

    // Group revenue data by parking name
    const parkingNames = [...new Set(this.revenueData.map((item) => item.parkingName))]

    // Create datasets for each parking
    const datasets = parkingNames.map((parkingName, index) => {
      const parkingData = this.revenueData.filter((item) => item.parkingName === parkingName)

      // Generate a color based on index
      const hue = (index * 137) % 360 // Use golden ratio to spread colors

      return {
        label: parkingName,
        data: parkingData.map((item) => item.totalRevenue),
        borderColor: `hsl(${hue}, 70%, 50%)`,
        backgroundColor: `hsla(${hue}, 70%, 50%, 0.1)`,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      }
    })

    // If no data, show a placeholder
    if (datasets.length === 0) {
      datasets.push({
        label: "Aucune donnée",
        data: [0],
        borderColor: "#ccc",
        backgroundColor: "rgba(0,0,0,0.05)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      })
    }

    this.revenueChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.getPeriodLabels(),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD" }).format(
                    context.parsed.y,
                  )
                }
                return label
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD" }).format(value as number),
            },
          },
        },
      },
    })
  }

  initOccupancyChart(): void {
    if (this.occupancyChart) {
      this.occupancyChart.destroy()
    }

    if (!this.occupancyChartRef) return

    const ctx = this.occupancyChartRef.nativeElement.getContext("2d")

    // Group occupancy data by parking name
    const parkingNames = [...new Set(this.occupancyData.map((item) => item.parkingName))]

    // Create datasets for each parking
    const datasets = parkingNames.map((parkingName, index) => {
      const parkingData = this.occupancyData.filter((item) => item.parkingName === parkingName)

      // Generate a color based on index
      const hue = (index * 137) % 360 // Use golden ratio to spread colors

      return {
        label: parkingName,
        data: parkingData.map((item) => item.occupancyRate),
        backgroundColor: `hsl(${hue}, 70%, 50%)`,
        borderRadius: 4,
      }
    })

    // If no data, show a placeholder
    if (datasets.length === 0) {
      datasets.push({
        label: "Aucune donnée",
        data: [0],
        backgroundColor: "#ccc",
        borderRadius: 4,
      })
    }

    this.occupancyChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.getPeriodLabels(),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(1) + "%"
                }
                return label
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + "%",
            },
          },
        },
      },
    })
  }

  getPeriodLabels(): string[] {
    const now = new Date()
    const labels: string[] = []

    switch (this.selectedPeriod) {
      case "day":
        // Last 24 hours in 3-hour intervals
        for (let i = 0; i < 8; i++) {
          const date = new Date(now)
          date.setHours(now.getHours() - (7 - i) * 3)
          labels.push(date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))
        }
        break

      case "week":
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(now.getDate() - i)
          labels.push(date.toLocaleDateString("fr-FR", { weekday: "short" }))
        }
        break

      case "month":
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(now.getDate() - i * 7)
          labels.push(`Sem. ${this.getWeekNumber(date)}`)
        }
        break

      case "year":
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now)
          date.setMonth(now.getMonth() - i)
          labels.push(date.toLocaleDateString("fr-FR", { month: "short" }))
        }
        break
    }

    return labels
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  updateCharts(): void {
    // Reload data with the new period
    this.loadData()
  }

  refreshData(): void {
    this.loadData()
  }

  // Helper method to format currency
  formatCurrency(value: number): string {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value)
  }
}

