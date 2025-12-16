import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { ProductUbication } from '../product_ubication/product_ubication.entity';


@Entity('batch')
export class Batch {
	@PrimaryGeneratedColumn()
	batch_id!: number;

	@Column({ type: 'int', nullable: true })
	product_id!: number;

	@Column({ type: 'varchar', length: 64 })
	batch!: string;

	@Column({ type: 'date', nullable: true })
	expiry_date?: Date;

	@ManyToOne(() => Product, (product) => product.productBatchList, { eager: false })
	@JoinColumn({ name: 'product_id' })
	productEntity!: Product;

	@OneToMany(() => ProductUbication, (productUbication) => productUbication.batchEntity, { eager: false })
	batchProductUbicationList!: ProductUbication[];
}
