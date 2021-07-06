import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
  form!: FormGroup
  id!: number
  isAddMode!: boolean
  loading = false
  submitted = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.isAddMode = !this.id

    const passwordValidators = [Validators.minLength(6)]
    if (this.isAddMode) {
      passwordValidators.push(Validators.required)
    }

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', passwordValidators],
    })

    if (!this.isAddMode) {
      this.accountService.getById(this.id)
        .pipe(first())
        .subscribe(x => this.form.patchValue(x))
    }
  }

  get f() {
    return this.form.controls
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    this.loading = true
    if (this.isAddMode) {
      this.createUser()
    } else
      this.updateUser()
  }

  private createUser() {
    this.accountService.register((this.form.value))
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('user added successfully')
          this.router.navigate(['../'], {relativeTo: this.route})
        },
        error: err => {
          console.error('create user error '+err)
          this.loading = false
        }
      })
  }

  private updateUser() {
    this.accountService.update(this.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Update Successful')
          this.router.navigate(['../../'], {relativeTo: this.route})
        }, error: err => {
          console.error('update user error '+err)
          this.loading = false
        }
      })
  }

}