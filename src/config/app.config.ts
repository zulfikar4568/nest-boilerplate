import env from 'env-var';
import 'dotenv/config';

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  APP_NAME: env.get('APP_NAME').default('sample-app').asString(),
  NODE_ENV: env.get('NODE_ENV').default('production').asString(),
  COOKIE_SAME_SITE: env.get('COOKIE_SAME_SITE').default('strict').asString(), // lax, strict, none
  COOKIE_SECURE: env.get('COOKIE_SECURE').default('true').asBoolStrict(),
  COOKIE_HTTP_ONLY: env.get('COOKIE_HTTP_ONLY').default('true').asBoolStrict(),
  OTLP_URL: env.get('OTLP_URL').asString(),
  REDIS_URL: env.get('REDIS_URL').asString(),
  REDIS_TTL: env.get('REDIS_TTL').default(300).asInt(),
  LOKI_HOST: env.get('LOKI_HOST').asString(),
  LOKI_USERNAME: env.get('LOKI_USERNAME').default('').asString(),
  LOKI_PASSWORD: env.get('LOKI_PASSWORD').default('').asString(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  ECRYPTED_SECRET: env.get('ECRYPTED_SECRET').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('3d').asString(),
  JWT_REFRESH_EXPIRES_IN: env
    .get('JWT_REFRESH_EXPIRES_IN')
    .default('30d')
    .asString(),
});
