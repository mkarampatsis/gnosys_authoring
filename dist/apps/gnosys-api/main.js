/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/gnosys-api/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const serve_static_1 = __webpack_require__("@nestjs/serve-static");
const auth_module_1 = __webpack_require__("./apps/gnosys-api/src/app/auth/auth.module.ts");
const users_module_1 = __webpack_require__("./apps/gnosys-api/src/app/users/users.module.ts");
const mail_module_1 = __webpack_require__("./apps/gnosys-api/src/app/mail/mail.module.ts");
const authoring_module_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/authoring.module.ts");
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
const path_1 = __webpack_require__("path");
let AppModule = class AppModule {
};
AppModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'gnosys'),
                exclude: ['/api*'],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            mail_module_1.MailModule,
            authoring_module_1.AuthoringModule,
        ],
        controllers: [],
        // controllers: [AppController],
        // providers: [AppService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./apps/gnosys-api/src/app/auth/auth.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const auth_service_1 = __webpack_require__("./apps/gnosys-api/src/app/auth/auth.service.ts");
const passport_1 = __webpack_require__("@nestjs/passport");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const jwt_strategy_1 = __webpack_require__("./apps/gnosys-api/src/app/auth/jwt.strategy.ts");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const user_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/users/schemas/user.schema.ts");
const refresh_token_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/auth/refresh-token-schema.ts");
let AuthModule = class AuthModule {
};
AuthModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'RefreshToken', schema: refresh_token_schema_1.RefreshTokenSchema },
            ]),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),

/***/ "./apps/gnosys-api/src/app/auth/auth.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const jsonwebtoken_1 = __webpack_require__("jsonwebtoken");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
const cryptr_1 = (0, tslib_1.__importDefault)(__webpack_require__("cryptr"));
const uuid_1 = __webpack_require__("uuid");
const request_ip_1 = __webpack_require__("request-ip");
const environment_1 = __webpack_require__("./apps/gnosys-api/src/environments/environment.ts");
let AuthService = class AuthService {
    constructor(userModel, refreshTokenModel, jwtService) {
        this.userModel = userModel;
        this.refreshTokenModel = refreshTokenModel;
        this.jwtService = jwtService;
        this.cryptr = new cryptr_1.default(process.env.ENCRYPT_JWT_SECRET);
        this.cryptr = new cryptr_1.default(environment_1.environment.gnosysURL);
    }
    createAccessToken(userId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const accessToken = (0, jsonwebtoken_1.sign)({ userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION,
            });
            // return this.encryptText(accessToken);
            return accessToken;
        });
    }
    createRefreshToken(req, userId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const refreshToken = new this.refreshTokenModel({
                userId,
                refreshToken: (0, uuid_1.v4)(),
                ip: this.getIp(req),
                browser: this.getBrowserInfo(req),
                country: this.getCountry(req),
            });
            yield refreshToken.save();
            return refreshToken.refreshToken;
        });
    }
    validateUser(jwtPayload) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({
                _id: jwtPayload.userId,
                emailVerified: true,
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not authorized.');
            }
            return user;
        });
    }
    // JWT Extractor
    jwtExtractor(request) {
        let token = null;
        if (request.header('x-token')) {
            token = request.get('x-token');
        }
        else if (request.headers.authorization) {
            token = request.headers.authorization
                .replace('Bearer ', '')
                .replace(' ', '');
        }
        else if (request.body.token) {
            token = request.body.token.replace(' ', '');
        }
        if (request.query.token) {
            token = request.body.token.replace(' ', '');
        }
        const cryptr = new cryptr_1.default(process.env.ENCRYPT_JWT_SECRET);
        if (token) {
            try {
                token = cryptr.decrypt(token);
            }
            catch (err) {
                throw new common_1.BadRequestException('Bad request.');
            }
        }
        return token;
    }
    // Helpers
    returnJwtExtractor() {
        return this.jwtExtractor;
    }
    getIp(req) {
        return (0, request_ip_1.getClientIp)(req);
    }
    getBrowserInfo(req) {
        return req.header['user-agent'] || 'XX';
    }
    getCountry(req) {
        return req.header['cf-ipcountry'] ? req.header['cf-ipcountry'] : 'XX';
    }
    encryptText(text) {
        return this.cryptr.encrypt(text);
    }
};
AuthService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, mongoose_1.InjectModel)('User')),
    (0, tslib_1.__param)(1, (0, mongoose_1.InjectModel)('RefreshToken')),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _c : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),

/***/ "./apps/gnosys-api/src/app/auth/constants.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jwtConstants = void 0;
exports.jwtConstants = {
    secret: 'secretKey',
};


/***/ }),

/***/ "./apps/gnosys-api/src/app/auth/jwt.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const passport_jwt_1 = __webpack_require__("passport-jwt");
const passport_1 = __webpack_require__("@nestjs/passport");
const common_1 = __webpack_require__("@nestjs/common");
const constants_1 = __webpack_require__("./apps/gnosys-api/src/app/auth/constants.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants_1.jwtConstants.secret,
        });
    }
    validate(payload) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return { userId: payload.sub, username: payload.username };
        });
    }
};
JwtStrategy = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),

