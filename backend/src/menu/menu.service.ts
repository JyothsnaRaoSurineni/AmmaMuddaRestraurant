import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, MenuItem } from '../database/database.service';

@Injectable()
export class MenuService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(category?: string, search?: string, isVeg?: boolean): Promise<MenuItem[]> {
    let items = await this.dbService.getMenuItems();

    if (category && category !== 'all') {
      items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      items = items.filter(
        item => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }

    if (isVeg !== undefined && isVeg !== null) {
      items = items.filter(item => item.is_veg === isVeg);
    }

    return items;
  }

  async findOne(id: number): Promise<MenuItem> {
    const item = await this.dbService.getMenuItemById(id);
    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return item;
  }

  async create(data: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    return this.dbService.createMenuItem(data);
  }

  async update(id: number, data: Partial<MenuItem>): Promise<MenuItem> {
    const updated = await this.dbService.updateMenuItem(id, data);
    if (!updated) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<{ success: boolean }> {
    const success = await this.dbService.deleteMenuItem(id);
    if (!success) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return { success };
  }
}
