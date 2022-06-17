import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  freshnessList = ['Brand New', 'Second Hand', 'Refurnished'];
  productForm!: FormGroup;
  actionBtn: string = 'Save';
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogref: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });
    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      ),
        this.productForm.controls['category'].setValue(this.editData.category),
        this.productForm.controls['freshness'].setValue(
          this.editData.freshness
        ),
        this.productForm.controls['price'].setValue(this.editData.price),
        this.productForm.controls['comment'].setValue(this.editData.comment),
        this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('product added successfully');
            this.productForm.reset();
            this.dialogref.close('save');
          },
          error: () => {
            alert('Error while adding the product');
          },
        });
      }
    }
    else {
      this.updateProduct();
    }
    // console.log(this.productForm.value);
  }
  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
      next: (res) => {
        alert('Record Updated Successfully');
        this.productForm.reset();
        this.dialogref.close('update');
      },
      error: () => {
        alert('Error while updating the record!');
      },
    });
  }
}