/***/ "./apps/gnosys-api/src/app/auth/refresh-token-schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenSchema = void 0;
const mongoose_1 = __webpack_require__("mongoose");
exports.RefreshTokenSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    browser: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/authoring.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthoringController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
// import { controlEnabledWhile } from '@ngneat/reactive-forms/lib/core';
const authoring_service_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/authoring.service.ts");
const hint_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/dto/hint.dto.ts");
const script_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/dto/script.dto.ts");
const edumaterial_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/dto/edumaterial.dto.ts");
const metadata_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/dto/metadata.dto.ts");
const tags_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/dto/tags.dto.ts");
let AuthoringController = class AuthoringController {
    constructor(authoringService) {
        this.authoringService = authoringService;
    }
    // Scripts
    createScript(createScriptDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.authoringService.createScript(createScriptDto);
        });
    }
    updateScript(Id, Email, Name, Desc, Code, Lang) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.updateScript(Id, Email, Name, Desc, Code, Lang);
            return null;
        });
    }
    removeScript(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.deleteScript(Id);
            return null;
        });
    }
    getScripts(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.authoringService.getScripts(email);
            return result;
        });
    }
    // Hints
    createHint(createHintDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.authoringService.createHint(createHintDto);
        });
    }
    getHints(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.authoringService.getHints(email);
            return result;
        });
    }
    getHint(Id) {
        return this.authoringService.getHint(Id);
    }
    updateHint(Id, ScriptID, ScriptName, Title, Desc, Code) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.updateHint(Id, ScriptID, ScriptName, Title, Desc, Code);
            return null;
        });
    }
    removeHint(hintId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.deleteHint(hintId);
            return null;
        });
    }
    // EduMaterial
    createEduMaterial(createEduMaterialDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.authoringService.createEduMaterial(createEduMaterialDto);
        });
    }
    getEduMaterials(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.authoringService.getEduMaterials(email);
            return result;
        });
    }
    getEduMaterial(Id) {
        return this.authoringService.getEduMaterial(Id);
    }
    updateEduMaterial(Id, ScriptID, ScriptName, About, File, Video) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.updateEduMaterial(Id, ScriptID, ScriptName, About, File, Video);
            return null;
        });
    }
    removeEduMaterial(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.deleteEduMaterial(Id);
            return null;
        });
    }
    // Metadata
    createMetadata(createMetadataDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.authoringService.createMetadata(createMetadataDto);
        });
    }
    getMetadatas(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.authoringService.getMetadatas(email);
            return result;
        });
    }
    getMetadata(Id) {
        return this.authoringService.getMetadata(Id);
    }
    updateMetadata(Id, ScriptID, ScriptName, Linesofcode, Timetosolve, Numofif, Numoffor, Tags) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.updateMetadata(Id, ScriptID, ScriptName, Linesofcode, Timetosolve, Numofif, Numoffor, Tags);
            return null;
        });
    }
    removeMetadata(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.deleteMetadata(Id);
            return null;
        });
    }
    // Tags
    createTag(createTagsDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.authoringService.createTag(createTagsDto);
        });
    }
    getTags(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.authoringService.getTags(email);
            return result;
        });
    }
    getTag(Id) {
        return this.authoringService.getTag(Id);
    }
    updateTag(Id, Language, Tag) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.updateTag(Id, Language, Tag);
            return null;
        });
    }
    removeTag(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.authoringService.deleteTag(Id);
            return null;
        });
    }
};
(0, tslib_1.__decorate)([
    (0, common_1.Post)('script'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof script_dto_1.CreateScriptDto !== "undefined" && script_dto_1.CreateScriptDto) === "function" ? _a : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "createScript", null);
(0, tslib_1.__decorate)([
    (0, common_1.Patch)('script/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)('email')),
    (0, tslib_1.__param)(2, (0, common_1.Body)('name')),
    (0, tslib_1.__param)(3, (0, common_1.Body)('description')),
    (0, tslib_1.__param)(4, (0, common_1.Body)('code')),
    (0, tslib_1.__param)(5, (0, common_1.Body)('language')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, String, String, String, Array, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "updateScript", null);
(0, tslib_1.__decorate)([
    (0, common_1.Delete)('script/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "removeScript", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('script/:email'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('email')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "getScripts", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('hint'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof hint_dto_1.CreateHintDto !== "undefined" && hint_dto_1.CreateHintDto) === "function" ? _b : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "createHint", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('hint/:email'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('email')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "getHints", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('hint/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], AuthoringController.prototype, "getHint", null);
(0, tslib_1.__decorate)([
    (0, common_1.Patch)('hint/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)('scriptid')),
    (0, tslib_1.__param)(2, (0, common_1.Body)('scriptname')),
    (0, tslib_1.__param)(3, (0, common_1.Body)('title')),
    (0, tslib_1.__param)(4, (0, common_1.Body)('description')),
    (0, tslib_1.__param)(5, (0, common_1.Body)('code')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, String, String, String, String, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "updateHint", null);
(0, tslib_1.__decorate)([
    (0, common_1.Delete)('hint/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "removeHint", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('edumaterial'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof edumaterial_dto_1.CreateEduMaterialDto !== "undefined" && edumaterial_dto_1.CreateEduMaterialDto) === "function" ? _c : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "createEduMaterial", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('edumaterial/:email'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('email')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "getEduMaterials", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('edumaterial/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], AuthoringController.prototype, "getEduMaterial", null);
(0, tslib_1.__decorate)([
    (0, common_1.Patch)('edumaterial/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)('scriptid')),
    (0, tslib_1.__param)(2, (0, common_1.Body)('scriptname')),
    (0, tslib_1.__param)(3, (0, common_1.Body)('about')),
    (0, tslib_1.__param)(4, (0, common_1.Body)('file')),
    (0, tslib_1.__param)(5, (0, common_1.Body)('video')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, String, String, String, String, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "updateEduMaterial", null);
(0, tslib_1.__decorate)([
    (0, common_1.Delete)('edumaterial/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "removeEduMaterial", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('metadata'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof metadata_dto_1.CreateMetadataDto !== "undefined" && metadata_dto_1.CreateMetadataDto) === "function" ? _d : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "createMetadata", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('metadata/:email'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('email')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "getMetadatas", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('metadata/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], AuthoringController.prototype, "getMetadata", null);
(0, tslib_1.__decorate)([
    (0, common_1.Patch)('metadata/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)('scriptid')),
    (0, tslib_1.__param)(2, (0, common_1.Body)('scriptname')),
    (0, tslib_1.__param)(3, (0, common_1.Body)('linesofcode')),
    (0, tslib_1.__param)(4, (0, common_1.Body)('timetosolve')),
    (0, tslib_1.__param)(5, (0, common_1.Body)('numofif')),
    (0, tslib_1.__param)(6, (0, common_1.Body)('numoffor')),
    (0, tslib_1.__param)(7, (0, common_1.Body)('tags')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, String, String, String, String, String, String, Array]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "updateMetadata", null);
(0, tslib_1.__decorate)([
    (0, common_1.Delete)('metadata/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "removeMetadata", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('tags'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof tags_dto_1.CreateTagsDto !== "undefined" && tags_dto_1.CreateTagsDto) === "function" ? _e : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "createTag", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('tags/:email'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('email')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "getTags", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('tags/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], AuthoringController.prototype, "getTag", null);
(0, tslib_1.__decorate)([
    (0, common_1.Patch)('tags/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(1, (0, common_1.Body)('language')),
    (0, tslib_1.__param)(2, (0, common_1.Body)('tag')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String, String, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "updateTag", null);
(0, tslib_1.__decorate)([
    (0, common_1.Delete)('tags/:id'),
    (0, tslib_1.__param)(0, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthoringController.prototype, "removeTag", null);
AuthoringController = (0, tslib_1.__decorate)([
    (0, common_1.Controller)('authoring'),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof authoring_service_1.AuthoringService !== "undefined" && authoring_service_1.AuthoringService) === "function" ? _f : Object])
], AuthoringController);
exports.AuthoringController = AuthoringController;


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/authoring.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthoringModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const authoring_controller_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/authoring.controller.ts");
const authoring_service_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/authoring.service.ts");
const hint_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/hint.schema.ts");
const script_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/script.schema.ts");
const edumaterial_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/edumaterial.schema.ts");
const metadata_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/metadata.schema.ts");
const tags_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/tags.schema.ts");
let AuthoringModule = class AuthoringModule {
};
AuthoringModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: hint_schema_1.Hint.name, schema: hint_schema_1.HintSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: script_schema_1.Script.name, schema: script_schema_1.ScriptSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: edumaterial_schema_1.EduMaterial.name, schema: edumaterial_schema_1.EduMaterialSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: metadata_schema_1.Metadata.name, schema: metadata_schema_1.MetadataSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: tags_schema_1.Tags.name, schema: tags_schema_1.TagsSchema }]),
        ],
        controllers: [authoring_controller_1.AuthoringController],
        providers: [authoring_service_1.AuthoringService],
    })
], AuthoringModule);
exports.AuthoringModule = AuthoringModule;


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/authoring.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthoringService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
const hint_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/hint.schema.ts");
const script_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/script.schema.ts");
const edumaterial_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/edumaterial.schema.ts");
const metadata_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/metadata.schema.ts");
const tags_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/authoring/schemas/tags.schema.ts");
let AuthoringService = class AuthoringService {
    constructor(hintModel, scriptModel, eduMaterialModel, metadataModel, tagsModel) {
        this.hintModel = hintModel;
        this.scriptModel = scriptModel;
        this.eduMaterialModel = eduMaterialModel;
        this.metadataModel = metadataModel;
        this.tagsModel = tagsModel;
    }
    // Scripts
    createScript(createScriptDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const createdScript = new this.scriptModel(createScriptDto);
            return yield createdScript.save();
        });
    }
    updateScript(sriptId, email, name, description, code, language) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const updatedScript = yield this.findScript(sriptId);
            if (email) {
                updatedScript.email = email;
            }
            if (name) {
                updatedScript.name = name;
            }
            if (description) {
                updatedScript.description = description;
            }
            if (code) {
                updatedScript.code = code;
            }
            if (language) {
                updatedScript.language = language;
            }
            updatedScript.save();
        });
    }
    deleteScript(scriptId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.scriptModel.deleteOne({ _id: scriptId }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Could not find Script');
            }
        });
    }
    getScripts(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.scriptModel.find({ 'email': email }).exec();
        });
    }
    findScript(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.scriptModel.findById(id);
            }
            catch (error) {
                throw new common_1.NotFoundException('No result');
            }
            if (!result) {
                throw new common_1.NotFoundException('No result');
            }
            return result;
        });
    }
    // Hints
    createHint(createHintDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const createdHint = new this.hintModel(createHintDto);
            return yield createdHint.save();
        });
    }
    getHints(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.hintModel.find({ 'email': email }).exec();
        });
    }
    getHint(hintId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.findHint(hintId);
        });
    }
    updateHint(hintId, scriptid, scriptname, title, descr, code) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const updatedHint = yield this.findHint(hintId);
            if (scriptid) {
                updatedHint.scriptid = scriptid;
            }
            if (scriptname) {
                updatedHint.scriptname = scriptname;
            }
            if (title) {
                updatedHint.title = title;
            }
            if (descr) {
                updatedHint.description = descr;
            }
            if (code) {
                updatedHint.code = code;
            }
            updatedHint.save();
        });
    }
    deleteHint(hintId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.hintModel.deleteOne({ _id: hintId }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Could not find Hint');
            }
        });
    }
    findHint(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.hintModel.findById(id);
            }
            catch (error) {
                throw new common_1.NotFoundException('No result');
            }
            if (!result) {
                throw new common_1.NotFoundException('No result');
            }
            return result;
        });
    }
    // EduMaterial
    createEduMaterial(createEduMaterialDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const createdEduMaterial = new this.eduMaterialModel(createEduMaterialDto);
            return yield createdEduMaterial.save();
        });
    }
    getEduMaterials(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.eduMaterialModel.find({ 'email': email }).exec();
        });
    }
    getEduMaterial(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.findEduMaterial(Id);
        });
    }
    updateEduMaterial(Id, scriptid, scriptname, about, file, video) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const updatedEduMaterial = yield this.findEduMaterial(Id);
            if (scriptid) {
                updatedEduMaterial.scriptid = scriptid;
            }
            if (scriptname) {
                updatedEduMaterial.scriptname = scriptname;
            }
            if (about) {
                updatedEduMaterial.about = about;
            }
            if (file) {
                updatedEduMaterial.file = file;
            }
            if (video) {
                updatedEduMaterial.video = video;
            }
            updatedEduMaterial.save();
        });
    }
    deleteEduMaterial(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.eduMaterialModel.deleteOne({ _id: Id }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Could not find Material');
            }
        });
    }
    findEduMaterial(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.eduMaterialModel.findById(id);
            }
            catch (error) {
                throw new common_1.NotFoundException('No result');
            }
            if (!result) {
                throw new common_1.NotFoundException('No result');
            }
            return result;
        });
    }
    // Metadata
    createMetadata(createMetadataDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const createdMetadata = new this.metadataModel(createMetadataDto);
            return yield createdMetadata.save();
        });
    }
    getMetadatas(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.metadataModel.find({ 'email': email }).exec();
        });
    }
    getMetadata(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.findMetadata(Id);
        });
    }
    updateMetadata(Id, scriptid, scriptname, linesofcode, timetosolve, numofif, numoffor, tags) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const updatedMetadata = yield this.findMetadata(Id);
            if (scriptid) {
                updatedMetadata.scriptid = scriptid;
            }
            if (scriptname) {
                updatedMetadata.scriptname = scriptname;
            }
            if (linesofcode) {
                updatedMetadata.linesofcode = linesofcode;
            }
            if (timetosolve) {
                updatedMetadata.timetosolve = timetosolve;
            }
            if (numofif) {
                updatedMetadata.numofif = numofif;
            }
            if (numoffor) {
                updatedMetadata.numoffor = numoffor;
            }
            if (tags) {
                updatedMetadata.tags = tags;
            }
            updatedMetadata.save();
        });
    }
    deleteMetadata(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.metadataModel.deleteOne({ _id: Id }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Could not find Metadata');
            }
        });
    }
    findMetadata(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.metadataModel.findById(id);
            }
            catch (error) {
                throw new common_1.NotFoundException('No result');
            }
            if (!result) {
                throw new common_1.NotFoundException('No result');
            }
            return result;
        });
    }
    // Tags
    createTag(createTagsDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            console.log(createTagsDto);
            const createdTag = new this.tagsModel(createTagsDto);
            return yield createdTag.save();
        });
    }
    getTags(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.tagsModel.find({ 'email': email }).exec();
        });
    }
    getTag(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.findTag(Id);
        });
    }
    updateTag(Id, language, tag) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const updatedTag = yield this.findTag(Id);
            if (language) {
                updatedTag.language = language;
            }
            if (tag) {
                updatedTag.tag = tag;
            }
            updatedTag.save();
        });
    }
    deleteTag(Id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const result = yield this.tagsModel.deleteOne({ _id: Id }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Could not find Tag');
            }
        });
    }
    findTag(id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.tagsModel.findById(id);
            }
            catch (error) {
                throw new common_1.NotFoundException('No result');
            }
            if (!result) {
                throw new common_1.NotFoundException('No result');
            }
            return result;
        });
    }
};
AuthoringService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, mongoose_1.InjectModel)(hint_schema_1.Hint.name)),
    (0, tslib_1.__param)(1, (0, mongoose_1.InjectModel)(script_schema_1.Script.name)),
    (0, tslib_1.__param)(2, (0, mongoose_1.InjectModel)(edumaterial_schema_1.EduMaterial.name)),
    (0, tslib_1.__param)(3, (0, mongoose_1.InjectModel)(metadata_schema_1.Metadata.name)),
    (0, tslib_1.__param)(4, (0, mongoose_1.InjectModel)(tags_schema_1.Tags.name)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
], AuthoringService);
exports.AuthoringService = AuthoringService;


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/dto/edumaterial.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateEduMaterialDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class CreateEduMaterialDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateEduMaterialDto.prototype, "scriptid", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateEduMaterialDto.prototype, "scriptname", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateEduMaterialDto.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateEduMaterialDto.prototype, "about", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1024),
    (0, tslib_1.__metadata)("design:type", String)
], CreateEduMaterialDto.prototype, "file", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateEduMaterialDto.prototype, "video", void 0);
exports.CreateEduMaterialDto = CreateEduMaterialDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/dto/hint.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateHintDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class CreateHintDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateHintDto.prototype, "scriptid", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateHintDto.prototype, "scriptname", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateHintDto.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateHintDto.prototype, "title", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1024),
    (0, tslib_1.__metadata)("design:type", String)
], CreateHintDto.prototype, "description", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateHintDto.prototype, "code", void 0);
exports.CreateHintDto = CreateHintDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/dto/metadata.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMetadataDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class CreateMetadataDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateMetadataDto.prototype, "scriptid", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateMetadataDto.prototype, "scriptname", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateMetadataDto.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateMetadataDto.prototype, "linesofcode", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1024),
    (0, tslib_1.__metadata)("design:type", String)
], CreateMetadataDto.prototype, "timetosolve", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateMetadataDto.prototype, "numofif", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateMetadataDto.prototype, "numoffor", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object)
], CreateMetadataDto.prototype, "tags", void 0);
exports.CreateMetadataDto = CreateMetadataDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/dto/script.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateScriptDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class CreateScriptDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateScriptDto.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateScriptDto.prototype, "name", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, tslib_1.__metadata)("design:type", String)
], CreateScriptDto.prototype, "Description", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1024),
    (0, tslib_1.__metadata)("design:type", String)
], CreateScriptDto.prototype, "code", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateScriptDto.prototype, "language", void 0);
exports.CreateScriptDto = CreateScriptDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/dto/tags.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTagsDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class CreateTagsDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTagsDto.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTagsDto.prototype, "language", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateTagsDto.prototype, "tag", void 0);
exports.CreateTagsDto = CreateTagsDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/schemas/edumaterial.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EduMaterialSchema = exports.EduMaterial = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
let EduMaterial = class EduMaterial {
};
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], EduMaterial.prototype, "scriptid", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], EduMaterial.prototype, "scriptname", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], EduMaterial.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], EduMaterial.prototype, "about", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], EduMaterial.prototype, "file", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_LAST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], EduMaterial.prototype, "video", void 0);
EduMaterial = (0, tslib_1.__decorate)([
    (0, mongoose_1.Schema)()
], EduMaterial);
exports.EduMaterial = EduMaterial;
exports.EduMaterialSchema = mongoose_1.SchemaFactory.createForClass(EduMaterial);
exports.EduMaterialSchema.virtual('uid').get(function () {
    return this._id.toHexString();
});
exports.EduMaterialSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._v;
    },
});
exports.EduMaterialSchema.set('toObject', { virtuals: true });
exports.EduMaterialSchema.set('timestamps', true);
exports.EduMaterialSchema.set('versionKey', false);


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/schemas/hint.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HintSchema = exports.Hint = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
let Hint = class Hint {
};
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Hint.prototype, "scriptid", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Hint.prototype, "scriptname", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Hint.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Hint.prototype, "title", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Hint.prototype, "description", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_LAST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Hint.prototype, "code", void 0);
Hint = (0, tslib_1.__decorate)([
    (0, mongoose_1.Schema)()
], Hint);
exports.Hint = Hint;
exports.HintSchema = mongoose_1.SchemaFactory.createForClass(Hint);
exports.HintSchema.virtual('uid').get(function () {
    return this._id.toHexString();
});
exports.HintSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._v;
    },
});
exports.HintSchema.set('toObject', { virtuals: true });
exports.HintSchema.set('timestamps', true);
exports.HintSchema.set('versionKey', false);


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/schemas/metadata.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MetadataSchema = exports.Metadata = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
let Metadata = class Metadata {
};
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Metadata.prototype, "scriptid", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Metadata.prototype, "scriptname", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Metadata.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Metadata.prototype, "linesofcode", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Metadata.prototype, "timetosolve", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_LAST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Metadata.prototype, "numofif", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_LAST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Metadata.prototype, "numoffor", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_LAST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object)
], Metadata.prototype, "tags", void 0);
Metadata = (0, tslib_1.__decorate)([
    (0, mongoose_1.Schema)()
], Metadata);
exports.Metadata = Metadata;
exports.MetadataSchema = mongoose_1.SchemaFactory.createForClass(Metadata);
exports.MetadataSchema.virtual('uid').get(function () {
    return this._id.toHexString();
});
exports.MetadataSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._v;
    },
});
exports.MetadataSchema.set('toObject', { virtuals: true });
exports.MetadataSchema.set('timestamps', true);
exports.MetadataSchema.set('versionKey', false);


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/schemas/script.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScriptSchema = exports.Script = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
let Script = class Script {
};
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Script.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Script.prototype, "name", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Script.prototype, "description", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object)
], Script.prototype, "code", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_LAST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Script.prototype, "language", void 0);
Script = (0, tslib_1.__decorate)([
    (0, mongoose_1.Schema)()
], Script);
exports.Script = Script;
exports.ScriptSchema = mongoose_1.SchemaFactory.createForClass(Script);
exports.ScriptSchema.virtual('uid').get(function () {
    return this._id.toHexString();
});
exports.ScriptSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._v;
    },
});
exports.ScriptSchema.set('toObject', { virtuals: true });
exports.ScriptSchema.set('timestamps', true);
exports.ScriptSchema.set('versionKey', false);


