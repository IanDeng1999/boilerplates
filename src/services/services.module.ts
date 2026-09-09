import { Global, Module } from '@nestjs/common';
import { IdService } from './id/id.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, Params } from "nestjs-pino";
import { CronjobService } from './cronjob/cronjob.service.js';
import pino from "pino";

@Global()
@Module({
  imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				// load remote config
				async () => {
					const isProd = process.env.NODE_ENV === "prod";

					return {
						IS_PROD: isProd,
					};
				},
			],
		}),
    LoggerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => {
				return {
					pinoHttp: {
						customReceivedObject(req) {
							return {
								msg: "request in",
								path: req.url,
								method: req.method,
							};
						},
						customSuccessObject(req, res, val) {
							return {
								path: req.url,
								method: req.method,
								status: res.statusCode,
								cost: val.responseTime,
							};
						},
						customErrorObject(req, res, _error, val) {
							return {
								path: req.url,
								method: req.method,
								status: res.statusCode,
								cost: val.responseTime,
							};
						},
						quietReqLogger: true,
						quietResLogger: true,
						level: config.get("LOG_LEVEL", "debug"),
						transport:
							process.env.NODE_ENV === "production"
								? undefined
								: { target: "pino-pretty" },
						stream:
							process.env.NODE_ENV === "production"
								? pino.destination({
										dest: "./app.log",
										minLength: 4096,
										sync: false,
										append: true,
									})
								: void 0,
					},
				} as Params;
			},
		}),
  ],
  providers: [IdService, CronjobService]
})
export class ServicesModule {}
