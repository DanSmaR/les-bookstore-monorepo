import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedBooks1763075740121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const books = [
      // Fiction & Literature
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        description:
          'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
        price: 24.99,
        stock: 45,
        publisher: 'Scribner',
        publishedDate: '1925-04-10',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780446310789',
        description:
          'A gripping tale of racial injustice and childhood in the American South.',
        price: 22.99,
        stock: 38,
        publisher: 'Warner Books',
        publishedDate: '1960-07-11',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        description:
          'A dystopian social science fiction novel about totalitarian control.',
        price: 19.99,
        stock: 52,
        publisher: 'Signet Classics',
        publishedDate: '1949-06-08',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440013',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '9780141439518',
        description:
          'A romantic novel about manners, upbringing, morality, and marriage.',
        price: 18.99,
        stock: 29,
        publisher: 'Penguin Classics',
        publishedDate: '1813-01-28',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440014',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '9780316769174',
        description:
          'A controversial novel about teenage rebellion and alienation.',
        price: 21.99,
        stock: 33,
        publisher: 'Little Brown',
        publishedDate: '1951-07-16',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440015',
        title: 'One Hundred Years of Solitude',
        author: 'Gabriel García Márquez',
        isbn: '9780060883287',
        description:
          'A landmark of magical realism chronicling seven generations of the Buendía family.',
        price: 26.99,
        stock: 24,
        publisher: 'Harper Perennial',
        publishedDate: '1967-06-05',
      },

      // Science Fiction & Fantasy
      {
        id: '550e8400-e29b-41d4-a716-446655440016',
        title: 'Dune',
        author: 'Frank Herbert',
        isbn: '9780441172719',
        description:
          'Epic science fiction novel set on the desert planet Arrakis.',
        price: 28.99,
        stock: 41,
        publisher: 'Ace Books',
        publishedDate: '1965-08-01',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440017',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        isbn: '9780547928227',
        description:
          'A fantasy adventure about Bilbo Baggins and his unexpected journey.',
        price: 23.99,
        stock: 67,
        publisher: 'Houghton Mifflin',
        publishedDate: '1937-09-21',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440018',
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        author: 'J.R.R. Tolkien',
        isbn: '9780547928210',
        description:
          'First volume of the epic fantasy trilogy about the quest to destroy the One Ring.',
        price: 25.99,
        stock: 43,
        publisher: 'Houghton Mifflin',
        publishedDate: '1954-07-29',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440019',
        title: 'Foundation',
        author: 'Isaac Asimov',
        isbn: '9780553293357',
        description:
          'Classic science fiction about psychohistory and the fall of a galactic empire.',
        price: 22.99,
        stock: 36,
        publisher: 'Bantam Spectra',
        publishedDate: '1951-05-01',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        title: 'Neuromancer',
        author: 'William Gibson',
        isbn: '9780441569595',
        description:
          'Groundbreaking cyberpunk novel that coined the term "cyberspace".',
        price: 24.99,
        stock: 28,
        publisher: 'Ace Books',
        publishedDate: '1984-07-01',
      },

      // Mystery & Thriller
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        title: 'The Girl with the Dragon Tattoo',
        author: 'Stieg Larsson',
        isbn: '9780307454546',
        description:
          'Swedish crime thriller featuring investigative journalist Mikael Blomkvist.',
        price: 26.99,
        stock: 39,
        publisher: 'Vintage Crime',
        publishedDate: '2005-08-01',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440022',
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        isbn: '9780307588371',
        description:
          'Psychological thriller about a marriage gone terribly wrong.',
        price: 25.99,
        stock: 44,
        publisher: 'Crown Publishers',
        publishedDate: '2012-06-05',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440023',
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        isbn: '9780307474278',
        description:
          'Mystery thriller involving religious conspiracy and ancient secrets.',
        price: 27.99,
        stock: 51,
        publisher: 'Anchor Books',
        publishedDate: '2003-03-18',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440024',
        title: 'And Then There Were None',
        author: 'Agatha Christie',
        isbn: '9780062073488',
        description:
          'Classic mystery novel about ten strangers trapped on an island.',
        price: 19.99,
        stock: 37,
        publisher: 'William Morrow',
        publishedDate: '1939-11-06',
      },

      // Non-Fiction & Self-Help
      {
        id: '550e8400-e29b-41d4-a716-446655440025',
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '9780062316097',
        description:
          'Exploration of how Homo sapiens came to dominate the world.',
        price: 29.99,
        stock: 48,
        publisher: 'Harper',
        publishedDate: '2011-01-01',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440026',
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9780735211292',
        description:
          'Practical guide to building good habits and breaking bad ones.',
        price: 24.99,
        stock: 62,
        publisher: 'Avery',
        publishedDate: '2018-10-16',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440027',
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen R. Covey',
        isbn: '9781982137274',
        description:
          'Timeless principles for personal and professional effectiveness.',
        price: 22.99,
        stock: 55,
        publisher: 'Simon & Schuster',
        publishedDate: '1989-08-15',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440028',
        title: 'Educated',
        author: 'Tara Westover',
        isbn: '9780399590504',
        description:
          'Memoir about education, family, and the struggle for self-invention.',
        price: 26.99,
        stock: 41,
        publisher: 'Random House',
        publishedDate: '2018-02-20',
      },

      // Business & Economics
      {
        id: '550e8400-e29b-41d4-a716-446655440029',
        title: 'The Lean Startup',
        author: 'Eric Ries',
        isbn: '9780307887894',
        description:
          'Revolutionary approach to creating and managing successful startups.',
        price: 28.99,
        stock: 34,
        publisher: 'Crown Business',
        publishedDate: '2011-09-13',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        title: 'Zero to One',
        author: 'Peter Thiel',
        isbn: '9780804139298',
        description:
          'Notes on startups and building the future from PayPal co-founder.',
        price: 25.99,
        stock: 27,
        publisher: 'Crown Business',
        publishedDate: '2014-09-16',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440031',
        title: 'Good to Great',
        author: 'Jim Collins',
        isbn: '9780066620992',
        description:
          'Research-based insights on what makes companies achieve sustained greatness.',
        price: 24.99,
        stock: 31,
        publisher: 'HarperBusiness',
        publishedDate: '2001-10-16',
      },

      // Programming & Technology (Note: Clean Code and Design Patterns already exist in SeedTestData migration)
      {
        id: '550e8400-e29b-41d4-a716-446655440033',
        title: 'The Pragmatic Programmer',
        author: 'David Thomas, Andrew Hunt',
        isbn: '9780135957059',
        description: 'Your journey to mastery in software development.',
        price: 79.99,
        stock: 29,
        publisher: 'Addison-Wesley',
        publishedDate: '2019-09-13',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440035',
        title: 'You Dont Know JS: Scope & Closures',
        author: 'Kyle Simpson',
        isbn: '9781449335588',
        description: 'Deep dive into JavaScript scope and closures.',
        price: 39.99,
        stock: 42,
        publisher: 'OReilly Media',
        publishedDate: '2014-03-24',
      },

      // History & Biography
      {
        id: '550e8400-e29b-41d4-a716-446655440036',
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        isbn: '9781451648539',
        description: 'Comprehensive biography of the Apple co-founder.',
        price: 32.99,
        stock: 35,
        publisher: 'Simon & Schuster',
        publishedDate: '2011-10-24',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440037',
        title: 'The Immortal Life of Henrietta Lacks',
        author: 'Rebecca Skloot',
        isbn: '9781400052189',
        description:
          'True story of how one womans cells changed medicine forever.',
        price: 28.99,
        stock: 33,
        publisher: 'Crown Publishers',
        publishedDate: '2010-02-02',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440038',
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '9780553380163',
        description:
          'Accessible exploration of cosmology and the nature of time.',
        price: 21.99,
        stock: 40,
        publisher: 'Bantam',
        publishedDate: '1988-04-01',
      },

      // Romance & Contemporary Fiction
      {
        id: '550e8400-e29b-41d4-a716-446655440039',
        title: 'The Seven Husbands of Evelyn Hugo',
        author: 'Taylor Jenkins Reid',
        isbn: '9781501161933',
        description:
          'Captivating novel about a reclusive Hollywood icons life story.',
        price: 25.99,
        stock: 58,
        publisher: 'Atria Books',
        publishedDate: '2017-06-13',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440040',
        title: 'Where the Crawdads Sing',
        author: 'Delia Owens',
        isbn: '9780735219090',
        description:
          'Mystery and coming-of-age story set in the marshes of North Carolina.',
        price: 26.99,
        stock: 61,
        publisher: 'G.P. Putnams Sons',
        publishedDate: '2018-08-14',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440041',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        isbn: '9780525559474',
        description:
          'Philosophical novel about life, regret, and infinite possibilities.',
        price: 24.99,
        stock: 47,
        publisher: 'Viking',
        publishedDate: '2020-08-13',
      },

      // Young Adult
      {
        id: '550e8400-e29b-41d4-a716-446655440042',
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        isbn: '9780439023481',
        description:
          'Dystopian adventure about survival in a televised death match.',
        price: 22.99,
        stock: 53,
        publisher: 'Scholastic Press',
        publishedDate: '2008-09-14',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440043',
        title: 'Harry Potter and the Sorcerers Stone',
        author: 'J.K. Rowling',
        isbn: '9780439708180',
        description:
          'The magical adventure that started it all at Hogwarts School.',
        price: 19.99,
        stock: 71,
        publisher: 'Scholastic',
        publishedDate: '1997-06-26',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440044',
        title: 'The Fault in Our Stars',
        author: 'John Green',
        isbn: '9780525478812',
        description:
          'Heart-wrenching romance between two teenagers with cancer.',
        price: 21.99,
        stock: 39,
        publisher: 'Dutton Books',
        publishedDate: '2012-01-10',
      },

      // Philosophy & Psychology
      {
        id: '550e8400-e29b-41d4-a716-446655440045',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        isbn: '9780374533557',
        description:
          'Groundbreaking exploration of how the mind makes decisions.',
        price: 30.99,
        stock: 32,
        publisher: 'Farrar, Straus and Giroux',
        publishedDate: '2011-10-25',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440046',
        title: 'Man s Search for Meaning',
        author: 'Viktor E. Frankl',
        isbn: '9780807014295',
        description:
          'Holocaust survivors profound insights on finding purpose in suffering.',
        price: 18.99,
        stock: 45,
        publisher: 'Beacon Press',
        publishedDate: '1946-01-01',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440047',
        title: 'The Power of Now',
        author: 'Eckhart Tolle',
        isbn: '9781577314806',
        description: 'Spiritual guide to living in the present moment.',
        price: 23.99,
        stock: 41,
        publisher: 'New World Library',
        publishedDate: '1997-01-01',
      },

      // Health & Fitness
      {
        id: '550e8400-e29b-41d4-a716-446655440048',
        title: 'Becoming',
        author: 'Michelle Obama',
        isbn: '9781524763138',
        description:
          'Intimate memoir from the former First Lady of the United States.',
        price: 32.99,
        stock: 49,
        publisher: 'Crown Publishing',
        publishedDate: '2018-11-13',
      },
    ];

    // Insert all books with conflict handling
    for (const book of books) {
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
          '${book.id}',
          '${book.title.replace(/'/g, "''")}',
          '${book.author.replace(/'/g, "''")}',
          '${book.isbn}',
          '${book.description.replace(/'/g, "''")}',
          ${book.price},
          ${book.stock},
          '${book.publisher.replace(/'/g, "''")}',
          '${book.publishedDate}',
          true,
          NOW(),
          NOW()
        )
        ON CONFLICT (isbn) DO NOTHING
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete all books created by this migration
    await queryRunner.query(`
      DELETE FROM tb_books 
      WHERE id IN (
        '550e8400-e29b-41d4-a716-446655440010',
        '550e8400-e29b-41d4-a716-446655440011',
        '550e8400-e29b-41d4-a716-446655440012',
        '550e8400-e29b-41d4-a716-446655440013',
        '550e8400-e29b-41d4-a716-446655440014',
        '550e8400-e29b-41d4-a716-446655440015',
        '550e8400-e29b-41d4-a716-446655440016',
        '550e8400-e29b-41d4-a716-446655440017',
        '550e8400-e29b-41d4-a716-446655440018',
        '550e8400-e29b-41d4-a716-446655440019',
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440021',
        '550e8400-e29b-41d4-a716-446655440022',
        '550e8400-e29b-41d4-a716-446655440023',
        '550e8400-e29b-41d4-a716-446655440024',
        '550e8400-e29b-41d4-a716-446655440025',
        '550e8400-e29b-41d4-a716-446655440026',
        '550e8400-e29b-41d4-a716-446655440027',
        '550e8400-e29b-41d4-a716-446655440028',
        '550e8400-e29b-41d4-a716-446655440029',
        '550e8400-e29b-41d4-a716-446655440030',
        '550e8400-e29b-41d4-a716-446655440031',
        '550e8400-e29b-41d4-a716-446655440033',
        '550e8400-e29b-41d4-a716-446655440035',
        '550e8400-e29b-41d4-a716-446655440036',
        '550e8400-e29b-41d4-a716-446655440037',
        '550e8400-e29b-41d4-a716-446655440038',
        '550e8400-e29b-41d4-a716-446655440039',
        '550e8400-e29b-41d4-a716-446655440040',
        '550e8400-e29b-41d4-a716-446655440041',
        '550e8400-e29b-41d4-a716-446655440042',
        '550e8400-e29b-41d4-a716-446655440043',
        '550e8400-e29b-41d4-a716-446655440044',
        '550e8400-e29b-41d4-a716-446655440045',
        '550e8400-e29b-41d4-a716-446655440046',
        '550e8400-e29b-41d4-a716-446655440047',
        '550e8400-e29b-41d4-a716-446655440048'
      )
    `);
  }
}