/***/ }),

/***/ "./apps/gnosys-api/src/app/authoring/schemas/tags.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagsSchema = exports.Tags = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
let Tags = class Tags {
};
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Tags.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Tags.prototype, "language", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], Tags.prototype, "tag", void 0);
Tags = (0, tslib_1.__decorate)([
    (0, mongoose_1.Schema)()
], Tags);
exports.Tags = Tags;
exports.TagsSchema = mongoose_1.SchemaFactory.createForClass(Tags);
exports.TagsSchema.virtual('uid').get(function () {
    return this._id.toHexString();
});
exports.TagsSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._v;
    },
});
exports.TagsSchema.set('toObject', { virtuals: true });
exports.TagsSchema.set('timestamps', true);
exports.TagsSchema.set('versionKey', false);


/***/ }),

/***/ "./apps/gnosys-api/src/app/mail/mail.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mail_1 = __webpack_require__("@sendgrid/mail");
const mail_service_1 = __webpack_require__("./apps/gnosys-api/src/app/mail/mail.service.ts");
let MailModule = class MailModule {
};
MailModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        exports: [mail_service_1.GnosysMailService],
        providers: [mail_1.MailService, mail_service_1.GnosysMailService],
    })
], MailModule);
exports.MailModule = MailModule;


/***/ }),

