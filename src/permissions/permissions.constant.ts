export const PERMISSIONS = {
  PRODUCTS: {
    READ: 'products:read',
    CREATE: 'products:create',
    UPDATE: 'products:update',
    DELETE: 'products:delete',
  },
  ORDERS: {
    READ_OWN: 'orders:read:own',
    READ_ANY: 'orders:read:any',
    UPDATE_OWN: 'orders:update:own',
    UPDATE_ANY: 'orders:update:any',
  },
  CARTS: {
    READ_OWN: 'carts:read:own',
    UPDATE_OWN: 'carts:update:own',
  },
  COMMENTS: {
    READ: 'comments:read',
    CREATE: 'comments:create',
    UPDATE_OWN: 'comments:update:own',
    DELETE_OWN: 'comments:delete:own',
    DELETE_ANY: 'comments:delete:any',
  },
};