import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductUbication } from '../product_ubication/product_ubication.entity';

@Entity('ubication')
export class Ubication {
	@PrimaryGeneratedColumn()
	ubication_id!: number;

	@Column({ nullable: true })
	hallway!: string;

	@Column({ nullable: true })
	position!: number;

	@Column({ nullable: true })
	height!: number;

	@Column({ nullable: true })
	depth!: number;

	@OneToMany(() => ProductUbication, (productUbication) => productUbication.ubicationEntity, { eager: false })
	productUbicationList!: ProductUbication[];
}

