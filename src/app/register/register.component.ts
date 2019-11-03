import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';
import { AuthenticationService} from '../service/authentication.service';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';

@Component({templateUrl: 'register.component.html'})

export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private spinner : NgxSpinnerService,
        private auth:AuthenticationService
        
    ) { 
        
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.spinner.show();
        this.auth.registerUser(this.registerForm.value)
        .pipe(first())
            .subscribe(
                data => {
                    if(data['success'] === 'true'){
                      this.router.navigate(['login']);
                      this.spinner.hide();
                    }else {
                    console.log(data['msg']);
                    this.spinner.hide();
                    }
                },
                error => {
                    console.log('something went wrong in register api.')
                    this.spinner.hide();
                });
        
    }
}