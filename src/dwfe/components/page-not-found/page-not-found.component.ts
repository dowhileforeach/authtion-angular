import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-page-not-found-dwfe',
  template: `
    <section class="page-not-found-dwfe  grid-indent">
      <h2>404. That’s an error</h2>
      <p>The requested resource
        <mark>{{path}}</mark>
        was not found on this server.
      </p>
      <p>That’s all we know.</p>
    </section>
  `
})
export class PageNotFoundDwfeComponent implements OnInit {

  private path: string;

  constructor(protected route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.url.subscribe(arr =>
      this.path = '/' + arr.map(segment => segment.path).join('/')
    );
  }
}
