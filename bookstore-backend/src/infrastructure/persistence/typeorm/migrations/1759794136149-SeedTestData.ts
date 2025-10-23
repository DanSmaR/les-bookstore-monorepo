import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTestData1759794136149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert customer details first (no dependencies)
    await queryRunner.query(`
      INSERT INTO tb_customer_details (
        id,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440002',
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert test user - using consistent UUID (after customer details exists)
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
        customer_details_id,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440001',
        'Gabriel de Jesus',
        'gabrieldjesus475@gmail.com',
        '12345678901',
        '11987654321',
        'male',
        '2003-01-15',
        '$2a$12$0M9jTH82qibgZkVYL8NHU.48qm9fvGZ5IXKX0ZEUnorkoJ9h9kBWi', -- password: "Abc$%123"
        'user',
        '550e8400-e29b-41d4-a716-446655440002',
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert test address with direct UUID and customer reference
    await queryRunner.query(`
      INSERT INTO tb_addresses (
        id,
        type,
        purpose,
        address_name,
        postal_code,
        street,
        number,
        complement,
        district,
        city,
        state,
        customer_details_id,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440003',
        'house',
        'delivery',
        'Casa Principal',
        '01234567',
        'Rua das Flores',
        '123',
        'Apt 45',
        'Centro',
        'São Paulo',
        'SP',
        '550e8400-e29b-41d4-a716-446655440002',
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert first test book with UUID
    await queryRunner.query(`
      INSERT INTO tb_books (
        id,
        title,
        author,
        isbn,
        description,
        price,
        stock,
        publisher,
        published_date,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440004',
        'Clean Code: A Handbook of Agile Software Craftsmanship',
        'Robert C. Martin',
        '9780132350884',
        'A comprehensive guide to writing clean, maintainable code',
        89.90,
        50,
        'Prentice Hall',
        '2008-08-01',
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert second test book with UUID
    await queryRunner.query(`
      INSERT INTO tb_books (
        id,
        title,
        author,
        isbn,
        description,
        price,
        stock,
        publisher,
        published_date,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440005',
        'Design Patterns: Elements of Reusable Object-Oriented Software',
        'Gang of Four',
        '9780201633610',
        'Classic book on software design patterns',
        79.90,
        30,
        'Addison-Wesley',
        '1994-10-21',
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert test order with UUID and customer reference
    await queryRunner.query(`
      INSERT INTO tb_orders (
        id,
        order_date,
        status,
        customer_id,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440006',
        '2024-10-06',
        'pending',
        '550e8400-e29b-41d4-a716-446655440002',
        true,
        NOW(),
        NOW()
      )
    `);

    // Insert order items with composite key references
    await queryRunner.query(`
      INSERT INTO tb_order_items (
        order_id,
        book_id,
        quantity,
        unit_price
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440006',
        '550e8400-e29b-41d4-a716-446655440004',
        1,
        89.90
      )
    `);

    await queryRunner.query(`
      INSERT INTO tb_order_items (
        order_id,
        book_id,
        quantity,
        unit_price
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440006',
        '550e8400-e29b-41d4-a716-446655440005',
        1,
        79.90
      )
    `);

    // Insert test card for the customer with UUID
    await queryRunner.query(`
      INSERT INTO tb_cards (
        id,
        number,
        type,
        brand,
        expiration_date,
        cvv,
        holder_name,
        customer_details_id,
        active,
        created_at,
        updated_at
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440007',
        '4111111111111111',
        'credit',
        'Visa',
        '2026-12-31',
        '123',
        'joao silva',
        '550e8400-e29b-41d4-a716-446655440002',
        true,
        NOW(),
        NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse order to avoid foreign key constraints
    await queryRunner.query(
      `DELETE FROM tb_order_items WHERE order_id = '550e8400-e29b-41d4-a716-446655440006'`,
    );
    await queryRunner.query(
      `DELETE FROM tb_orders WHERE id = '550e8400-e29b-41d4-a716-446655440006'`,
    );
    await queryRunner.query(
      `DELETE FROM tb_cards WHERE id = '550e8400-e29b-41d4-a716-446655440007'`,
    );
    await queryRunner.query(
      `DELETE FROM tb_addresses WHERE id = '550e8400-e29b-41d4-a716-446655440003'`,
    );
    await queryRunner.query(
      `DELETE FROM tb_books WHERE id IN ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005')`,
    );
    await queryRunner.query(
      `DELETE FROM tb_users WHERE id = '550e8400-e29b-41d4-a716-446655440001'`,
    );
    await queryRunner.query(
      `DELETE FROM tb_customer_details WHERE id = '550e8400-e29b-41d4-a716-446655440002'`,
    );
  }
}
