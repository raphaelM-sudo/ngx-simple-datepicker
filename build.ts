import * as del from 'del';
import { copySync } from 'fs-extra';
import { ngPackagr } from 'ng-packagr';
import { join } from 'path';

async function main() {
  // cleanup dist
  del.sync(join(process.cwd(), '/dist'));
  del.sync(join(process.cwd(), '/node_modules/@nutrify/ngx-simple-datepicker'));

  await ngPackagr()
    .forProject(join(process.cwd(), 'projects/simple-datepicker/package.json'))
    .build();

  // put it in node modules so the path resolves
  // proper path support eventually
  copySync(
    join(process.cwd(), 'README.md'),
    join(process.cwd(), '/dist/simple-datepicker/README.md')
  );
  copySync(
    join(process.cwd(), 'LICENSE'),
    join(process.cwd(), '/dist/simple-datepicker/LICENSE')
  );
  copySync(
    join(process.cwd(), '/dist/simple-datepicker'),
    join(process.cwd(), '/node_modules/@nutrify/ngx-simple-datepicker')
  );
}

main()
  .then(() => console.log('success'))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
