import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {

    // this.route.url.pipe(map(segments => segments.join('')));
  }
}
