import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-header',
  imports: [RouterLink, TuiButton, TuiIcon],
  templateUrl: './header.html'
})
export class Header {}