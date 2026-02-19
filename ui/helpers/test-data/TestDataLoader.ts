import fs from 'fs';
import path from 'path';
import { ProductsData, Product } from './types';

export class TestDataLoader {
  private static productsData: ProductsData | null = null;

  static loadProducts(): ProductsData {
    if (!this.productsData) {
      const filePath = path.join(__dirname, 'products.json');
      const rawData = fs.readFileSync(filePath, 'utf-8');
      this.productsData = JSON.parse(rawData);
    }
    return this.productsData!;
  }

  static getPhones(): Product[] {
    return this.loadProducts().phones;
  }

  static getMonitors(): Product[] {
    return this.loadProducts().monitors;
  }

  static getLaptops(): Product[] {
    return this.loadProducts().laptops;
  }

  static getProductsByCategory(category: string): Product[] {
    const data = this.loadProducts();
    switch (category) {
      case 'Phones':
        return data.phones;
      case 'Monitors':
        return data.monitors;
      case 'Laptops':
        return data.laptops;
      default:
        return [];
    }
  }
}
