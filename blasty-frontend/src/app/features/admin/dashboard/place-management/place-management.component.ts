import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { PlaceService } from "../../../../core/services/place.service"
import { PlaceResponse, PlaceRequest, PlaceStatus, PlaceType } from "../../../../core/models/place.model"
import { switchMap, tap, catchError } from "rxjs/operators"
import { of } from "rxjs"
import { ParkingService } from "../../../../core/services/parking.service"
import { ToastService } from "../../../../core/services/toast.service"

@Component({
  selector: "app-place-management",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./place-management.component.html",
  styleUrls: ["./place-management.component.css"],
})
export class PlaceManagementComponent implements OnInit {
  parkingId!: number
  parkingName = ""
  places: PlaceResponse[] = []
  filteredPlaces: PlaceResponse[] = []
  placeForm!: FormGroup
  isLoading = false

  selectedPlace: PlaceResponse | null = null
  isEditMode = false
  showForm = false
  filterStatus = "ALL"
  filterType = "ALL"

  placeTypes = Object.values(PlaceType)
  placeStatuses = Object.values(PlaceStatus)
  placeStatus = PlaceStatus

  constructor(
    private placeService: PlaceService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private parkingService: ParkingService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.loadParkingAndPlaces()
  }

  loadParkingAndPlaces(): void {
    this.isLoading = true
    console.log(this.parkingId); // here the id undefind
    
    this.route.params
      .pipe(
        switchMap((params) => {
          this.parkingId = +params['id']
          console.log("Parking ID from route:", this.parkingId) // here Nan
          if (isNaN(this.parkingId)) {
            throw new Error("Invalid parking ID")
          }
          // First get the parking details to get the name
          return this.parkingService.getParkingById(this.parkingId)
        }),
        tap((parking) => {
          console.log("Parking Details:", parking)
          if (parking) {
            this.parkingName = parking.name || `Parking #${this.parkingId}`
          }
        }),
        catchError((error) => {
          console.error("Error loading parking details:", error)
          this.toastService.showError("Error", "Failed to load parking details")
          return of(null)
        }),
        // Only proceed to fetch places if we got a valid parking
        switchMap((parking) => {
          if (!parking) return of([])
          console.log("Fetching places for parking ID:", this.parkingId)
          // Get places specifically for this parking ID
          return this.placeService.getAllPlaces()
        }),
        tap((places) => {
          console.log("All Places fetched:", places)
          // Filter places by parking ID
          this.places = places.filter((place) => {
            const match = place.parkingId === this.parkingId
            console.log(`Place ${place.id} parkingId: ${place.parkingId}, match: ${match}`)
            return match
          })
          console.log("Filtered Places for this parking:", this.places)
          this.applyFilters()
        }),
        catchError((error) => {
          console.error("Error loading places:", error)
          this.toastService.showError("Error", "Failed to load places")
          return of([])
        }),
      )
      .subscribe({
        next: () => {
          this.isLoading = false
          console.log("Final places array:", this.places)
          console.log("Final filtered places array:", this.filteredPlaces)
        },
        error: (err) => {
          console.error("Subscription error:", err)
          this.isLoading = false
          this.toastService.showError("Error", "An unexpected error occurred")
        },
      })
  }

  initForm(place?: PlaceResponse): void {
    this.placeForm = this.fb.group({
      numero: [place?.numero || "", [Validators.required]],
      type: [place?.type || PlaceType.STANDARD, [Validators.required]],
      tarifHoraire: [place?.tarifHoraire || 0, [Validators.required, Validators.min(0)]],
    })
  }

  applyFilters(): void {
    console.log("Applying filters. Current places:", this.places)
    this.filteredPlaces = this.places.filter((place) => {
      const matchesStatus = this.filterStatus === "ALL" ? true : place.etat === this.filterStatus

      const matchesType = this.filterType === "ALL" ? true : place.type === this.filterType

      return matchesStatus && matchesType
    })
    console.log("Filtered places after applying filters:", this.filteredPlaces)
  }

  openAddForm(): void {
    this.isEditMode = false
    this.selectedPlace = null
    this.initForm()
    this.showForm = true
  }

  openEditForm(place: PlaceResponse): void {
    this.isEditMode = true
    this.selectedPlace = place
    this.initForm(place)
    this.showForm = true
  }

  closeForm(): void {
    this.showForm = false
    this.selectedPlace = null
  }

  submitForm(): void {
    if (this.placeForm.invalid) return

    const placeRequest: PlaceRequest = {
      numero: this.placeForm.value.numero,
      type: this.placeForm.value.type,
      tarifHoraire: this.placeForm.value.tarifHoraire,
    }

    if (this.isEditMode && this.selectedPlace) {
      this.placeService.updatePlace(this.selectedPlace.id, placeRequest).subscribe({
        next: (updatedPlace) => {
          const index = this.places.findIndex((p) => p.id === updatedPlace.id)
          if (index !== -1) {
            this.places[index] = updatedPlace
            this.applyFilters()
          }
          this.closeForm()
        },
        error: (error) => console.error("Error updating place:", error),
      })
    } else {
      this.placeService.createPlace(this.parkingId, placeRequest).subscribe({
        next: (newPlace) => {
          this.places.push(newPlace)
          this.applyFilters()
          this.closeForm()
        },
        error: (error) => console.error("Error creating place:", error),
      })
    }
  }

  deletePlace(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette place ?")) {
      this.placeService.deletePlace(id).subscribe({
        next: () => {
          this.places = this.places.filter((place) => place.id !== id)
          this.applyFilters()
        },
        error: (error) => console.error("Error deleting place:", error),
      })
    }
  }

  changeStatus(place: PlaceResponse, newStatus: PlaceStatus): void {
    if (newStatus === PlaceStatus.DISPONIBLE) {
      this.placeService.freePlace(place.id).subscribe({
        next: (updatedPlace) => {
          const index = this.places.findIndex((p) => p.id === updatedPlace.id)
          if (index !== -1) {
            this.places[index] = updatedPlace
            this.applyFilters()
          }
        },
        error: (error) => console.error("Error changing status:", error),
      })
    } else if (newStatus === PlaceStatus.OCCUPEE) {
      this.placeService.occupyPlace(place.id).subscribe({
        next: (updatedPlace) => {
          const index = this.places.findIndex((p) => p.id === updatedPlace.id)
          if (index !== -1) {
            this.places[index] = updatedPlace
            this.applyFilters()
          }
        },
        error: (error) => console.error("Error changing status:", error),
      })
    } else if (newStatus === PlaceStatus.RESERVEE) {
      // For simplicity, reserve for 1 hour from now
      const reservedUntil = new Date()
      reservedUntil.setHours(reservedUntil.getHours() + 1)

      this.placeService.reservePlace(place.id, reservedUntil.toISOString()).subscribe({
        next: (updatedPlace) => {
          const index = this.places.findIndex((p) => p.id === updatedPlace.id)
          if (index !== -1) {
            this.places[index] = updatedPlace
            this.applyFilters()
          }
        },
        error: (error) => console.error("Error changing status:", error),
      })
    }
  }

  getStatusClass(status: PlaceStatus): string {
    switch (status) {
      case PlaceStatus.DISPONIBLE:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case PlaceStatus.RESERVEE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case PlaceStatus.OCCUPEE:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  getTypeClass(type: PlaceType): string {
    switch (type) {
      case PlaceType.STANDARD:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case PlaceType.HANDICAP:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case PlaceType.VIP:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  goBack(): void {
    this.router.navigate(["/admin/dashboard/parkings"])
  }
}

