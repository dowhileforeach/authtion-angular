import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import {Observable} from 'rxjs/Observable';

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
