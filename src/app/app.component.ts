import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  genders = ["male", "female"];

  forbiddenNames = ["Reaz", "Naim"];

  maxUsernameLength: number = 10;

  subscriptionList: Subscription[] = [];

  ngOnInit(): void {
    // This is how we register the controls
    // The whole form is basically a form group consisting of one or more form controls
    this.signUpForm = new FormGroup({
      // As u can see, we can nest form groups.
      //In the template or code, we can get access to em by specifying the path like userData.username, userData.email
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.usernameInvalid.bind(this), // this is a custom validator. With 'this', we are passing this particular form control
        ]),
        // FormControl takes 3 params, i) initial data ii) validators iii) async validators
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          [this.forbiddenEmail.bind(this)] // asynchronous validators are added as the third parameter
        ),
      }),
      hobbies: new FormArray([]), // initializing as empty form array
      gender: new FormControl("male"),
    });

    //Two Important hooks we can subscribe to for reacting to any form value and status changes

    // const subscription = this.signUpForm.valueChanges.subscribe((response) => {
    //   console.log(response);
    // });
    // this.subscriptionList.push(subscription);

    // const subscription2 = this.signUpForm.statusChanges.subscribe(
    //   (response) => {
    //     console.log(response);
    //   }
    // );
    // this.subscriptionList.push(subscription2);

    // Prefilling form with setValue. Need to specify all attribute values

    this.signUpForm.setValue({
      userData: {
        username: "Hasib",
        email: "hasib@gmail.com",
      },
      hobbies: [],
      gender: "male",
    });

    // Prefilling form with patch value. Can initialize a subsegment of the form
    // this.signUpForm.patchValue({
    //   userData: {
    //     username: "Hasib",
    //   },
    // });
  }

  getControls() {
    return (<FormArray>this.signUpForm.get("hobbies")).controls;
  }

  addHobby() {
    const control = new FormControl(null, Validators.required); // creating a form control with no initial values
    (<FormArray>this.signUpForm.get("hobbies")).push(control); // pushing this new control into the form array
  }

  onSubmit() {
    console.log(this.signUpForm);
  }

  // Custom validator. Parameter will be of type abstract control
  usernameInvalid(control: AbstractControl) {
    if (this.forbiddenNames.indexOf(control.value) !== -1) {
      return { invalidUsername: true };
    }
    return null; // we don't return { 'invalidUsername': false }
  }

  // Asynchronous validator. Will wait for 1500ms. Can be used in scenarios where we reach out to web server for validation check
  // and when we receive the data, we resolve. Until then, show spinner or something.
  forbiddenEmail(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === "test@yopmail.com") {
          resolve({ emailAlreadyExists: true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptionList) {
      sub.unsubscribe();
    }
  }
}
