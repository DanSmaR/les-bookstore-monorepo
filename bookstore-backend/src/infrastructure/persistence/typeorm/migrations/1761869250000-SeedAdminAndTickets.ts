import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAdminAndTickets1761869250000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert admin user
    await queryRunner.query(`
      INSERT INTO tb_users (
        id,
        name,
        email,
        cpf,
        phone,
        gender,
        birth_date,
        password,
        role,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440010',
        'Admin User',
        'admin@bookstore.com',
        '98765432100',
        '11912345678',
        'other',
        '1990-01-01',
        '$2a$12$0M9jTH82qibgZkVYL8NHU.48qm9fvGZ5IXKX0ZEUnorkoJ9h9kBWi', -- password: "Abc$%123"
        'admin',
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert public promotional tickets (no owner - available for everyone)
    await queryRunner.query(`
      INSERT INTO tb_tickets (
        id,
        code,
        description,
        value,
        type,
        nature,
        status,
        valid_until,
        owner_id,
        active,
        created_at,
        updated_at
      ) VALUES 
      (
        '550e8400-e29b-41d4-a716-446655440020',
        'PROMO10',
        'Desconto de 10% em toda loja',
        10,
        'percentage',
        'promotional',
        'active',
        NOW() + INTERVAL '90 days',
        NULL,
        true,
        NOW(),
        NOW()
      ),
      (
        '550e8400-e29b-41d4-a716-446655440021',
        'BLACKFRIDAY',
        'Black Friday - 25% OFF',
        25,
        'percentage',
        'promotional',
        'active',
        NOW() + INTERVAL '30 days',
        NULL,
        true,
        NOW(),
        NOW()
      ),
      (
        '550e8400-e29b-41d4-a716-446655440022',
        'FRETE50',
        'R$ 50 de desconto',
        50.00,
        'raw',
        'promotional',
        'active',
        NOW() + INTERVAL '60 days',
        NULL,
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert personal promotional ticket for test user
    await queryRunner.query(`
      INSERT INTO tb_tickets (
        id,
        code,
        description,
        value,
        type,
        nature,
        status,
        valid_until,
        owner_id,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440023',
        'WELCOME15',
        'Cupom de boas-vindas - 15% OFF',
        15,
        'percentage',
        'promotional',
        'active',
        NOW() + INTERVAL '120 days',
        '550e8400-e29b-41d4-a716-446655440001',
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert exchange tickets for test user (from previous order returns)
    await queryRunner.query(`
      INSERT INTO tb_tickets (
        id,
        code,
        description,
        value,
        type,
        nature,
        status,
        valid_until,
        owner_id,
        origin_order_id,
        active,
        created_at,
        updated_at
      ) VALUES 
      (
        '550e8400-e29b-41d4-a716-446655440024',
        'TROCA100',
        'Crédito de troca - R$ 100',
        100.00,
        'raw',
        'exchange',
        'active',
        NOW() + INTERVAL '180 days',
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440006',
        true,
        NOW(),
        NOW()
      ),
      (
        '550e8400-e29b-41d4-a716-446655440025',
        'TROCA50',
        'Crédito de troca - R$ 50',
        50.00,
        'raw',
        'exchange',
        'active',
        NOW() + INTERVAL '180 days',
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440006',
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert an expired ticket for testing
    await queryRunner.query(`
      INSERT INTO tb_tickets (
        id,
        code,
        description,
        value,
        type,
        nature,
        status,
        valid_until,
        owner_id,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440026',
        'EXPIRED20',
        'Cupom expirado - 20% OFF',
        20,
        'percentage',
        'promotional',
        'expired',
        NOW() - INTERVAL '10 days',
        NULL,
        true,
        NOW(),
        NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete tickets
    await queryRunner.query(`
      DELETE FROM tb_tickets WHERE id IN (
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440021',
        '550e8400-e29b-41d4-a716-446655440022',
        '550e8400-e29b-41d4-a716-446655440023',
        '550e8400-e29b-41d4-a716-446655440024',
        '550e8400-e29b-41d4-a716-446655440025',
        '550e8400-e29b-41d4-a716-446655440026'
      )
    `);

    // Delete admin user
    await queryRunner.query(`
      DELETE FROM tb_users WHERE id = '550e8400-e29b-41d4-a716-446655440010'
    `);
  }
}
