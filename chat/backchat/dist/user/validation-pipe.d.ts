import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ValidatorOptions, ValidationError } from 'class-validator';
import { ClassTransformOptions } from 'class-transformer';
interface ValidationPipeOptions extends ValidatorOptions {
    transform?: boolean;
    transformOptions?: ClassTransformOptions;
    validateCustomDecorators?: boolean;
}
export declare class ValidationPipe implements PipeTransform<any> {
    private readonly logger;
    protected isTransformEnabled: boolean;
    protected transformOptions: ClassTransformOptions;
    protected validatorOptions: ValidatorOptions;
    protected validateCustomDecorators: boolean;
    constructor(options?: ValidationPipeOptions);
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    protected stripProtoKeys(value: Record<string, any>): void;
    protected isPrimitive(value: unknown): boolean;
    protected transformPrimitive(value: any, metadata: ArgumentMetadata): any;
    protected toEmptyIfNil<T = any, R = any>(value: T): R | {};
    private toValidate;
    protected validate(object: object, validatorOptions?: ValidatorOptions): Promise<ValidationError[]> | ValidationError[];
}
export {};
