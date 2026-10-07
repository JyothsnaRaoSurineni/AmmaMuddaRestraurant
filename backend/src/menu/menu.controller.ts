import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuItem } from '../database/database.service';

@Controller('api/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('is_veg') isVegStr?: string
  ) {
    const isVeg = isVegStr !== undefined ? isVegStr === 'true' : undefined;
    return this.menuService.findAll(category, search, isVeg);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.menuService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: Omit<MenuItem, 'id'>) {
    return this.menuService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<MenuItem>) {
    return this.menuService.update(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.menuService.remove(Number(id));
  }
}
