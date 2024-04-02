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
    console.log('button is clicked');
    document.getElementById('exampleModal').style.display = 'block';
    document.getElementById('exampleModal').style.opacity = '1';
  }
  closebox() {
    console.log('button is clicked');
    document.getElementById('exampleModal').style.display = 'none';
  }
  openbox2() {
    console.log('button is clicked');
    document.getElementById('exampleModal2').style.display = 'block';
    document.getElementById('exampleModal2').style.opacity = '1';
  }
  closebox2() {
    console.log('button is clicked');
    document.getElementById('exampleModal2').style.display = 'none';
  }
  confirmdelete() {
    if (confirm('are you sure you want to delete you whole family?')) {
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
