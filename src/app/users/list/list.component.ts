import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../services/account.service";
import {first} from "rxjs/operators";
import {User} from "../../models/user";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  users: any
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getAll()
      .pipe(first())
      .subscribe((users: User[]) => this.users = users)
  }

  deleteUser(id: number) {
    const user = this.users.find((x: User) => x.id === id)
    user.isDeleting = true
    this.accountService.delete(id)
      .pipe(first())
      .subscribe(() => this.users = this.users.filter((x:User) => x.id !== id))
  }

}
