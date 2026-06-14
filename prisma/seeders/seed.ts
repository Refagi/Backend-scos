import { AdminSeedService } from './services/admin-seed.service';
import { CustomerSeedService } from './services/customer-seed.service';
import { MenuSeedService } from './services/menu-seed.service';
import { SellerSeedService } from './services/seller-seed.service';
import { OrderSeedService } from './services/order.seed.service';

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
