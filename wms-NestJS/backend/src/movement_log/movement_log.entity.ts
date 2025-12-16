import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Ubication } from '../ubication/ubication.entity';
import { Product } from '../product/product.entity';
import { Batch } from '../batch/batch.entity';

@Entity('movement_log')
export class MovementLog {
	@PrimaryGeneratedColumn()
	movement_log_id!: number;

	@Column({ type: 'int', nullable: false })
	user_id!: number;

	@Column({ type: 'int', nullable: true })
	from_ubication_id!: number;

	@Column({ type: 'int', nullable: true })
	to_ubication_id!: number;

	@Column({ type: 'int', nullable: false })
	product_id!: number;

	@Column({ type: 'int', nullable: false })
	batch_id!: number;

	@Column({ type: 'int', nullable: false })
	amount!: number;

	@Column({ type: 'datetime', nullable: false })
	timestamp!: Date;

	@ManyToOne(() => User, { eager: false })
	@JoinColumn({ name: 'user_id' })
	userEntity!: User;

	@ManyToOne(() => Ubication, { eager: false })
	@JoinColumn({ name: 'from_ubication_id' })
	fromUbicationEntity!: Ubication;

	@ManyToOne(() => Ubication, { eager: false })
	@JoinColumn({ name: 'to_ubication_id' })
	toUbicationEntity!: Ubication;

	@ManyToOne(() => Product, { eager: false })
	@JoinColumn({ name: 'product_id' })
	productEntity!: Product;

	@ManyToOne(() => Batch, { eager: false })
	@JoinColumn({ name: 'batch_id' })
	batchEntity!: Batch;
}
