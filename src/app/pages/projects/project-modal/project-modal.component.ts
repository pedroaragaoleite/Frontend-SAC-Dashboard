import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared/shared.service';
import { DatePipe } from '@angular/common';


import { Brand, Project } from '../../../core/interfaces/project';
import { UsersService } from '../../../core/services/users/users.service';
import { User } from '../../../core/interfaces/user';
import { ProjectsService } from '../../../core/services/projects/projects.service';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss'
})
export class ProjectModalComponent implements OnInit {
  @Input() mode: "create" | "edit" = "create";
  @Input() projectData: Project | null = null;
  @Output() modalChanged: EventEmitter<void> = new EventEmitter();

  options = [
    { id: 1, status: "active" },
    { id: 2, status: "inactive" },
  ]

  users: User[] = [];
  brands: Brand[] = [];
  username: any = '';

  id: number = 0;

  constructor(private projectServices: ProjectsService, private usersServices: UsersService, private datePipe: DatePipe, private fb: FormBuilder, private cdRef: ChangeDetectorRef, private router: Router, private sharedServices: SharedService) { }

  ngOnInit(): void {

    this.getOutboundUsers();
    this.getBrands();


    if (this.mode === 'edit' && this.projectData) {

      this.id = Number(this.projectData.id_campaign);

      const startDate = this.changeToLocalString(this.projectData.start_date as Date);
      const endDate = this.changeToLocalString(this.projectData.end_date as Date);

      this.projectForm.patchValue({
        title: this.projectData.title,
        description: this.projectData.description,
        start_date: startDate,
        end_date: endDate,
        status: this.projectData!.status,
        user_id: this.projectData.user_id.toString(),
      })

      this.productsForm.patchValue({
        brand_id: this.projectData.brands![0].id_brand.toString(),
        productA_units: this.projectData.products![0].productA_units.toString(),
        productB_units: this.projectData.products![0].productB_units.toString()
      })
    }
  }

  changeToLocalString(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm') || '';
  }

  projectForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', Validators.required],
    start_date: ['', [Validators.required]],
    end_date: ['', [Validators.required]],
    status: ['', [Validators.required]],
    user_id: ['', [Validators.required]]
  })

  productsForm = this.fb.group({
    brand_id: ['', [Validators.required]],
    productA_units: ['', [Validators.required]],
    productB_units: ['', [Validators.required]]
  })

  getOutboundUsers(): void {
    this.usersServices.getOutboundUsers()
      .subscribe({
        next: ((res: any) => {
          this.users = res.data;
          if (this.mode === 'edit') {
            this.username = this.users.filter(user => user.id_user === this.projectData?.user_id);
            this.username = this.username[0].username;
          }

        })
      })
  }

  getBrands(): void {
    this.projectServices.getBrands()
      .subscribe({
        next: (res: any) => {
          this.brands = res.data;
        }
      })
  }

  onSubmit() {
    if (this.projectForm.valid && this.productsForm.valid) {
      const project: Project = {
        title: this.projectForm.value.title!,
        description: this.projectForm.value.description!,
        start_date: this.projectForm.value.start_date! as unknown as Date,
        end_date: this.projectForm.value.end_date! as unknown as Date,
        status: this.projectForm.value.status!,
        user_id: Number(this.projectForm.value.user_id!),
        products: [
          {
            productA_units: Number(this.productsForm.value.productA_units),
            productB_units: Number(this.productsForm.value.productB_units),
            brand_id: Number(this.productsForm.value.brand_id)
          }
        ]
      }

      const request$ = this.mode === 'create' ?
        this.projectServices.addProject(project) : this.projectServices.updateProject(project, this.id);

      request$.subscribe({
        next: () => {
          this.sharedServices.notifyEventChange();
          this.closeModal();
        }
      })
    }
  }

  closeModal() {
    this.projectForm.reset();
    this.productsForm.reset();
    this.modalChanged.emit();
    this.cdRef.detectChanges();
  }

}
