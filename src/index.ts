import app from 'app';
import { testConnection } from 'database/pool';

testConnection();
app.listen(app.get('port'), (): void => {
  console.log('✅ Server is Running >>', app.get('port'));
});
