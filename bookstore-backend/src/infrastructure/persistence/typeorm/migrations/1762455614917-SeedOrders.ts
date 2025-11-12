import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOrders1762455614917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Reference existing data from seed migration
    const existingCustomerId = '550e8400-e29b-41d4-a716-446655440002';
    const bookIds = [
      '550e8400-e29b-41d4-a716-446655440004', // Clean Code
      '550e8400-e29b-41d4-a716-446655440005', // Design Patterns
    ];
    const bookPrices = [89.9, 79.9];

    // Generate orders from January 2023 to November 2024 (almost 2 years)
    const startDate = new Date('2024-01-01T00:00:00');
    const endDate = new Date('2025-11-03T23:59:59');

    // Check for existing orders with our pattern to avoid conflicts
    const existingOrdersResult = (await queryRunner.query(`
      SELECT id FROM tb_orders 
      WHERE id::text ~ '^550e8400-e29b-41d4-a716-44665544[0-9a-f]{4}$'
      ORDER BY id DESC 
      LIMIT 1
    `)) as Array<{ id: string }>;

    // Start counter after any existing seeded orders
    let orderCounter = 0x1000; // Start at 4096 to avoid conflicts
    if (existingOrdersResult.length > 0) {
      const lastId: string = existingOrdersResult[0].id;
      const lastCounterHex: string = lastId.slice(-4);
      orderCounter = parseInt(lastCounterHex, 16) + 1;
    }

    console.log(
      `Starting order generation at counter: ${orderCounter} (0x${orderCounter.toString(16)})`,
    );

    const orders: Array<{
      id: string;
      orderDate: string;
      status: string;
      customerId: string;
    }> = [];
    const orderItems: Array<{
      orderId: string;
      bookId: string;
      quantity: number;
      unitPrice: number;
    }> = [];

    // Generate orders with varying patterns
    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dayOfWeek = currentDate.getDay();
      const month = currentDate.getMonth();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday =
        (month === 11 && currentDate.getDate() === 25) ||
        (month === 0 && currentDate.getDate() === 1);

      // Simulate business patterns:
      // - More orders during weekdays
      // - Peak seasons (November-December for Black Friday/Christmas)
      // - Summer slowdown (January-February)
      // - Random variation

      let dailyOrderProbability = 0.3; // Base 30% chance of orders each day

      if (!isWeekend && !isHoliday) {
        dailyOrderProbability += 0.2; // +20% for weekdays
      }

      // Seasonal adjustments
      if (month >= 10 || month <= 1) {
        // Nov-Feb (Black Friday to New Year)
        dailyOrderProbability += 0.3;
      } else if (month >= 5 && month <= 7) {
        // Jun-Aug (Summer peak)
        dailyOrderProbability += 0.2;
      } else if (month >= 2 && month <= 4) {
        // Mar-May (Spring growth)
        dailyOrderProbability += 0.1;
      }

      // Generate 0-5 orders per day based on probability
      const maxOrdersPerDay =
        Math.random() < dailyOrderProbability
          ? Math.floor(Math.random() * 5) + 1
          : 0;

      for (let orderOfDay = 0; orderOfDay < maxOrdersPerDay; orderOfDay++) {
        // Generate proper UUID by replacing last 4 digits with counter
        const counterHex = orderCounter.toString(16).padStart(4, '0');
        const orderId = `550e8400-e29b-41d4-a716-44665544${counterHex}`;

        // Random time during the day
        const orderTime = new Date(currentDate);
        orderTime.setHours(Math.floor(Math.random() * 16) + 8); // 8 AM to 11 PM
        orderTime.setMinutes(Math.floor(Math.random() * 60));

        // All orders are delivered for analytics testing
        const status = 'delivered';

        orders.push({
          id: orderId,
          orderDate: orderTime.toISOString(),
          status: status,
          customerId: existingCustomerId,
        });

        // Generate 1-N unique items per order (limited by available books)
        const maxItems = Math.min(4, bookIds.length); // Can't have more items than available books
        const itemCount = Math.floor(Math.random() * maxItems) + 1;
        const selectedBookIndices: number[] = [];

        for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
          let bookIndex: number;
          // Ensure unique books per order
          do {
            bookIndex = Math.floor(Math.random() * bookIds.length);
          } while (selectedBookIndices.includes(bookIndex));

          selectedBookIndices.push(bookIndex);

          const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 books

          // Add some price variation (±10%)
          const basePrice = bookPrices[bookIndex];
          const priceVariation = (Math.random() - 0.5) * 0.2; // ±10%
          const finalPrice =
            Math.round(basePrice * (1 + priceVariation) * 100) / 100;

          orderItems.push({
            orderId: orderId,
            bookId: bookIds[bookIndex],
            quantity: quantity,
            unitPrice: finalPrice,
          });
        }

        orderCounter++;
        if (orderCounter > 0xffff) break; // Safety limit (65535 in hex)
      }

      if (orderCounter > 0xffff) break; // Safety limit (65535 in hex)
    }

    console.log(
      `Generating ${orders.length} orders with ${orderItems.length} order items...`,
    );

    // Insert orders in batches to avoid query size limits
    const batchSize = 50;

    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      const values = batch
        .map(
          (order) =>
            `('${order.id}', '${order.orderDate}', '${order.status}', '${order.customerId}', true, '${order.orderDate}', NOW())`,
        )
        .join(', ');

      await queryRunner.query(`
                INSERT INTO tb_orders (
                    id, order_date, status, customer_id, active, created_at, updated_at
                ) VALUES ${values}
            `);
    }

    // Insert order items in batches
    for (let i = 0; i < orderItems.length; i += batchSize) {
      const batch = orderItems.slice(i, i + batchSize);
      const values = batch
        .map(
          (item) =>
            `('${item.orderId}', '${item.bookId}', ${item.quantity}, ${item.unitPrice})`,
        )
        .join(', ');

      await queryRunner.query(`
                INSERT INTO tb_order_items (
                    order_id, book_id, quantity, unit_price
                ) VALUES ${values}
            `);
    }

    console.log(
      `Successfully seeded ${orders.length} orders spanning from ${startDate.toISOString()} to ${endDate.toISOString()}!`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete all seeded orders (they have IDs starting with 550e8400-e29b-41d4-a716-44665544)
    await queryRunner.query(`
            DELETE FROM tb_order_items 
            WHERE order_id::text ~ '^550e8400-e29b-41d4-a716-44665544[0-9a-f]{4}$'
        `);

    await queryRunner.query(`
            DELETE FROM tb_orders 
            WHERE id::text ~ '^550e8400-e29b-41d4-a716-44665544[0-9a-f]{4}$'
        `);

    console.log('Successfully removed all seeded orders!');
  }
}
