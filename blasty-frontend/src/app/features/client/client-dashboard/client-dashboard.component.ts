import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ParkingResponse, ParkingStatus } from "../../../core/models/parking.model"
import { ParkingService } from "../../../core/services/parking.service"
import { ToastService } from "../../../core/services/toast.service"

@Component({
  selector: "app-client-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./client-dashboard.component.html",
})
export class ClientDashboardComponent implements OnInit {
  parkings: ParkingResponse[] = []
  filteredParkings: ParkingResponse[] = []
  isLoading = false
  searchTerm = ""
  filterStatus = ""

  constructor(
    private parkingService: ParkingService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadParkings()
  }

  loadParkings(): void {
    this.isLoading = true
    this.parkingService.getAllParkings().subscribe({
      next: (data) => {
        this.parkings = data
        this.filterParkings()
        this.isLoading = false
      },
      error: (error) => {
        this.toastService.showToast('error',"Erreur lors du chargement des parkings")
        console.error("Error loading parkings:", error)
        this.isLoading = false
      },
    })
  }

  filterParkings(): void {
    let filtered = [...this.parkings]

    // Filter by search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (parking) => parking.name.toLowerCase().includes(search) || parking.address.toLowerCase().includes(search),
      )
    }

    // Filter by status
    if (this.filterStatus) {
      filtered = filtered.filter((parking) => parking.status === this.filterStatus)
    } else {
      // By default, only show open parkings
      filtered = filtered.filter((parking) => parking.status === ParkingStatus.OPEN)
    }

    this.filteredParkings = filtered
  }

  getAvailablePlaces(parkingId: number): void {
    this.parkingService.getAvailablePlaces(parkingId).subscribe({
      next: (count) => {
        // Find the parking and update its available places count
        const parking = this.parkings.find((p) => p.id === parkingId)
        if (parking) {
          count = parking.capacity - parking.occupiedSpaces 
        }
      },
      error: (error) => {
        console.error("Error getting available places:", error)
      },
    })
  }

  getStatusClass(status: ParkingStatus): string {
    switch (status) {
      case ParkingStatus.OPEN:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case ParkingStatus.CLOSED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case ParkingStatus.MAINTENANCE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  getStatusLabel(status: ParkingStatus): string {
    switch (status) {
      case ParkingStatus.OPEN:
        return "Ouvert"
      case ParkingStatus.CLOSED:
        return "Fermé"
      case ParkingStatus.MAINTENANCE:
        return "Maintenance"
      default:
        return "Inconnu"
    }
  }

  getOccupancyPercentage(parking: ParkingResponse): number {
    if (!parking.capacity) return 0
    return (parking.occupiedSpaces / parking.capacity) * 100
  }

  getOccupancyClass(percentage: number): string {
    if (percentage < 70) return "bg-green-500"
    if (percentage < 90) return "bg-yellow-500"
    return "bg-red-500"
  }

  refreshData(): void {
    this.loadParkings()
  }
}

