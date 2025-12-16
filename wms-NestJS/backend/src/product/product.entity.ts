import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Batch } from '../batch/batch.entity';
import { ProductUbication } from '../product_ubication/product_ubication.entity';

@Entity('products')
export class Product {
	@PrimaryGeneratedColumn()
	product_id!: number;

	@Column({ type: 'text', nullable: false })
	reference!: string;

	@Column({ type: 'text', nullable: false })
	description!: string;

	@Column({ type: 'boolean', nullable: false })
	obsolete!: boolean;

	@Column({ type: 'int', nullable: false })
	company!: number;

	//producto muchos lotes
	@OneToMany(() => Batch, (batch) => batch.productEntity, { eager: false })
	productBatchList!: Batch[];

	//producto muchas ubiprod

	@OneToMany(() => ProductUbication, (productUbication) => productUbication.productEntity, { eager: false })
	productProductUbicationList!: ProductUbication[];
}
