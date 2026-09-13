import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../../domain/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user: User | null = null;
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;
  editMode = false;
  editedUser: Partial<User> = {};
  
  private subscription?: Subscription;

  ngOnInit() {
    this.loadUserProfile();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadUserProfile() {
    this.isLoading = true;
    this.error = null;

    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      this.user = currentUser;
      this.editedUser = { ...currentUser };
      this.isLoading = false;
      return;
    }

    this.subscription = this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.editedUser = { ...user };
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load profile';
        this.isLoading = false;
        
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
      },
      complete: () => {
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode && this.user) {
      this.editedUser = { ...this.user };
    }
  }

  saveProfile() {
    if (!this.user) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    const updateData = {
      firstName: this.editedUser.firstName,
      lastName: this.editedUser.lastName,
      phone: this.editedUser.phone,
      address: this.editedUser.address
    };

    this.subscription = this.authService.updateUser(this.user.id, updateData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.editMode = false;
        this.successMessage = 'Profile updated successfully!';
        this.isLoading = false;
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to update profile';
        this.isLoading = false;
      }
    });
  }

  cancelEdit() {
    this.editMode = false;
    if (this.user) {
      this.editedUser = { ...this.user };
    }
  }
}