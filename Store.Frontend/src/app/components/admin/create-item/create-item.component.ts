import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {
  public categories: any[];
  public selectedCategory: any | undefined;
  public image: File | null = null;

  constructor(private titlePage: Title,
    private toastr: ToastrService,
    private itemService: ItemService,
    private router: Router) {  
    this.titlePage.setTitle("Добрая аптека - Создание товара" ); 
    this.categories = [
    {name: 'Аллергия', value: 1},
    {name: 'Грипп, простуда, ОРЗ', value: 2},
    {name: 'Рецептурные товары', value: 3},
    {name: 'Суставы и мышцы', value: 4},
    {name: 'Витамины и БАДы', value: 5},
    {name: 'Дерматология', value: 6},
    {name: 'Неврология', value: 7},
    {name: 'Женское здоровье', value: 8},
    {name: 'Желудок, кишечник и печень', value: 9},
    {name: 'Гигиена', value: 10},
    {name: 'Заболевание вен', value: 11},
    {name: 'Косметика', value: 12},
    {name: 'Мама и малыш', value: 13},
    {name: 'Урология и нефрология', value: 14},
    {name: 'Мед. техника', value: 15},
    {name: 'Лечение органов слуха и зрения', value: 16},
    {name: 'Перевязка и мед. изделия', value: 17},
    {name: 'Боль и температура', value: 18},
    {name: 'Травы', value: 19},
    {name: 'Ароматерапия', value: 20},
    {name: 'Сезонные товары', value: 21},
    {name: 'Оптика', value: 22},
    {name: 'Продукты питания', value: 23},
    {name: 'Похудение', value: 24},
    {name: 'Разное', value: 25},
    {name: 'Ортопедия', value: 26},
    {name: 'Гомеопатия', value: 27},
    {name: 'Вредные привычки', value: 28},
    {name: 'Интимные отношения', value: 29},
  ]
}

  ngOnInit(): void {
  }

  createItem = new FormGroup({
    name: new FormControl('', [Validators.required]),
    itemContent: new FormControl('', [Validators.required]),
    manufacture: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    stockCount: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),

    substance: new FormControl('', [Validators.required]),
    storageCondition: new FormControl('', [Validators.required]),
    expiryDate: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    indications: new FormControl('', [Validators.required]),
    contraindications: new FormControl('', [Validators.required]),
    usage: new FormControl('', [Validators.required]),
    sideEffect: new FormControl('', [Validators.required]),
  });

  get name() { return this.createItem.get('name') }
  get itemContent() { return this.createItem.get('itemContent') }
  get manufacture() { return this.createItem.get('manufacture') }
  get price() { return this.createItem.get('price') }
  get stockCount() { return this.createItem.get('stockCount') }
  get categoryId() { return this.createItem.get('categoryId') }

  get substance() { return this.createItem.get('substance') }
  get storageCondition() { return this.createItem.get('storageCondition') }
  get expiryDate() { return this.createItem.get('expiryDate') }
  get description() { return this.createItem.get('description') }
  get indications() { return this.createItem.get('indications') }
  get contraindications() { return this.createItem.get('contraindications') }
  get usage() { return this.createItem.get('usage') }
  get sideEffect() { return this.createItem.get('sideEffect') }

  handleFileInput(event: any): void {
    let image = document.querySelector('.file-name')!;
    if(event.target.files[0]) {
      this.image = event.target.files[0];
      image.innerHTML = this.image!.name;
    } else {
      image.innerHTML = '';
    } 
  }

  createItemData(): void {
    if(this.image) {
      this.createItem.patchValue({
        categoryId: this.selectedCategory?.value
      });

      if (this.name?.value == "" || this.itemContent?.value == "" || this.manufacture?.value == "" ||
          this.price?.value == "" || this.stockCount?.value == "" || this.categoryId?.value == "" || 
          this.substance?.value == "" || this.storageCondition?.value == "" || this.expiryDate?.value == "" ||
          this.description?.value == "" || this.indications?.value == "" || this.contraindications?.value == "" ||
          this.usage?.value == "" || this.sideEffect?.value == "") {
          this.toastr.error('Заполните все поля, чтобы продолжить!', 'Создание товара', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      }
      else {
        this.itemService.createItem(this.createItem, this.image);
        this.router.navigateByUrl("/admin/panel").then(() => {
          this.toastr.success('Товар успешно добавлен!', 'Создание товара', {
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        });
      }
    }
    else {
      this.toastr.error('Ошибка загрузки файла!', 'Создание товара', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
  }

  itemSelectedCategory(): string {
    return this.selectedCategory?.value; 
  }
}
