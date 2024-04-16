import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResolveStart, Router } from '@angular/router';
import { LoginDataService } from '../shared/login-data.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.css',
})
export class MembersComponent implements OnInit {
  data: any;
  allmembers = [];
  memberrform: FormGroup;
  emailform: FormGroup;
  loginData: any;
  firstadmin: any;
  role: any;
  priority: any;
  constructor(
    private router: Router,
    private http: HttpClient,
    private logindataservice: LoginDataService
  ) {}

  ngOnInit(): void {
    this.getMemebers();
    this.loginData = this.logindataservice.getData();
    this.role = this.loginData.data.user.role;
    this.priority = this.loginData.data.user.priority;
    this.memberrform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.emailform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(70),
      ]),
    });
  }

  openbox() {
    document.getElementById('contactForm2').style.display = 'block';
    document.getElementById('contactForm2').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';
  }
  closebox() {
    document.getElementById('contactForm2').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }
  openbox2() {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactForm').style.opacity = '1';
    document.getElementById('overlay').style.display = 'block';
  }
  closebox2() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }
  confirmdelete() {
    if (
      confirm(
        'are you sure you want to delete you whole family? All Your Data will be erazed'
      )
    ) {
      this.deletefamily();
    }
  }
  getMemebers() {
    this.http
      .get('http://localhost:8000/api/v1/CollectiveCoin/user/getmembers')
      .subscribe(
        (resultData) => {
          try {
            this.data = resultData;
            console.log(this.data);
          } catch (error) {
            console.log(error);
          }
          this.allmembers = this.data.members.map((member) => ({
            name: member.name,
            role: member.role,
            isEarning: member.isEarning,
            id: member._id,
            photo: member.photo,
            priority: member.priority,
          }));
          this.firstadmin = resultData;
          console.log(this.firstadmin.firstadmin);
        },
        (error) => {
          console.log(error);
          if (error.error.message) {
            this.closebox();
            alert(error.error.message);
          } else {
            this.closebox();
            alert(
              'there was error while adding the member please try again after some time'
            );
          }
        }
      );
  }

  deleteMember(id) {
    if (
      confirm('are you sure you want to remove this member from your family')
    ) {
      this.http
        .patch(
          `http://localhost:8000/api/v1/CollectiveCoin/user/delete-member/${id}`,
          {}
        )
        .subscribe(
          (resultData) => {
            try {
              console.log(resultData);

              alert('member removed successfuly');
              this.getMemebers();
            } catch (error) {
              console.log(error);
            }
          },
          (error) => {
            if (error.error.message) {
              console.log(error.error.message);
              alert(error.error.message);
            }
          }
        );
    }
  }

  addmember() {
    const bodyData = this.memberrform.value;
    console.log(bodyData);
    this.http
      .post(
        'http://localhost:8000/api/v1/CollectiveCoin/user/add-member',
        bodyData
      )
      .subscribe((resultData) => {
        this.data = resultData;
        console.log(resultData);
        alert(this.data.messege);
        this.closebox();
      });
  }

  deletefamily() {
    this.http
      .delete('http://localhost:8000/api/v1/CollectiveCoin/user/deletefamily')
      .subscribe(
        (resultData) => {
          alert('family data deleted successfully');
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.error.message) {
            console.log(error.error.message);
            alert(error.error.message);
          }
        }
      );
  }

  emailAdmin() {
    let bodyData = this.emailform.value;
    this.http
      .post(
        'http://localhost:8000/api/v1/CollectiveCoin/user/sendmail',
        bodyData
      )
      .subscribe(
        (resultData: any) => {
          alert(resultData.messege);
          this.closebox2();
        },
        (error) => {
          if (error.error.message) {
            console.log(error.error.message);
            alert(error.error.message);
          }
        }
      );
  }

  makeAdmin(id: any) {
    if (confirm("are you sure you want to change this user's role")) {
      this.http
        .patch(
          `http://localhost:8000/api/v1/CollectiveCoin/user//makeadmin/${id}`,
          {}
        )
        .subscribe(
          (resultData) => {
            try {
              console.log(resultData);
              alert('successfully changed');
              this.getMemebers();
            } catch (error) {
              console.log(error);
            }
          },
          (error) => {
            console.log(error);
            if (error.error.message) {
              console.log(error);
              alert(error.error.message);
            }
          }
        );
    }
  }

  makeEarner(id: any) {
    if (confirm("are you sure you want to chang user's earning status ")) {
      this.http
        .patch(
          `http://localhost:8000/api/v1/CollectiveCoin/user/makeearner/${id}`,
          {}
        )
        .subscribe(
          (resultData: any) => {
            try {
              console.log(resultData);

              if (resultData.status === 'success') {
                alert('successfully changedearning status');
                this.getMemebers();
              } else {
                alert(resultData.message);
              }
            } catch (error) {
              console.log(error);
            }
          },
          (error) => {
            if (error.error.message) {
              console.log(error.error.message);
              alert(error.error.message);
            }
          }
        );
    }
  }
}