/***/ "./apps/gnosys-api/src/app/mail/mail.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GnosysMailService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mail_1 = __webpack_require__("@sendgrid/mail");
const environment_1 = __webpack_require__("./apps/gnosys-api/src/environments/environment.ts");
let GnosysMailService = class GnosysMailService {
    constructor(mailService) {
        this.mailService = mailService;
    }
    sendUserConfirmation(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const uuid = user.verification;
            this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
            const url = `http://${environment_1.environment.gnosysURL}/#/verify/${uuid}`;
            yield this.mailService.send({
                to: user.email,
                from: 'gnosys Support Team <gnosys@gnosys.tech>',
                templateId: 'd-1c3af41cf45942e4a42594cb59365aa4',
                dynamicTemplateData: {
                    givenName: user.firstName,
                    url,
                },
            });
        });
    }
    sendPasswordResetLink(forgotPassword) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const uuid = forgotPassword.verification;
            this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
            const url = `http://${environment_1.environment.gnosysURL}/#/reset/${uuid}`;
            yield this.mailService.send({
                to: forgotPassword.email,
                from: 'gnosys Support Team <gnosys@gnosys.tech>',
                templateId: 'd-a1208720734d4abd877de89f90904c4f',
                dynamicTemplateData: { url },
            });
        });
    }
};
GnosysMailService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof mail_1.MailService !== "undefined" && mail_1.MailService) === "function" ? _a : Object])
], GnosysMailService);
exports.GnosysMailService = GnosysMailService;


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/dto/create-forgot-password.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateForgotPasswordDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class CreateForgotPasswordDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsEmail)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateForgotPasswordDto.prototype, "email", void 0);
exports.CreateForgotPasswordDto = CreateForgotPasswordDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/dto/create-user.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class CreateUserDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsEmail)(),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1024),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "password", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "givenName", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, tslib_1.__metadata)("design:type", String)
], CreateUserDto.prototype, "familyName", void 0);
exports.CreateUserDto = CreateUserDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/dto/login-user.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginUserDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class LoginUserDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsEmail)(),
    (0, tslib_1.__metadata)("design:type", String)
], LoginUserDto.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1024),
    (0, tslib_1.__metadata)("design:type", String)
], LoginUserDto.prototype, "password", void 0);
exports.LoginUserDto = LoginUserDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/dto/reset-password.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class ResetPasswordDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsEmail)(),
    (0, tslib_1.__metadata)("design:type", String)
], ResetPasswordDto.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1024),
    (0, tslib_1.__metadata)("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
exports.ResetPasswordDto = ResetPasswordDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/dto/verify-uuid.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyUuidDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class VerifyUuidDto {
}
(0, tslib_1.__decorate)([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, tslib_1.__metadata)("design:type", String)
], VerifyUuidDto.prototype, "verification", void 0);
exports.VerifyUuidDto = VerifyUuidDto;


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/schemas/forgot-password.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordSchema = exports.ForgotPassword = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const validator_1 = (0, tslib_1.__importDefault)(__webpack_require__("validator"));
let ForgotPassword = class ForgotPassword {
};
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({
        required: [true, 'Email is blank'],
        validate: validator_1.default.isEmail,
    }),
    (0, tslib_1.__metadata)("design:type", String)
], ForgotPassword.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: true, validate: validator_1.default.isUUID }),
    (0, tslib_1.__metadata)("design:type", String)
], ForgotPassword.prototype, "verification", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ default: false }),
    (0, tslib_1.__metadata)("design:type", Boolean)
], ForgotPassword.prototype, "firstUsed", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ default: false }),
    (0, tslib_1.__metadata)("design:type", Boolean)
], ForgotPassword.prototype, "finalUsed", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: true }),
    (0, tslib_1.__metadata)("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ForgotPassword.prototype, "expires", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: true }),
    (0, tslib_1.__metadata)("design:type", String)
], ForgotPassword.prototype, "ip", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: true }),
    (0, tslib_1.__metadata)("design:type", String)
], ForgotPassword.prototype, "browser", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: true }),
    (0, tslib_1.__metadata)("design:type", String)
], ForgotPassword.prototype, "country", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)(),
    (0, tslib_1.__metadata)("design:type", String)
], ForgotPassword.prototype, "ipChanged", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)(),
    (0, tslib_1.__metadata)("design:type", String)
], ForgotPassword.prototype, "browserChanged", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)(),
    (0, tslib_1.__metadata)("design:type", String)
], ForgotPassword.prototype, "countryChanged", void 0);
ForgotPassword = (0, tslib_1.__decorate)([
    (0, mongoose_1.Schema)()
], ForgotPassword);
exports.ForgotPassword = ForgotPassword;
exports.ForgotPasswordSchema = mongoose_1.SchemaFactory.createForClass(ForgotPassword);
exports.ForgotPasswordSchema.set('timestamps', true);
exports.ForgotPasswordSchema.set('versionKey', false);


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/schemas/user.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const validator_1 = (0, tslib_1.__importDefault)(__webpack_require__("validator"));
const bcrypt = (0, tslib_1.__importStar)(__webpack_require__("bcrypt"));
let User = class User {
};
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({
        lowercase: true,
        validate: validator_1.default.isEmail,
        maxlength: 256,
        minlength: 6,
        required: [true, 'BLANK_EMAIL'],
        unique: true,
    }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "email", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ maxlength: 1024, minlength: 8, required: [true, 'BLANK_PASSWORD'] }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "password", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_FIRST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "firstName", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ required: [true, 'BLANK_LAST_NAME'] }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "lastName", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ default: ['user'] }),
    (0, tslib_1.__metadata)("design:type", Array)
], User.prototype, "roles", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ validate: validator_1.default.isUUID }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "verification", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ default: false }),
    (0, tslib_1.__metadata)("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ default: Date.now }),
    (0, tslib_1.__metadata)("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "verificationExpires", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ default: 0 }),
    (0, tslib_1.__metadata)("design:type", Number)
], User.prototype, "loginAttempts", void 0);
(0, tslib_1.__decorate)([
    (0, mongoose_1.Prop)({ default: Date.now }),
    (0, tslib_1.__metadata)("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "blockExpires", void 0);
User = (0, tslib_1.__decorate)([
    (0, mongoose_1.Schema)()
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.pre('save', function (next) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        try {
            if (!this.isModified('password')) {
                return next();
            }
            const hashed = yield bcrypt.hash(this['password'], 10);
            this['password'] = hashed;
            return next();
        }
        catch (err) {
            return next(err);
        }
    });
});
exports.UserSchema.virtual('uid').get(function () {
    return this._id.toHexString();
});
exports.UserSchema.virtual('displayName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
exports.UserSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
        delete ret.id;
    },
});
exports.UserSchema.set('toObject', { virtuals: true });
exports.UserSchema.set('timestamps', true);
exports.UserSchema.set('versionKey', false);


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/users.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const express_1 = __webpack_require__("express");
const create_forgot_password_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/users/dto/create-forgot-password.dto.ts");
const create_user_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/users/dto/create-user.dto.ts");
const login_user_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/users/dto/login-user.dto.ts");
const reset_password_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/users/dto/reset-password.dto.ts");
const verify_uuid_dto_1 = __webpack_require__("./apps/gnosys-api/src/app/users/dto/verify-uuid.dto.ts");
const users_service_1 = __webpack_require__("./apps/gnosys-api/src/app/users/users.service.ts");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    register(createUserDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.userService.create(createUserDto);
        });
    }
    verifyEmail(req, verifyUuidDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.userService.verifyEmail(req, verifyUuidDto);
        });
    }
    login(req, loginUserDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.userService.login(req, loginUserDto);
        });
    }
    forgotPassword(req, createForfotPasswordDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.userService.forgotPassword(req, createForfotPasswordDto);
        });
    }
    forgotPasswordVerify(req, verifyUuidDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.userService.forgotPasswordVerify(req, verifyUuidDto);
        });
    }
    resetPassword(resetPasswordDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return yield this.userService.resetPassword(resetPasswordDto);
        });
    }
};
(0, tslib_1.__decorate)([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _a : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "register", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('verify'),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object, typeof (_c = typeof verify_uuid_dto_1.VerifyUuidDto !== "undefined" && verify_uuid_dto_1.VerifyUuidDto) === "function" ? _c : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "verifyEmail", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _d : Object, typeof (_e = typeof login_user_dto_1.LoginUserDto !== "undefined" && login_user_dto_1.LoginUserDto) === "function" ? _e : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "login", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object, typeof (_g = typeof create_forgot_password_dto_1.CreateForgotPasswordDto !== "undefined" && create_forgot_password_dto_1.CreateForgotPasswordDto) === "function" ? _g : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "forgotPassword", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('forgot-password-verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_h = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _h : Object, typeof (_j = typeof verify_uuid_dto_1.VerifyUuidDto !== "undefined" && verify_uuid_dto_1.VerifyUuidDto) === "function" ? _j : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "forgotPasswordVerify", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, tslib_1.__param)(0, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_k = typeof reset_password_dto_1.ResetPasswordDto !== "undefined" && reset_password_dto_1.ResetPasswordDto) === "function" ? _k : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
UsersController = (0, tslib_1.__decorate)([
    (0, common_1.Controller)('user'),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_l = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _l : Object])
], UsersController);
exports.UsersController = UsersController;


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/users.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const users_controller_1 = __webpack_require__("./apps/gnosys-api/src/app/users/users.controller.ts");
const users_service_1 = __webpack_require__("./apps/gnosys-api/src/app/users/users.service.ts");
const user_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/users/schemas/user.schema.ts");
const forgot_password_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/users/schemas/forgot-password.schema.ts");
const auth_module_1 = __webpack_require__("./apps/gnosys-api/src/app/auth/auth.module.ts");
const mail_module_1 = __webpack_require__("./apps/gnosys-api/src/app/mail/mail.module.ts");
let UsersModule = class UsersModule {
};
UsersModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            mongoose_1.MongooseModule.forFeature([
                { name: forgot_password_schema_1.ForgotPassword.name, schema: forgot_password_schema_1.ForgotPasswordSchema },
            ]),
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
    })
], UsersModule);
exports.UsersModule = UsersModule;


