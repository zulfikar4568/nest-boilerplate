import env from 'env-var';
import 'dotenv/config';

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
});
