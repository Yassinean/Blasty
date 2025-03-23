import { routes } from './../../../app.routes';
import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Location } from '@angular/common';
import { VehicleService } from "../../../core/services/vehicle.service"
import { ToastService } from "../../../core/services/toast.service"
import { VehicleResponse, VehicleType } from "../../../core/models/vehicle.model"

@Component({
  selector: "app-vehicle-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./vehicle-form.component.html",
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup
  isLoading = false
  isSubmitting = false
  existingVehicle: VehicleResponse | null = null
  isEditMode = false

  vehicleTypes = [
    { value: VehicleType.VOITURE, label: "Voiture" },
    { value: VehicleType.MOTO, label: "Moto" },
    { value: VehicleType.CAMION, label: "Camion" },
  ]

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private toastService: ToastService,
    private Location: Location,
  ) {
    this.vehicleForm = this.fb.group({
      immatriculation: ["", [Validators.required, Validators.pattern(/^\d{6}-[A-Z]{1}-\d{1,2}$/)]],
      type: [VehicleType.VOITURE, Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadVehicle()
  }

  loadVehicle(): void {
    this.isLoading = true
    this.vehicleService.getMyVehicle().subscribe({
      next: (vehicle) => {
        this.existingVehicle = vehicle
        if (vehicle) {
          this.isEditMode = true
          this.vehicleForm.patchValue({
            immatriculation: vehicle.immatriculation,
            type: vehicle.type,
          })
        }
        this.isLoading = false
      },
      error: (error) => {
        this.toastService.showToast('error',"Erreur lors du chargement du véhicule")
        console.error("Error loading vehicle:", error)
        this.isLoading = false
      },
    })
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.toastService.showToast('error',"Veuillez corriger les erreurs dans le formulaire")
      return
    }

    this.isSubmitting = true
    const vehicleData = this.vehicleForm.value

    if (this.isEditMode) {
      this.vehicleService.updateVehicle(vehicleData).subscribe({
        next: () => {
          this.toastService.showToast('success',"Véhicule mis à jour avec succès")
          this.isSubmitting = false
          this.Location.back()
        },
        error: (error) => {
          let errorMessage = "Erreur lors de la mise à jour du véhicule"
          if (error.error && error.error.message) {
            errorMessage = error.error.message
          }
          this.toastService.showToast('error',errorMessage)
          this.isSubmitting = false
        },
      })
    } else {
      this.vehicleService.createVehicle(vehicleData).subscribe({
        next: () => {
          this.toastService.showToast('success',"Véhicule enregistré avec succès")
          this.isSubmitting = false
          this.Location.back()
        },
        error: (error) => {
          let errorMessage = "Erreur lors de l'enregistrement du véhicule"
          if (error.error && error.error.message) {
            errorMessage = error.error.message
          }
          this.toastService.showToast('error',errorMessage)
          this.isSubmitting = false
        },
      })
    }
  }

  deleteVehicle(): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      this.isSubmitting = true
      this.vehicleService.deleteVehicle().subscribe({
        next: () => {
          this.toastService.showToast('success',"Véhicule supprimé avec succès")
          this.isSubmitting = false
          this.Location.back()
        },
        error: (error) => {
          this.toastService.showToast('error',"Erreur lors de la suppression du véhicule")
          console.error("Error deleting vehicle:", error)
          this.isSubmitting = false
        },
      })
    }
  }

  goBack(){
    this.Location.back();
  }
}

