import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Currency = 'RUB' | 'USD' | 'KZT' | 'UAH';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('my-app');

  activePaymentIndex = signal(0);
  setActivePayment(index: number) {
    this.activePaymentIndex.set(index);
  }

  activeCrrencyContext = signal(false);
  setActiveCrrencyContext() {
    this.activeCrrencyContext.set(!this.activeCrrencyContext());
  }

  activeCurrency = signal<Currency>('RUB');
  setActiveCurrency(currency: Currency) {
    this.activeCurrency.set(currency);
    this.activeCrrencyContext.set(false); // Скрыть меню после выбора
  }

  sliderValue = 1000;
  progressWidth = 0;
  valuePosition = 0;

  onSliderInput(value: number) {
    const min = 50;
    const max = 100000;
    // Валидация
    if (isNaN(value)) value = min;
    if (value < min) value = min;
    if (value > max) value = max;
    this.sliderValue = value;
    this.progressWidth = ((value - min) / (max - min)) * 100;
    this.valuePosition = this.progressWidth;
  }

  constructor(
    private eRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
    this.progressWidth = ((this.sliderValue - 50) / (100000 - 50)) * 100;
    this.valuePosition = this.progressWidth;
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  @ViewChild('currencySelect') currencySelect!: ElementRef;
  @ViewChild('currencyContext') currencyContext!: ElementRef;

  handleClickOutside = (event: MouseEvent) => {
    const selectEl = this.currencySelect?.nativeElement;
    const contextEl = this.currencyContext?.nativeElement;

    if (
      selectEl &&
      !selectEl.contains(event.target) &&
      (!contextEl || !contextEl.contains(event.target))
    ) {
      this.activeCrrencyContext.set(false);
    }
  };
}
