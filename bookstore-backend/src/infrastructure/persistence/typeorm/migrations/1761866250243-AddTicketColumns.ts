import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTicketColumns1761866250243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to tb_tickets
    await queryRunner.query(`
      ALTER TABLE tb_tickets 
        ADD COLUMN IF NOT EXISTS nature VARCHAR(50) DEFAULT 'promotional',
        ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
        ADD COLUMN IF NOT EXISTS owner_id UUID,
        ADD COLUMN IF NOT EXISTS origin_order_id VARCHAR(255)
    `);

    // Add foreign key constraint for owner_id
    await queryRunner.query(`
      ALTER TABLE tb_tickets 
        ADD CONSTRAINT fk_ticket_owner 
        FOREIGN KEY (owner_id) 
        REFERENCES tb_users(id) 
        ON DELETE SET NULL
    `);

    // Create index on owner_id for better query performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_tickets_owner_id ON tb_tickets(owner_id)
    `);

    // Create index on status for filtering active tickets
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON tb_tickets(status)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS idx_tickets_status`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_tickets_owner_id`);

    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE tb_tickets DROP CONSTRAINT IF EXISTS fk_ticket_owner
    `);

    // Drop columns
    await queryRunner.query(`
      ALTER TABLE tb_tickets 
        DROP COLUMN IF EXISTS origin_order_id,
        DROP COLUMN IF EXISTS owner_id,
        DROP COLUMN IF EXISTS status,
        DROP COLUMN IF EXISTS nature
    `);
  }
}
