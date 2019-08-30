import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LowerCaseValidator } from 'src/app/shared/validators/lower-case.validator';
import { UserNotTakenValidatorService } from './user-not-taven.validator.service';
import { NewUser } from './new-user';
import { SignUpService } from './signup.service';
import { PlatformDetectorService } from 'src/app/core/platform-detector/platform-detector.service';
import { userNamePasswordValidator } from './username-password.validator';

@Component({
    templateUrl:'./signup.component.html',
    providers: [ UserNotTakenValidatorService ]
})
export class SignupComponent implements OnInit{
    signupForm: FormGroup;
    @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
    constructor(
        private formBuilder: FormBuilder,
        private userNotTakenValidatorService: UserNotTakenValidatorService,
        private signUpService: SignUpService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService){}
    
    ngOnInit(): void {
        
        this.signupForm = this.formBuilder.group({
            email: ['', 
                [
                    Validators.required, 
                    Validators.email
                ]
            ],
            fullName: ['', 
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(40)
                ]
            ],
            userName: ['', 
                [
                    Validators.required,
                    LowerCaseValidator,
                    Validators.minLength(2),
                    Validators.maxLength(30)
                ],
                this.userNotTakenValidatorService.checkUserNameTaken()
            ],
            password: ['', 
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(18)
                ]
            ]
        },{
            validator: userNamePasswordValidator
        });

        this.platformDetectorService.isPlatformBrowser() &&
        this.emailInput.nativeElement.focus();
    } 

    signup() {
        if(this.signupForm.valid && !this.signupForm.pending) {
            const newUser = this.signupForm.getRawValue() as NewUser;
            this.signUpService
                .signup(newUser)
                .subscribe(
                    () => this.router.navigate(['']),
                    err => console.log(err)
                );
        }
    }
}