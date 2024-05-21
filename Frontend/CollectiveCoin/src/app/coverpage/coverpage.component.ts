import { AfterViewInit, Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-coverpage',
  templateUrl: './coverpage.component.html',
  styleUrl: './coverpage.component.css',
})
export class CoverpageComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    //$('#carouselExampleIndicators').carousel();
  }
}