/***/ }),

/***/ "./apps/gnosys-api/src/app/users/users.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("mongoose");
const uuid_1 = __webpack_require__("uuid");
const date_fns_1 = __webpack_require__("date-fns");
const bcrypt = (0, tslib_1.__importStar)(__webpack_require__("bcrypt"));
const mongoose_2 = __webpack_require__("@nestjs/mongoose");
const user_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/users/schemas/user.schema.ts");
const forgot_password_schema_1 = __webpack_require__("./apps/gnosys-api/src/app/users/schemas/forgot-password.schema.ts");
const auth_service_1 = __webpack_require__("./apps/gnosys-api/src/app/auth/auth.service.ts");
const mail_service_1 = __webpack_require__("./apps/gnosys-api/src/app/mail/mail.service.ts");
let UsersService = class UsersService {
    constructor(userModel, forgotPasswordModel, mailService, authService) {
        this.userModel = userModel;
        this.forgotPasswordModel = forgotPasswordModel;
        this.mailService = mailService;
        this.authService = authService;
        this.hours_to_verify_signup = 12;
        this.hours_to_verify = 4;
        this.login_attempts_to_block = 6;
        this.hours_to_block = 8;
    }
    create(createUserDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const createdUser = new this.userModel(createUserDto);
            yield this.isEmailUnique(createdUser.email);
            this.setRegistrationInfo(createdUser);
            // Sxolio apo marko, den exoume to api key tou send mail
            //await this.sendRegistrationEmail(createdUser);
            return yield createdUser.save();
        });
    }
    verifyEmail(req, veryfyUuidDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.findUserByVerification(veryfyUuidDto.verification);
            yield this.setUserAsVerified(user);
            return {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: `${user.firstName} ${user.lastName}`,
                emailVerified: user.emailVerified,
                accessToken: yield this.authService.createAccessToken(user._id),
                refreshToken: yield this.authService.createRefreshToken(req, user._id),
                roles: user.roles,
            };
        });
    }
    login(req, loginUserDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(loginUserDto.email);
            this.isUserBlocked(user);
            yield this.checkPassword(loginUserDto.password, user);
            yield this.passwordsDoMatch(user);
            return {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: `${user.firstName} ${user.lastName}`,
                emailVerified: user.emailVerified,
                accessToken: yield this.authService.createAccessToken(user._id),
                refreshToken: yield this.authService.createRefreshToken(req, user._id),
                roles: user.roles,
            };
        });
    }
    forgotPassword(req, createForgotPasswordDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.findUserByEmail(createForgotPasswordDto.email);
            yield this.saveForgotPassword(req, createForgotPasswordDto);
            return {
                email: createForgotPasswordDto.email,
                message: 'Verification sent.',
            };
        });
    }
    forgotPasswordVerify(req, verifyUuidDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const forgotPassword = yield this.findForgotPasswordByUuid(verifyUuidDto);
            yield this.setForgotPasswordFirstUsed(req, forgotPassword);
            return {
                email: forgotPassword.email,
                message: 'Now reset your password.',
            };
        });
    }
    resetPassword(resetPasswordDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const forgotPassword = yield this.findForgotPasswordByEmail(resetPasswordDto);
            yield this.setForgotPasswordFinalUsed(forgotPassword);
            yield this.resetUserPassword(resetPasswordDto);
            return {
                email: resetPasswordDto.email,
                message: 'Password successfully changed.',
            };
        });
    }
    findAll() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return this.userModel.find().exec();
        });
    }
    //
    // Private Methods (operate on Mongoose Documents)
    //
    isEmailUnique(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ email, verified: true });
            if (user) {
                throw new common_1.BadRequestException('User already exists.');
            }
        });
    }
    setRegistrationInfo(user) {
        user.verification = (0, uuid_1.v4)();
        user.verificationExpires = (0, date_fns_1.addHours)(new Date(), this.hours_to_verify);
    }
    findUserByVerification(verification) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({
                verification,
                emailVerified: false,
                verificationExpires: { $gt: new Date() },
            });
            if (!user) {
                throw new common_1.BadRequestException('Verification Expired.');
            }
            return user;
        });
    }
    findUserByEmail(email) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ email, emailVerified: true });
            if (!user) {
                throw new common_1.NotFoundException('Wrong or not verified email.');
            }
            return user;
        });
    }
    isUserBlocked(user) {
        if (user.blockExpires > new Date(Date.now())) {
            throw new common_1.ConflictException('User has been blocked, try again later.');
        }
    }
    checkPassword(attemptPass, user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const match = yield bcrypt.compare(attemptPass, user.password);
            if (!match) {
                yield this.passwordsDoNotMatch(user);
                throw new common_1.NotFoundException(`Wrong email or password (${user.loginAttempts}/${this.login_attempts_to_block}).`);
            }
            return match;
        });
    }
    passwordsDoNotMatch(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            user.loginAttempts += 1;
            yield user.save();
            if (user.loginAttempts >= this.login_attempts_to_block) {
                yield this.blockUser(user);
                throw new common_1.ConflictException('User blocked.');
            }
        });
    }
    blockUser(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            user.blockExpires = (0, date_fns_1.addHours)(new Date(), this.hours_to_block);
            yield user.save();
        });
    }
    setUserAsVerified(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            user.emailVerified = true;
            yield user.save();
        });
    }
    passwordsDoMatch(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            user.loginAttempts = 0;
            yield user.save();
        });
    }
    sendRegistrationEmail(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            yield this.mailService.sendUserConfirmation(user);
        });
    }
    // Forgot password related
    saveForgotPassword(req, createForgotPasswordDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const forgotPassword = yield this.forgotPasswordModel.create({
                email: createForgotPasswordDto.email,
                verification: (0, uuid_1.v4)(),
                expires: (0, date_fns_1.addHours)(new Date(), this.hours_to_verify),
                ip: this.authService.getIp(req),
                browser: this.authService.getBrowserInfo(req),
                country: this.authService.getCountry(req),
            });
            yield this.mailService.sendPasswordResetLink(forgotPassword);
            yield forgotPassword.save();
        });
    }
    findForgotPasswordByUuid(verifyUuidDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const forgotPassword = yield this.forgotPasswordModel.findOne({
                verification: verifyUuidDto.verification,
                firstUsed: false,
                finalUsed: false,
                expires: { $gt: new Date() },
            });
            if (!forgotPassword) {
                throw new common_1.BadRequestException('Invalid or expired reset link.');
            }
            return forgotPassword;
        });
    }
    setForgotPasswordFirstUsed(req, forgotPassword) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            forgotPassword.firstUsed = true;
            forgotPassword.ipChanged = this.authService.getIp(req);
            forgotPassword.browserChanged = this.authService.getBrowserInfo(req);
            forgotPassword.countryChanged = this.authService.getCountry(req);
            yield forgotPassword.save();
        });
    }
    findForgotPasswordByEmail(resetPasswordDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const forgotPassword = yield this.forgotPasswordModel.findOne({
                email: resetPasswordDto.email,
                firstUsed: true,
                finalUsed: false,
                expires: { $gt: new Date() },
            });
            if (!forgotPassword) {
                throw new common_1.BadRequestException('Bad request.');
            }
            return forgotPassword;
        });
    }
    setForgotPasswordFinalUsed(forgotPassword) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            forgotPassword.finalUsed = true;
            yield forgotPassword.save();
        });
    }
    resetUserPassword(resetPasswordDto) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({
                email: resetPasswordDto.email,
                verified: true,
            });
            user.password = resetPasswordDto.password;
            yield user.save();
        });
    }
};
UsersService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    (0, tslib_1.__param)(1, (0, mongoose_2.InjectModel)(forgot_password_schema_1.ForgotPassword.name)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _b : Object, typeof (_c = typeof mail_service_1.GnosysMailService !== "undefined" && mail_service_1.GnosysMailService) === "function" ? _c : Object, typeof (_d = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _d : Object])
], UsersService);
exports.UsersService = UsersService;


/***/ }),

/***/ "./apps/gnosys-api/src/environments/environment.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.environment = void 0;
exports.environment = {
    production: false,
    gnosysURL: 'localhost:4200',
};


/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mongoose":
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/serve-static":
/***/ ((module) => {

module.exports = require("@nestjs/serve-static");

/***/ }),

/***/ "@sendgrid/mail":
/***/ ((module) => {

module.exports = require("@sendgrid/mail");

/***/ }),

/***/ "bcrypt":
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-validator":
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "cryptr":
/***/ ((module) => {

module.exports = require("cryptr");

/***/ }),

/***/ "date-fns":
/***/ ((module) => {

module.exports = require("date-fns");

/***/ }),

/***/ "express":
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "passport-jwt":
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "request-ip":
/***/ ((module) => {

module.exports = require("request-ip");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "uuid":
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "validator":
/***/ ((module) => {

module.exports = require("validator");

/***/ }),

/***/ "path":
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const app_module_1 = __webpack_require__("./apps/gnosys-api/src/app/app.module.ts");
function bootstrap() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        const port = process.env.PORT || 3333;
        yield app.listen(port, () => {
            common_1.Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
        });
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map