import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PlaceService } from '../../../../core/services/place.service';
import {
  PlaceResponse,
  PlaceRequest,
  PlaceStatus,
  PlaceType,
} from '../../../../core/models/place.model';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ParkingService } from '../../../../core/services/parking.service';
import { Toast } from '../../../../core/models/toast';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-place-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './place-management.component.html',
  styleUrls: ['./place-management.component.css'],
})
export class PlaceManagementComponent implements OnInit {
  parkingId!: number;
  parkingName = '';
  places: PlaceResponse[] = [];
  filteredPlaces: PlaceResponse[] = [];
  toasts: Toast[] = [];
  toastIdCounter = 0;
  placeForm!: FormGroup;
  isLoading = false;

  selectedPlace: PlaceResponse | null = null;
  isEditMode = false;
  showForm = false;
  filterStatus = 'ALL';
  filterType = 'ALL';

  placeTypes = Object.values(PlaceType);
  placeStatuses = Object.values(PlaceStatus);
  placeStatus = PlaceStatus;

  constructor(
    private placeService: PlaceService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private parkingService: ParkingService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadParkingAndPlaces();
  }

  loadParkingAndPlaces(): void {
    this.isLoading = true;
    console.log(this.parkingId); // here the id undefined

    this.route.params
      .pipe(
        switchMap((params) => {
          this.parkingId = +params['id'];
          console.log('Parking ID from route:', this.parkingId); // here NaN
          if (isNaN(this.parkingId)) {
            throw new Error('Invalid parking ID');
          }
          // First get the parking details to get the name
          return this.parkingService.getParkingById(this.parkingId);
        }),
        tap((parking) => {
          console.log('Parking Details:', parking);
          if (parking) {
            this.parkingName = parking.name || `Parking #${this.parkingId}`;
          }
        }),
        catchError((error) => {
          console.error('Error loading parking details:', error);
          this.toastService.showToast(
            'error',
            'Échec du chargement des détails de parking.'
          );
          return of(null);
        }),
        // Only proceed to fetch places if we got a valid parking
        switchMap((parking) => {
          if (!parking) return of([]);
          console.log('Fetching places for parking ID:', this.parkingId);
          // Get places specifically for this parking ID
          return this.placeService.getAllPlaces();
        }),
        tap((places) => {
          console.log('All Places fetched:', places);
          // Filter places by parking ID
          this.places = places.filter(
            (place) => place.parkingId === this.parkingId
          );
          console.log('Filtered Places for this parking:', this.places);
          this.applyFilters();
        }),
        catchError((error) => {
          console.error('Error loading places:', error);
          this.toastService.showToast(
            'error',
            'Échec du chargement des places.'
          );
          return of([]);
        })
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          console.log('Final places array:', this.places);
          console.log('Final filtered places array:', this.filteredPlaces);
        },
        error: (err) => {
          console.error('Subscription error:', err);
          this.isLoading = false;
          this.toastService.showToast(
            'error',
            `Une erreur inattendue s'est produite.`
          );
        },
      });
  }

  initForm(place?: PlaceResponse): void {
    this.placeForm = this.fb.group({
      numero: [place?.numero || '', [Validators.required]],
      type: [place?.type || PlaceType.STANDARD, [Validators.required]],
      tarifHoraire: [
        place?.tarifHoraire || 0,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  applyFilters(): void {
    console.log('Applying filters. Current places:', this.places);
    this.filteredPlaces = this.places.filter((place) => {
      const matchesStatus =
        this.filterStatus === 'ALL' ? true : place.etat === this.filterStatus;

      const matchesType =
        this.filterType === 'ALL' ? true : place.type === this.filterType;

      return matchesStatus && matchesType;
    });
    console.log('Filtered places after applying filters:', this.filteredPlaces);
  }

  openAddForm(): void {
    this.isEditMode = false;
    this.selectedPlace = null;
    this.initForm();
    this.showForm = true;
  }

  openEditForm(place: PlaceResponse): void {
    this.isEditMode = true;
    this.selectedPlace = place;
    this.initForm(place);
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedPlace = null;
  }

  submitForm(): void {
    if (this.placeForm.invalid) {
      this.toastService.showToast(
        'error',
        'Please fill all required fields correctly.'
      );
      return;
    }

    const placeRequest: PlaceRequest = {
      numero: this.placeForm.value.numero,
      type: this.placeForm.value.type,
    };

    // Check parking capacity before submitting the form
    if (this.isEditMode && this.selectedPlace) {
      this.placeService
        .updatePlace(this.selectedPlace.id, placeRequest)
        .subscribe({
          next: (updatedPlace) => {
            const index = this.places.findIndex(
              (p) => p.id === updatedPlace.id
            );
            this.toastService.showToast(
              'success',
              'La place est modifié avec succès'
            );
            if (index !== -1) {
              this.places[index] = updatedPlace;
              this.applyFilters();
            }else{
              this.toastService.showToast(
                'error',
                'Vous pouvez pas modifier une place non disponible'
              );
            }
            this.closeForm();
          }
        });
    } else {
      console.log('im here before creating place');

      this.placeService.createPlace(this.parkingId, placeRequest).subscribe({
        next: (newPlace) => {
          if (newPlace && newPlace.id) {
            this.places.push(newPlace);
            this.toastService.showToast('success', 'Place créée avec succès.');
            this.applyFilters();
            this.closeForm();
          } else {
            console.log('im here after creating place');
            this.toastService.showToast(
              'error',
              `Place avec ce numero est deja creer OU Parking atteing sa capacity maximum.`
            );
            this.closeForm();
          }
        },
      });
    }
  }

  isParkingFull(): boolean {
    const currentPlaceCount = this.places.length;
    const parkingCapacity = this.getParkingCapacity();
    return currentPlaceCount >= parkingCapacity;
  }

  getParkingCapacity(): number {
    return this.parkingService.getAvailablePlaces.length;
  }

  deletePlace(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette place ?')) {
      this.placeService.deletePlace(id).subscribe({
        next: () => {
          this.places = this.places.filter((place) => place.id !== id);
          this.applyFilters();
          this.toastService.showToast(
            'success',
            'Place est supprimée avec succès'
          );
        },
        error: (error) => console.error('Error deleting place:', error),
      });
    }
  }

  getStatusClass(status: PlaceStatus): string {
    switch (status) {
      case PlaceStatus.DISPONIBLE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case PlaceStatus.RESERVEE:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case PlaceStatus.OCCUPEE:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  getTypeClass(type: PlaceType): string {
    switch (type) {
      case PlaceType.STANDARD:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case PlaceType.HANDICAP:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case PlaceType.VIP:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard/parkings']);
  }
}
