import { AdminSeedService } from './services/admin-seed.service.js';
import { CustomerSeedService } from './services/customer-seed.service.js';
import { MenuSeedService } from './services/menu-seed.service.js';
import { SellerSeedService } from './services/seller-seed.service.js';
import { OrderSeedService } from './services/order.seed.service.js';

async function main() {

  console.log('Seeding SELLER...');
  await new SellerSeedService().execute();

  console.log('Seeding MENU...');
  await new MenuSeedService().execute();

  console.log('Seeding CUSTOMER...');
  await new CustomerSeedService().execute();

  // console.log('Seeding ORDERS...');
  // await new OrderSeedService().execute();

  console.log('Seeding ADMIN...');
  await new AdminSeedService('admin@gmail.com', 'admin@123#').execute();
}

main()
  .then(() => {
    console.log('Seeding finished');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
