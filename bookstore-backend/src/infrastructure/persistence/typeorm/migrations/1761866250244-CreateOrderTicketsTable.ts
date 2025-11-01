import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTicketsTable1761866250244
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop table if exists to avoid conflicts with previous failed migrations
    await queryRunner.query(`DROP TABLE IF EXISTS tb_order_tickets CASCADE`);

    // Create the junction table for Order-Ticket many-to-many relationship
    await queryRunner.query(`
      CREATE TABLE tb_order_tickets (
        order_id UUID NOT NULL,
        ticket_id UUID NOT NULL,
        PRIMARY KEY (order_id, ticket_id)
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE tb_order_tickets
        ADD CONSTRAINT fk_order_tickets_order 
        FOREIGN KEY (order_id) 
        REFERENCES tb_orders(id) 
        ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE tb_order_tickets
        ADD CONSTRAINT fk_order_tickets_ticket 
        FOREIGN KEY (ticket_id) 
        REFERENCES tb_tickets(id) 
        ON DELETE CASCADE
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX idx_order_tickets_order_id ON tb_order_tickets(order_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_order_tickets_ticket_id ON tb_order_tickets(ticket_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_tickets_ticket_id
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_tickets_order_id
    `);

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS tb_order_tickets`);
  }
}
