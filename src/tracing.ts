import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import appConfig from './config/app.config';

/**
 * ENABLE THIS FOR DEBUGGING
 */
// import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const otelSDK = new NodeSDK({
  serviceName: appConfig.APP_NAME,
  metricReader: new PrometheusExporter({
    port: 8081,
  }),
  spanProcessor: new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: appConfig.OTLP_URL,
    }),
  ),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [
    new ExpressInstrumentation(),
    new NestInstrumentation(),
    new PrismaInstrumentation(),
    new PinoInstrumentation(),
  ],
});

export default otelSDK;
