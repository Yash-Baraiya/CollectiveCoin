import { style } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.css',
})
export class MembersComponent implements OnInit {
  data: any;
  allmembers = [];
  memberrform: FormGroup;
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.getMemebers();

    this.memberrform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
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
          }));

          console.log(this.allmembers);
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
}
