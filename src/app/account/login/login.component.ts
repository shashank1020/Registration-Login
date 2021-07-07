import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {first} from "rxjs/operators";
import {Clipboard} from "@angular/cdk/clipboard";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup
  loading = false
  submitted = false
  selected = false
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private copyText: Clipboard
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  get f() {
    return this.form.controls
  }

  onSubmit() {
    console.log(this.form);
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    this.loading = true
    this.accountService.login(this.form.value.username, this.form.value.password)
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
          this.router.navigateByUrl(returnUrl)
        },
        error: err =>  {
          console.error(err)
          this.loading = false
        }
      })
  }
  copy() {
    this.selected = !this.selected
    this.copyText.copy('shashankmaurya1020@gmail.com')
  }
}
