import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalPages!: number[];
  @Input() currentPage!: number;
  @Output() pageChange = new EventEmitter<number>();


  handlePageChange(page: number){
    this.pageChange.emit(page);
  }
}
