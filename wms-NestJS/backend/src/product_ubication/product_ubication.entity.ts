import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../product/product.entity';
import { Ubication } from '../ubication/ubication.entity';
import { Batch } from '../batch/batch.entity';

@Entity('product_ubication')
export class ProductUbication {
	@PrimaryGeneratedColumn()
	product_ubication_id!: number;

	@Column({ type: 'int', nullable: false })
	product_id!: number;

	@Column({ type: 'int', nullable: false })
	batch_id!: number;

	@Column({ type: 'int', nullable: false })
	ubication_id!: number;

	@Column({ type: 'int', nullable: false })
	amount!: number;

	@ManyToOne(() => Product, (product) => product.productProductUbicationList, { eager: false })
	@JoinColumn({ name: 'product_id' })
	productEntity!: Product;

	@ManyToOne(() => Batch, (batch) => batch.batchProductUbicationList, { eager: false })
	@JoinColumn({ name: 'batch_id' })
	batchEntity!: Batch;

	@ManyToOne(() => Ubication, (ubication) => ubication.productUbicationList, { eager: false })
	@JoinColumn({ name: 'ubication_id' })
	ubicationEntity!: Ubication;
}
