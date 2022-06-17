import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  public categories: any[];
  public selectedCategory: any | undefined;
  public image: File | null = null;
  public item$: Item | undefined;

  constructor(private titlePage: Title,
    private actRouter: ActivatedRoute,
    private itemsService: ItemService,
    private toastr: ToastrService,
    private router: Router) {  
    this.titlePage.setTitle("Добрая аптека - Редактирование товара" ); 
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
    this.actRouter.params.subscribe(
    (data: Params) => {
      let id: number = +data['id']
      this.loadItemData(id);
    });

    this.editItem.patchValue({
      categoryId: this.selectedCategory?.value
    });
  }

  editItem = new FormGroup({
    name: new FormControl('', [Validators.required]),
    itemContent: new FormControl('', [Validators.required]),
    manufacture: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    stockCount: new FormControl('', [Validators.required]),
    categoryId: new FormControl(''),
    substance: new FormControl(''),
    storageCondition: new FormControl(''),
    expiryDate: new FormControl(''),
    description: new FormControl(''),
    indications: new FormControl(''),
    contraindications: new FormControl(''),
    usage: new FormControl(''),
    sideEffect: new FormControl(''),
  });

  get name() { return this.editItem.get('name') }
  get itemContent() { return this.editItem.get('itemContent') }
  get manufacture() { return this.editItem.get('manufacture') }
  get price() { return this.editItem.get('price') }
  get stockCount() { return this.editItem.get('stockCount') }
  get categoryId() { return this.editItem.get('categoryId') }

  get substance() { return this.editItem.get('substance') }
  get storageCondition() { return this.editItem.get('storageCondition') }
  get expiryDate() { return this.editItem.get('expiryDate') }
  get description() { return this.editItem.get('description') }
  get indications() { return this.editItem.get('indications') }
  get contraindications() { return this.editItem.get('contraindications') }
  get usage() { return this.editItem.get('usage') }
  get sideEffect() { return this.editItem.get('sideEffect') }

  loadItemData(id: number): void {
    this.itemsService.getItemById(id)
    .toPromise()
    .then((data: Item | undefined) => {
      if (data) {
        this.item$ = data;

        this.editItem .setValue({
          name: data.name,
          manufacture: data.manufacture,
          itemContent: data.itemContent,
          stockCount: data.stockCount,
          substance: data.substance,
          storageCondition: data.storageCondition,
          expiryDate: data.expiryDate,
          categoryId: data.categoryId,
          description: data.description,
          indications: data.indications,
          contraindications: data.contraindications,
          usage: data.usage,
          sideEffect: data.sideEffect,
          price: data.price
        });

        switch(this.item$?.categoryId) {
          case 1: { this.selectedCategory = {name: 'Аллергия', value: 1}; break; }
          case 2: { this.selectedCategory = {name: 'Грипп, простуда, ОРЗ', value: 2}; break; }
          case 3: { this.selectedCategory = {name: 'Рецептурные товары', value: 3}; break; }
          case 4: { this.selectedCategory = {name: 'Суставы и мышцы', value: 4}; break; }
          case 5: { this.selectedCategory = {name: 'Витамины и БАДы', value: 5}; break; }
          case 6: { this.selectedCategory = {name: 'Дерматология', value: 6}; break; }
          case 7: { this.selectedCategory = {name: 'Неврология', value: 7}; break; }
          case 8: { this.selectedCategory = {name: 'Женское здоровье', value: 8}; break; }
          case 9: { this.selectedCategory = {name: 'Желудок, кишечник и печень', value: 9}; break; }
          case 10: { this.selectedCategory = {name: 'Гигиена', value: 10}; break; }
          case 11: { this.selectedCategory = {name: 'Заболевание вен', value: 11}; break; }
          case 12: { this.selectedCategory = {name: 'Косметика', value: 12}; break; }
          case 13: { this.selectedCategory = {name: 'Мама и малыш', value: 13}; break; }
          case 14: { this.selectedCategory = {name: 'Урология и нефрология', value: 14}; break; }
          case 15: { this.selectedCategory = {name: 'Мед. техника', value: 15}; break; }
          case 16: { this.selectedCategory = {name: 'Лечение органов слуха и зрения', value: 16}; break; }
          case 17: { this.selectedCategory = {name: 'Перевязка и мед. изделия', value: 17}; break; }
          case 18: { this.selectedCategory = {name: 'Боль и температура', value: 18}; break; }
          case 19: { this.selectedCategory = {name: 'Травы', value: 19}; break; }
          case 20: { this.selectedCategory = {name: 'Ароматерапия', value: 20}; break; }
          case 21: { this.selectedCategory = {name: 'Сезонные товары', value: 21}; break; }
          case 22: { this.selectedCategory = {name: 'Оптика', value: 22}; break; }
          case 23: { this.selectedCategory = {name: 'Продукты питания', value: 23}; break; }
          case 24: { this.selectedCategory = {name: 'Похудение', value: 24}; break; }
          case 25: { this.selectedCategory = {name: 'Разное', value: 25}; break; }
          case 26: { this.selectedCategory = {name: 'Ортопедия', value: 26}; break; }
          case 27: { this.selectedCategory = {name: 'Гомеопатия', value: 27}; break; }
          case 28: { this.selectedCategory = {name: 'Вредные привычки', value: 28}; break; }
          case 29: { this.selectedCategory = {name: 'Интимные отношения', value: 29}; break; }
        }
      }
    });
  }

  saveItemData(): void {
    this.editItem.patchValue({
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
      this.itemsService.editItem(this.editItem);
      this.router.navigateByUrl("/admin/panel").then(() => {
        this.toastr.success('Товар успешно изменён!', 'Изменение товара', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      });
    }
  }

  itemSelectedCategory(): string {
    return this.selectedCategory?.value; 
  }
}
