import { Column, Index, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/models/base.model';

@Table({
  tableName: 'items',
  timestamps: true
})

export class ItemModel extends BaseModel {
  @Column({
    allowNull: false
  })
  item: string

  @Column({
    allowNull: false
  })
  quantity: number

  @Index
  @Column({
    allowNull: true
  })
  validTill: string
  // validTill: number | null
}
