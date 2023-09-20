"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ValidationPipe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const iterare_1 = require("iterare");
const isUndefined = (obj) => typeof obj === 'undefined';
const isNil = (val) => isUndefined(val) || val === null;
let ValidationPipe = ValidationPipe_1 = class ValidationPipe {
    constructor(options) {
        this.logger = new common_1.Logger(ValidationPipe_1.name);
        options = options || {};
        const { transform, transformOptions, validateCustomDecorators, ...validatorOptions } = options;
        this.isTransformEnabled = !!transform;
        this.transformOptions = transformOptions;
        this.validatorOptions = validatorOptions;
        this.validateCustomDecorators = validateCustomDecorators || false;
    }
    async transform(value, metadata) {
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
        let object = (0, class_transformer_1.plainToClass)(metatype, value, this.transformOptions);
        const originalEntity = object;
        const isCtorNotEqual = object.constructor !== metatype;
        if (isCtorNotEqual && !isPrimitive) {
            object.constructor = metatype;
        }
        else if (isCtorNotEqual) {
            object = { constructor: metatype };
        }
        const errors = await this.validate(object, this.validatorOptions);
        if (errors.length > 0) {
            for (let error of errors) {
                for (let key in error.constraints) {
                    this.logger.error(`${error.target.constructor.name}:${error.constraints[key]}`);
                }
            }
            throw new common_1.BadRequestException('Invalid Input Parameters');
        }
        if (isPrimitive) {
            object = originalEntity;
        }
        if (this.isTransformEnabled) {
            return object;
        }
        if (isNil) {
            return originalValue;
        }
        return Object.keys(this.validatorOptions).length > 0
            ? (0, class_transformer_1.classToPlain)(object, this.transformOptions)
            : value;
    }
    stripProtoKeys(value) {
        delete value.__proto__;
        const keys = Object.keys(value);
        (0, iterare_1.iterate)(keys)
            .filter(key => (0, class_validator_1.isObject)(value[key]) && value[key])
            .forEach(key => this.stripProtoKeys(value[key]));
    }
    isPrimitive(value) {
        return ['number', 'boolean', 'string'].includes(typeof value);
    }
    transformPrimitive(value, metadata) {
        if (!metadata.data) {
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
    toEmptyIfNil(value) {
        return isNil(value) ? {} : value;
    }
    toValidate(metadata) {
        const { metatype, type } = metadata;
        if (type === 'custom' && !this.validateCustomDecorators) {
            return false;
        }
        const types = [String, Boolean, Number, Array, Object, Buffer];
        return !types.some(t => metatype === t) && !isNil(metatype);
    }
    validate(object, validatorOptions) {
        return (0, class_validator_1.validate)(object, validatorOptions);
    }
};
exports.ValidationPipe = ValidationPipe;
exports.ValidationPipe = ValidationPipe = ValidationPipe_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object])
], ValidationPipe);
//# sourceMappingURL=validation-pipe.js.map