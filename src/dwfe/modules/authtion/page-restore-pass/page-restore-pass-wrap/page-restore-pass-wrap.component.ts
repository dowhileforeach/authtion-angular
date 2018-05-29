import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-authtion-page-restore-pass-wrap',
  templateUrl: './page-restore-pass-wrap.component.html'
})
export class AuthtionPageRestorePassWrapComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    let key: string;

    const key$ = this.route.queryParamMap.pipe(
      map(params => key = params.get('key') || 'none')
    );

    key$.subscribe(x => console.log(x));

    // key$.pipe(
    //   concat()
    // );
  }

}
