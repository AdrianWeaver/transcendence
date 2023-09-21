//TEST file maybe not used in the end


import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger, Optional } from '@nestjs/common';
    import { ValidatorOptions, ValidationError, isObject, validate } from 'class-validator';
    import { plainToClass, classToPlain, ClassTransformOptions } from 'class-transformer';
    import { iterate } from 'iterare';
    
    
    const isUndefined = (obj: any): obj is undefined =>
        typeof obj === 'undefined';
    
    const isNil = (val: any): val is null | undefined =>
        isUndefined(val) || val === null;
    
    
    interface ValidationPipeOptions extends ValidatorOptions {
        transform?: boolean;
        transformOptions?: ClassTransformOptions;
        validateCustomDecorators?: boolean;
    }
    
    
    @Injectable()
    export class ValidationPipe implements PipeTransform<any> {
    
        private readonly logger = new Logger(ValidationPipe.name);
        protected isTransformEnabled: boolean;
        protected transformOptions: ClassTransformOptions;
        protected validatorOptions: ValidatorOptions;
        protected validateCustomDecorators: boolean;
    
    
        constructor(@Optional() options?: ValidationPipeOptions) {
            options = options || {};
            const {
                transform,
                transformOptions,
                validateCustomDecorators,
                ...validatorOptions
            } = options;
    
    
            this.isTransformEnabled = !!transform;
            this.transformOptions = transformOptions;
            this.validatorOptions = validatorOptions;
            this.validateCustomDecorators = validateCustomDecorators || false;
        }
    
        async transform(value: any, metadata: ArgumentMetadata) {
    
            const metatype = metadata.metatype;
            if (!metatype || !this.toValidate(metadata)) {
                return this.isTransformEnabled
                    ? this.transformPrimitive(value, metadata)
                    : value;
            }
    
            const originalValue = value;
            value = this.toEmptyIfNil(value);
    
            const isNil = value !== originalValue;
            const isPrimitive = this.isPrimitive(value);
            this.stripProtoKeys(value);
            let object = plainToClass(metatype, value, this.transformOptions);
    
            const originalEntity = object;
            const isCtorNotEqual = object.constructor !== metatype;
    
            if (isCtorNotEqual && !isPrimitive) {
                object.constructor = metatype;
            } else if (isCtorNotEqual) {
                // when "entity" is a primitive value, we have to temporarily
                // replace the entity to perform the validation against the original
                // metatype defined inside the handler
                object = { constructor: metatype };
            }
    
            const errors = await this.validate(object, this.validatorOptions);
            if (errors.length > 0) {
    
                for (let error of errors) {
                    for (let key in error.constraints) {
                        this.logger.error(`${error.target.constructor.name}:${error.constraints[key]}`);
                    }
                }
                throw new BadRequestException('Invalid Input Parameters');
            }
    
    
            if (isPrimitive) {
                // if the value is a primitive value and the validation process has been successfully completed
                // we have to revert the original value passed through the pipe
                object = originalEntity;
            }
    
            if (this.isTransformEnabled) {
                return object;
            }
    
            if (isNil) {
                // if the value was originally undefined or null, revert it back
                return originalValue;
            }
    
            return Object.keys(this.validatorOptions).length > 0
                ? classToPlain(object, this.transformOptions)
                : value;
        }
    
    
    
        protected stripProtoKeys(value: Record<string, any>) {
            delete value.__proto__;
            const keys = Object.keys(value);
            iterate(keys)
                .filter(key => isObject(value[key]) && value[key])
                .forEach(key => this.stripProtoKeys(value[key]));
        }
    
        protected isPrimitive(value: unknown): boolean {
            return ['number', 'boolean', 'string'].includes(typeof value);
        }
    
    
        protected transformPrimitive(value: any, metadata: ArgumentMetadata) {
            if (!metadata.data) {
                // leave top-level query/param objects unmodified
                return value;
            }
            const { type, metatype } = metadata;
            if (type !== 'param' && type !== 'query') {
                return value;
            }
            if (metatype === Boolean) {
                return value === true || value === 'true';
            }
            if (metatype === Number) {
                return +value;
            }
            return value;
        }
    
    
        protected toEmptyIfNil<T = any, R = any>(value: T): R | {} {
            return isNil(value) ? {} : value;
        }
    
        private toValidate(metadata: ArgumentMetadata): boolean {
    
            const { metatype, type } = metadata;
            if (type === 'custom' && !this.validateCustomDecorators) {
                return false;
            }
            const types = [String, Boolean, Number, Array, Object, Buffer];
            return !types.some(t => metatype === t) && !isNil(metatype);
    
        }
    
        protected validate(
            object: object,
            validatorOptions?: ValidatorOptions,
        ): Promise<ValidationError[]> | ValidationError[] {
            return validate(object, validatorOptions);
        }
    
    }