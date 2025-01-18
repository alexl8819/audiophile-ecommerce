import { defineDb, defineTable, column, NOW } from 'astro:db';

const Customers = defineTable({
  columns: {
    id: column.number({
      primaryKey: true
    }),
    emailAddress: column.text(),
    firstName: column.text(),
    lastName: column.text(),
    shippingAddress: column.text(),
    billingAddress: column.text()
  }
});

const Users = defineTable({
  columns: {
    id: column.number({
      primaryKey: true
    }),
    created: column.date({
      default: NOW,
    }),
    username: column.text({
      unique: true
    }),
    password: column.text(),
    customer: column.number({
      optional: true,
      references: () => Customers.columns.id
    })
  }
});

const Products = defineTable({
  columns: {
    id: column.number({
      primaryKey: true
    }),
    created: column.date({
      default: NOW
    }),
    name: column.text(),
    slug: column.text({
      unique: true
    }),
    description: column.text(),
    features: column.text(),
    category: column.text(),
    new: column.boolean({
      default: false
    }),
    price: column.number(),
    included: column.json(),
    images: column.number()
  }
});

const Inventory = defineTable({
  columns: {
    id: column.number({
      primaryKey: true
    }),
    product: column.number({
      references: () => Products.columns.id
    })
  }
});

const Discounts = defineTable({
  columns: {
    id: column.number({
      primaryKey: true
    }),
    created: column.date({
      default: NOW
    }),
    code: column.text({
      unique: true
    }),
    value: column.number()
  }
});

const Carts = defineTable({
  columns: {
    item: Inventory.columns.id,
    quantity: column.number(),
    customer: column.number({
      references: () => Customers.columns.id
    })
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Customers,
    Users,
    Products,
    Inventory,
    Discounts,
    Carts
  }
});
