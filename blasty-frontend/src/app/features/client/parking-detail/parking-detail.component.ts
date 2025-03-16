import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { PlaceResponse } from "../../../core/models/place.model"
import { PlaceService } from "../../../core/services/place.service"
import { ParkingService } from "../../../core/services/parking.service"
import { ParkingResponse } from "../../../core/models/parking.model"
import { ToastService } from "../../../core/services/toast.service"

@Component({
  selector: "app-parking-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./parking-detail.component.html",
})
export class ParkingDetailComponent implements OnInit {
  parkingId: number | null = null
  parking: ParkingResponse | null = null
  places: PlaceResponse[] = []
  filteredPlaces: PlaceResponse[] = []
  isLoading = false
  filterType = ""
  filterStatus = ""
  selectedPlace: PlaceResponse | null = null
  showBookingModal = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parkingService: ParkingService,
    private placeService: PlaceService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.parkingId = +id
        this.loadParking()
      } else {
        this.toastService.showError('error',"ID de parking non trouvé")
        this.goBackToDashboard()
      }
    })
  }

  loadParking(): void {
    if (!this.parkingId) return

    this.isLoading = true
    this.parkingService.getParkingById(this.parkingId).subscribe({
      next: (data) => {
        this.parking = data
        this.loadPlaces()
      },
      error: (error) => {
        this.toastService.showError('error',"Erreur lors du chargement du parking")
        console.error("Error loading parking:", error)
        this.isLoading = false
        this.goBackToDashboard()
      },
    })
  }

  // Update the loadPlaces method to properly handle the API response
  loadPlaces(): void {
    if (!this.parkingId) return

    this.placeService.getPlacesByParkingId(this.parkingId).subscribe({
      next: (data) => {
        console.log("Places data received:", data) // Debug log
        this.places = data
        this.filteredPlaces = [...this.places] // Initialize filtered places with all places
        this.isLoading = false
      },
      error: (error) => {
        this.toastService.showError('error',"Erreur lors du chargement des places")
        console.error("Error loading places:", error)
        this.isLoading = false
      },
    })
  }

  // Update the filterPlaces method to ensure it's working correctly
  filterPlaces(): void {
    console.log("Filtering places. Total places:", this.places.length)
    console.log("Filter type:", this.filterType)
    console.log("Filter status:", this.filterStatus)

    let filtered = [...this.places]

    if (this.filterType) {
      filtered = filtered.filter((place) => place.type === this.filterType)
    }

    if (this.filterStatus) {
      filtered = filtered.filter((place) => place.etat === this.filterStatus)
    }

    console.log("Filtered places count:", filtered.length)
    this.filteredPlaces = filtered
  }

  // Update the selectPlace method to use the correct status property
  selectPlace(place: PlaceResponse): void {
    console.log("Selected place:", place)
    if (place.etat === "DISPONIBLE") {
      this.selectedPlace = place
      this.showBookingModal = true
    } else {
      this.toastService.showInfo('info',"Cette place n'est pas disponible")
    }
  }

  bookPlace(): void {
    // This will be implemented when we add the reservation functionality
    this.toastService.showInfo('info',"La réservation sera implémentée dans la prochaine étape")
    this.showBookingModal = false
  }

  closeBookingModal(): void {
    this.showBookingModal = false
    this.selectedPlace = null
  }

  goBackToDashboard(): void {
    this.router.navigate(["/client/dashboard"])
  }

  getTypeClass(type: string): string {
    switch (type) {
      case "STANDARD":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "HANDICAPE":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "VIP":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "DISPONIBLE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "RESERVEE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "OCCUPEE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case "STANDARD":
        return "Standard"
      case "HANDICAPE":
        return "Handicapé"
      case "VIP":
        return "VIP"
      default:
        return type
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "DISPONIBLE":
        return "Disponible"
      case "RESERVEE":
        return "Réservée"
      case "OCCUPEE":
        return "Occupée"
      default:
        return status
    }
  }

  getPlaceIcon(type: string): string {
    switch (type) {
      case "HANDICAPE":
        return `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12h6" />
            <path d="M12 9v6" />
          </svg>
        `
      case "VIP":
        return `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        `
      default:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
          </svg>
        `
    }
  }
}

