/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/taysteer-backend/src/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const recipe_module_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.module.ts");
const common_1 = __webpack_require__("@nestjs/common");
const req_log_middleware_1 = __webpack_require__("./apps/taysteer-backend/src/middleware/req.log.middleware.ts");
const http_exception_filter_1 = __webpack_require__("./apps/taysteer-backend/src/middleware/http-exception.filter.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const ormconfig_1 = __webpack_require__("./apps/taysteer-backend/src/ormconfig.ts");
const user_module_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.module.ts");
const auth_module_1 = __webpack_require__("./apps/taysteer-backend/src/auth/auth.module.ts");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(req_log_middleware_1.ReqLogMiddleware).forRoutes({
            path: '*',
            method: common_1.RequestMethod.ALL,
        });
    }
};
AppModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(ormconfig_1.connectionOptions),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            recipe_module_1.RecipeModule,
        ],
        providers: [http_exception_filter_1.HttpErrorFilter],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./apps/taysteer-backend/src/auth/auth.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__("tslib");
const fastify_1 = __webpack_require__("fastify");
const cookie_auth_guard_1 = __webpack_require__("./apps/taysteer-backend/src/auth/guards/cookie-auth.guard.ts");
const common_1 = __webpack_require__("@nestjs/common");
const express_1 = __webpack_require__("express");
const local_auth_guard_1 = __webpack_require__("./apps/taysteer-backend/src/auth/guards/local-auth.guard.ts");
let AuthController = class AuthController {
    login(res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return res.status(common_1.HttpStatus.OK).send();
        });
    }
    logout(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            req.logOut();
            return res.status(common_1.HttpStatus.OK).send();
        });
    }
};
(0, tslib_1.__decorate)([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    (0, tslib_1.__param)(0, (0, common_1.Res)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _a : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthController.prototype, "login", null);
(0, tslib_1.__decorate)([
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, common_1.Post)('logout'),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof fastify_1.FastifyRequest !== "undefined" && fastify_1.FastifyRequest) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = (0, tslib_1.__decorate)([
    (0, common_1.Controller)('api'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor)
], AuthController);
exports.AuthController = AuthController;


/***/ }),

/***/ "./apps/taysteer-backend/src/auth/auth.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const auth_controller_1 = __webpack_require__("./apps/taysteer-backend/src/auth/auth.controller.ts");
const local_strategy_1 = __webpack_require__("./apps/taysteer-backend/src/auth/strategies/local.strategy.ts");
const common_1 = __webpack_require__("@nestjs/common");
const auth_service_1 = __webpack_require__("./apps/taysteer-backend/src/auth/auth.service.ts");
const passport_1 = __webpack_require__("@nestjs/passport");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const local_serializer_1 = __webpack_require__("./apps/taysteer-backend/src/auth/serializers/local.serializer.ts");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
let AuthModule = class AuthModule {
};
AuthModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_model_1.User]),
            passport_1.PassportModule.register({
                session: true,
            }),
        ],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, local_serializer_1.LocalSerializer],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),

/***/ "./apps/taysteer-backend/src/auth/auth.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__("tslib");
const bcryptjs_1 = (0, tslib_1.__importDefault)(__webpack_require__("bcryptjs"));
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("typeorm");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
const typeorm_2 = __webpack_require__("@nestjs/typeorm");
let AuthService = class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    validateUser(login, password) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ login }); // Find user by login
            const verified = user && (yield bcryptjs_1.default.compare(password, user.password)); // Check password
            if (verified) {
                return user_model_1.User.toResponseMin(user);
            }
            else
                return null;
        });
    }
};
AuthService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, typeorm_2.InjectRepository)(user_model_1.User)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),

/***/ "./apps/taysteer-backend/src/auth/guards/cookie-auth.guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CookieAuthGuard = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
let CookieAuthGuard = class CookieAuthGuard {
    canActivate(context) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const request = context.switchToHttp().getRequest();
            const authenticated = request.isAuthenticated();
            if (!authenticated)
                throw new common_1.UnauthorizedException();
            return authenticated;
        });
    }
};
CookieAuthGuard = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)()
], CookieAuthGuard);
exports.CookieAuthGuard = CookieAuthGuard;


/***/ }),

/***/ "./apps/taysteer-backend/src/auth/guards/local-auth.guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalAuthGuard = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
    canActivate(context) {
        const _super = Object.create(null, {
            canActivate: { get: () => super.canActivate },
            logIn: { get: () => super.logIn }
        });
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // check the email and the password
            const canActivate = yield _super.canActivate.call(this, context);
            // initialize the session
            const request = context.switchToHttp().getRequest();
            _super.logIn.call(this, request);
            return Boolean(canActivate);
        });
    }
};
LocalAuthGuard = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)()
], LocalAuthGuard);
exports.LocalAuthGuard = LocalAuthGuard;


/***/ }),

/***/ "./apps/taysteer-backend/src/auth/serializers/local.serializer.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalSerializer = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const passport_serializer_1 = __webpack_require__("./apps/taysteer-backend/src/auth/serializers/passport.serializer.ts");
let LocalSerializer = class LocalSerializer extends passport_serializer_1.PassportSerializer {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
    }
    serializeUser(user) {
        return user.id;
    }
    deserializeUser(userId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne(userId);
            return user ? user : false;
        });
    }
};
LocalSerializer = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, typeorm_1.InjectRepository)(user_model_1.User)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], LocalSerializer);
exports.LocalSerializer = LocalSerializer;


/***/ }),

/***/ "./apps/taysteer-backend/src/auth/serializers/passport.serializer.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PassportSerializer = void 0;
const tslib_1 = __webpack_require__("tslib");
const fastify_passport_1 = (0, tslib_1.__importDefault)(__webpack_require__("fastify-passport"));
class PassportSerializer {
    constructor() {
        const passportInstance = this.getPassportInstance();
        passportInstance.registerUserSerializer((user, request) => this.serializeUser(user, request));
        passportInstance.registerUserDeserializer((userId, request) => this.deserializeUser(userId, request));
    }
    getPassportInstance() {
        return fastify_passport_1.default;
    }
}
exports.PassportSerializer = PassportSerializer;


/***/ }),

/***/ "./apps/taysteer-backend/src/auth/strategies/local.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const passport_local_1 = __webpack_require__("passport-local");
const passport_1 = __webpack_require__("@nestjs/passport");
const common_1 = __webpack_require__("@nestjs/common");
const auth_service_1 = __webpack_require__("./apps/taysteer-backend/src/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({ usernameField: 'login', passwordField: 'password' });
        this.authService = authService;
    }
    validate(login, password) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.authService.validateUser(login, password);
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            return user;
        });
    }
};
LocalStrategy = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),

/***/ "./apps/taysteer-backend/src/middleware/http-exception.filter.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpErrorFilter = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const logger_1 = (0, tslib_1.__importDefault)(__webpack_require__("./apps/taysteer-backend/src/utils/logger.ts"));
let HttpErrorFilter = class HttpErrorFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const req = context.getRequest();
        const res = context.getResponse();
        const next = context.getNext();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = {
            status,
            timestamp: new Date().toLocaleDateString(),
            path: req.url,
            method: req.method,
            params: req.params,
            body: req.body,
            message: exception.message,
        };
        logger_1.default.error(JSON.stringify(errorResponse));
        res.status(status).send({ errorResponse });
        next();
    }
};
HttpErrorFilter = (0, tslib_1.__decorate)([
    (0, common_1.Catch)()
], HttpErrorFilter);
exports.HttpErrorFilter = HttpErrorFilter;


/***/ }),

/***/ "./apps/taysteer-backend/src/middleware/req.log.middleware.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReqLogMiddleware = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const logger_1 = (0, tslib_1.__importDefault)(__webpack_require__("./apps/taysteer-backend/src/utils/logger.ts"));
const current_time_1 = __webpack_require__("./apps/taysteer-backend/src/utils/current.time.ts");
let ReqLogMiddleware = class ReqLogMiddleware {
    use(req, res, next) {
        res.on('finish', () => {
            logger_1.default.log(`[${(0, current_time_1.getTime)()}]\
        Method: ${req.method};\
        Url: ${req.url};\
        Query parameters: ${JSON.stringify(req.query)};\
        Body: ${JSON.stringify(req.body)};\
        Status code: ${res.statusCode}`.replace(/\s{2,}/g, ' '));
        });
        next();
    }
};
ReqLogMiddleware = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)()
], ReqLogMiddleware);
exports.ReqLogMiddleware = ReqLogMiddleware;


/***/ }),

/***/ "./apps/taysteer-backend/src/ormconfig.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.connectionOptions = void 0;
const config_1 = __webpack_require__("./configs/common/config.ts");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const recipe_rating_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.rating.model.ts");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
const recipe_comment_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.comment.model.ts");
exports.connectionOptions = {
    type: 'postgres',
    host: config_1.POSTGRES_HOST,
    port: config_1.POSTGRES_PORT,
    username: config_1.POSTGRES_USER,
    password: config_1.POSTGRES_PASSWORD,
    database: config_1.POSTGRES_DATABASE,
    migrationsRun: false,
    synchronize: true,
    logging: false,
    keepConnectionAlive: true,
    autoReconnect: true,
    reconnectTries: 100,
    reconnectionInterval: 2000,
    entities: [user_model_1.User, recipe_model_1.Recipe, recipe_rating_model_1.RecipeRating, recipe_comment_model_1.Comment],
};


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/recipes/recipe.comment.model.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var Comment_1, _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Comment = void 0;
const tslib_1 = __webpack_require__("tslib");
const recipe_service_types_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.service.types.ts");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const typeorm_1 = __webpack_require__("typeorm");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
const promise_loader_1 = __webpack_require__("./apps/taysteer-backend/src/utils/promise.loader.ts");
let Comment = Comment_1 = class Comment extends typeorm_1.BaseEntity {
    constructor({ text = '', updated = false } = {}) {
        super();
        this.text = text;
        this.updated = updated;
    }
    static toResponse(comment) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { id, text, user, date, updated } = comment;
            return (0, promise_loader_1.objectPromise)({
                id,
                text,
                user: user_model_1.User.toResponse(user),
                date,
                updated,
                countOfChildComments: yield this.getRepository().count({
                    relations: [recipe_service_types_1.RecipeStringTypes.MAIN_COMMENT],
                    where: { mainComment: comment },
                }),
            });
        });
    }
    static toResponseDetailed(comment) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { id, text, user, date, updated, childComments } = comment;
            return (0, promise_loader_1.objectPromise)({
                id,
                text,
                user: user_model_1.User.toResponse(user),
                date,
                updated,
                countOfChildComments: yield this.getRepository().count({
                    relations: [recipe_service_types_1.RecipeStringTypes.MAIN_COMMENT],
                    where: { mainComment: comment },
                }),
                childComments: childComments
                    ? yield Promise.all(childComments.map((comment) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () { return yield Comment_1.toResponse(comment); })))
                    : null,
            });
        });
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, tslib_1.__metadata)("design:type", Number)
], Comment.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { length: 500 }),
    (0, tslib_1.__metadata)("design:type", String)
], Comment.prototype, "text", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => recipe_model_1.Recipe, (recipe) => recipe.comments, { onDelete: 'CASCADE' }),
    (0, tslib_1.__metadata)("design:type", typeof (_a = typeof recipe_model_1.Recipe !== "undefined" && recipe_model_1.Recipe) === "function" ? _a : Object)
], Comment.prototype, "recipe", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, { onDelete: 'SET NULL' }),
    (0, tslib_1.__metadata)("design:type", typeof (_b = typeof user_model_1.User !== "undefined" && user_model_1.User) === "function" ? _b : Object)
], Comment.prototype, "user", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.OneToMany)(() => Comment_1, (comment) => comment.mainComment),
    (0, tslib_1.__metadata)("design:type", typeof (_c = typeof Array !== "undefined" && Array) === "function" ? _c : Object)
], Comment.prototype, "childComments", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => Comment_1, (comment) => comment.childComments, {
        onDelete: 'CASCADE',
    }),
    (0, tslib_1.__metadata)("design:type", Comment)
], Comment.prototype, "mainComment", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.CreateDateColumn)(),
    (0, tslib_1.__metadata)("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Comment.prototype, "date", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('boolean', { nullable: false, default: false }),
    (0, tslib_1.__metadata)("design:type", Boolean)
], Comment.prototype, "updated", void 0);
Comment = Comment_1 = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)('Comment'),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], Comment);
exports.Comment = Comment;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/recipes/recipe.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipeController = void 0;
const tslib_1 = __webpack_require__("tslib");
const recipe_comment_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.comment.model.ts");
const recipe_dtos_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.dtos.ts");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const recipe_service_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.service.ts");
const common_1 = __webpack_require__("@nestjs/common");
const cookie_auth_guard_1 = __webpack_require__("./apps/taysteer-backend/src/auth/guards/cookie-auth.guard.ts");
const interfaces_1 = __webpack_require__("./apps/taysteer-backend/src/typification/interfaces.ts");
const express_1 = __webpack_require__("express");
let RecipeController = class RecipeController {
    constructor(recipeService) {
        this.recipeService = recipeService;
    }
    getRecipes(res, page) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const recipes = yield this.recipeService.getRecipes(page);
            return res
                .status(common_1.HttpStatus.OK)
                .send(recipes.map((recipe) => recipe_model_1.Recipe.toResponse(recipe)));
        });
    }
    createRecipe(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const createdRecipe = yield this.recipeService.addRecipe(req.parts(), req.user.id);
            return createdRecipe
                ? res.status(common_1.HttpStatus.CREATED).send(recipe_model_1.Recipe.toResponse(createdRecipe))
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    findRecipes(res, search, page) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const recipes = yield this.recipeService.getRecipesByTitle(search, page);
            return res
                .status(common_1.HttpStatus.OK)
                .send(recipes.map((recipe) => recipe_model_1.Recipe.toResponse(recipe)));
        });
    }
    getRecipe(res, recipeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const recipe = yield this.recipeService.getRecipeById(recipeId);
            return recipe
                ? res.status(common_1.HttpStatus.OK).send(yield recipe_model_1.Recipe.toResponseDetailed(recipe))
                : res.status(common_1.HttpStatus.NOT_FOUND).send();
        });
    }
    updateRecipe(req, res, recipeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const hasRecipeAccess = yield this.recipeService.hasRecipeAccess(req.user.id, recipeId);
            if (!hasRecipeAccess)
                return res.status(common_1.HttpStatus.FORBIDDEN).send();
            const updatedRecipe = yield this.recipeService.updateRecipe(req.parts(), recipeId);
            return updatedRecipe
                ? res.status(common_1.HttpStatus.OK).send(recipe_model_1.Recipe.toResponse(updatedRecipe))
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    deleteRecipe(req, res, recipeId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const hasRecipeAccess = yield this.recipeService.hasRecipeAccess(req.user.id, recipeId);
            if (!hasRecipeAccess)
                return res.status(common_1.HttpStatus.FORBIDDEN).send();
            const deleted = yield this.recipeService.deleteRecipe(recipeId);
            return deleted
                ? res.status(common_1.HttpStatus.NO_CONTENT).send()
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    rateRecipe(req, res, recipeId, rating = 0) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const hasRecipeAccess = !(yield this.recipeService.hasRecipeAccess(req.user.id, recipeId));
            if (!hasRecipeAccess)
                return res.status(common_1.HttpStatus.FORBIDDEN).send();
            const ratedRecipe = yield this.recipeService.rateRecipe(recipeId, req.user.id, Number(rating));
            return ratedRecipe
                ? res.status(common_1.HttpStatus.OK).send(recipe_model_1.Recipe.toResponse(ratedRecipe))
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    getComment(res, commentId, page) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const comment = yield this.recipeService.getCommentWithAnswersById(commentId, page);
            return comment
                ? res
                    .status(common_1.HttpStatus.OK)
                    .send(yield recipe_comment_model_1.Comment.toResponseDetailed(comment))
                : res.status(common_1.HttpStatus.NOT_FOUND).send();
        });
    }
    getRecipeComments(res, recipeId, page) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const comments = yield this.recipeService.getComments(recipeId, page);
            return comments
                ? res
                    .status(common_1.HttpStatus.OK)
                    .send(yield Promise.all(comments.map((comment) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () { return yield recipe_comment_model_1.Comment.toResponse(comment); }))))
                : res.status(common_1.HttpStatus.NOT_FOUND).send();
        });
    }
    commentRecipe(req, res, recipeId, body) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const createdComment = yield this.recipeService.addRecipeComment(body.text, req.user.id, recipeId);
            return createdComment
                ? res
                    .status(common_1.HttpStatus.CREATED)
                    .send(yield recipe_comment_model_1.Comment.toResponse(createdComment))
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    updateRecipeComment(req, res, commentId, body) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const hasRecipeAccess = yield this.recipeService.hasCommentAccess(req.user.id, commentId);
            if (!hasRecipeAccess)
                return res.status(common_1.HttpStatus.FORBIDDEN).send();
            const updatedComment = yield this.recipeService.updateComment(body.text, commentId);
            return updatedComment
                ? res.status(common_1.HttpStatus.OK).send(yield recipe_comment_model_1.Comment.toResponse(updatedComment))
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    deleteRecipeComment(req, res, commentId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const hasRecipeAccess = yield this.recipeService.hasCommentAccess(req.user.id, commentId);
            if (!hasRecipeAccess)
                return res.status(common_1.HttpStatus.FORBIDDEN).send();
            const deletedComment = yield this.recipeService.deleteComment(commentId);
            return deletedComment
                ? res.status(common_1.HttpStatus.NO_CONTENT).send()
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    answerRecipeComment(req, res, commentId, body) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const createdComment = yield this.recipeService.addCommentComment(body.text, req.user.id, commentId);
            return createdComment
                ? res
                    .status(common_1.HttpStatus.CREATED)
                    .send(yield recipe_comment_model_1.Comment.toResponse(createdComment))
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
};
(0, tslib_1.__decorate)([
    (0, common_1.Get)(),
    (0, tslib_1.__param)(0, (0, common_1.Res)()),
    (0, tslib_1.__param)(1, (0, common_1.Query)('page')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _a : Object, Number]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "getRecipes", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "createRecipe", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('find'),
    (0, tslib_1.__param)(0, (0, common_1.Res)()),
    (0, tslib_1.__param)(1, (0, common_1.Query)('search')),
    (0, tslib_1.__param)(2, (0, common_1.Query)('page')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object, String, Number]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "findRecipes", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)(':recipeId'),
    (0, tslib_1.__param)(0, (0, common_1.Res)()),
    (0, tslib_1.__param)(1, (0, common_1.Param)('recipeId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "getRecipe", null);
(0, tslib_1.__decorate)([
    (0, common_1.Put)(':recipeId'),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Param)('recipeId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _f : Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "updateRecipe", null);
(0, tslib_1.__decorate)([
    (0, common_1.Delete)(':recipeId'),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Param)('recipeId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_h = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _h : Object, typeof (_j = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _j : Object, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "deleteRecipe", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)(':recipeId/rate'),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Param)('recipeId')),
    (0, tslib_1.__param)(3, (0, common_1.Query)('rating')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_k = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _k : Object, typeof (_l = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _l : Object, String, Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "rateRecipe", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('comments/:commentId'),
    (0, tslib_1.__param)(0, (0, common_1.Res)()),
    (0, tslib_1.__param)(1, (0, common_1.Param)('commentId')),
    (0, tslib_1.__param)(2, (0, common_1.Query)('page')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_m = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _m : Object, Number, Number]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "getComment", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)(':recipeId/comments'),
    (0, tslib_1.__param)(0, (0, common_1.Res)()),
    (0, tslib_1.__param)(1, (0, common_1.Param)('recipeId')),
    (0, tslib_1.__param)(2, (0, common_1.Query)('page')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_o = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _o : Object, String, Number]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "getRecipeComments", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)(':recipeId/comments'),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Param)('recipeId')),
    (0, tslib_1.__param)(3, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_p = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _p : Object, typeof (_q = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _q : Object, String, typeof (_r = typeof recipe_dtos_1.RecipeCommentDto !== "undefined" && recipe_dtos_1.RecipeCommentDto) === "function" ? _r : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "commentRecipe", null);
(0, tslib_1.__decorate)([
    (0, common_1.Put)('comments/:commentId'),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Param)('commentId')),
    (0, tslib_1.__param)(3, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_s = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _s : Object, typeof (_t = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _t : Object, Number, typeof (_u = typeof recipe_dtos_1.RecipeCommentDto !== "undefined" && recipe_dtos_1.RecipeCommentDto) === "function" ? _u : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "updateRecipeComment", null);
(0, tslib_1.__decorate)([
    (0, common_1.Delete)('comments/:commentId'),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Param)('commentId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_v = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _v : Object, typeof (_w = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _w : Object, Number]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "deleteRecipeComment", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)('comments/:commentId'),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Param)('commentId')),
    (0, tslib_1.__param)(3, (0, common_1.Body)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_x = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _x : Object, typeof (_y = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _y : Object, Number, typeof (_z = typeof recipe_dtos_1.RecipeCommentDto !== "undefined" && recipe_dtos_1.RecipeCommentDto) === "function" ? _z : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], RecipeController.prototype, "answerRecipeComment", null);
RecipeController = (0, tslib_1.__decorate)([
    (0, common_1.Controller)('api/recipes'),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_0 = typeof recipe_service_1.RecipeService !== "undefined" && recipe_service_1.RecipeService) === "function" ? _0 : Object])
], RecipeController);
exports.RecipeController = RecipeController;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/recipes/recipe.dtos.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipeCommentDto = exports.RecipeDataDto = void 0;
class RecipeDataDto {
}
exports.RecipeDataDto = RecipeDataDto;
class RecipeCommentDto {
}
exports.RecipeCommentDto = RecipeCommentDto;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/recipes/recipe.model.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Recipe = void 0;
const tslib_1 = __webpack_require__("tslib");
const recipe_service_types_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.service.types.ts");
const typeorm_1 = __webpack_require__("typeorm");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
const recipe_comment_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.comment.model.ts");
const recipe_rating_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.rating.model.ts");
const promise_loader_1 = __webpack_require__("./apps/taysteer-backend/src/utils/promise.loader.ts");
let Recipe = class Recipe extends typeorm_1.BaseEntity {
    constructor({ title = '', image = '', description = '', ingredients = [], steps = {}, user = new user_model_1.User(), update = false, } = {}) {
        super();
        this.title = title;
        this.description = description;
        this.image = image;
        this.ingredients = ingredients;
        this.steps = steps;
        this.user = user;
        if (!update) {
            this.rating = 0;
            this.ratingsCount = 0;
            this.ratingsSum = 0;
        }
    }
    static toResponse(recipe) {
        const { id, title, image, description, rating } = recipe;
        return { id, title, image, description, rating };
    }
    static toResponseDetailed(recipe) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { id, title, image, description, rating, ratingsCount, user, ingredients, steps, } = recipe;
            return (0, promise_loader_1.objectPromise)({
                id,
                title,
                image,
                description,
                rating,
                ratingsCount,
                user: user_model_1.User.toResponse(user),
                ingredients,
                steps,
                countOfComments: yield (0, typeorm_1.getRepository)(recipe_comment_model_1.Comment).count({
                    relations: [recipe_service_types_1.RecipeStringTypes.RECIPE],
                    where: { recipe: recipe },
                }),
            });
        });
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], Recipe.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { length: 50 }),
    (0, tslib_1.__metadata)("design:type", String)
], Recipe.prototype, "title", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { length: 150 }),
    (0, tslib_1.__metadata)("design:type", String)
], Recipe.prototype, "image", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { length: 500 }),
    (0, tslib_1.__metadata)("design:type", String)
], Recipe.prototype, "description", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('json'),
    (0, tslib_1.__metadata)("design:type", typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object)
], Recipe.prototype, "ingredients", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('json'),
    (0, tslib_1.__metadata)("design:type", Object)
], Recipe.prototype, "steps", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('int', { width: 10 }),
    (0, tslib_1.__metadata)("design:type", Number)
], Recipe.prototype, "rating", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('int'),
    (0, tslib_1.__metadata)("design:type", Number)
], Recipe.prototype, "ratingsCount", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('int'),
    (0, tslib_1.__metadata)("design:type", Number)
], Recipe.prototype, "ratingsSum", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.OneToMany)(() => recipe_rating_model_1.RecipeRating, (rater) => rater.recipe),
    (0, tslib_1.__metadata)("design:type", typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object)
], Recipe.prototype, "raters", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, (user) => user.recipes),
    (0, tslib_1.__metadata)("design:type", typeof (_c = typeof user_model_1.User !== "undefined" && user_model_1.User) === "function" ? _c : Object)
], Recipe.prototype, "user", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.OneToMany)(() => recipe_comment_model_1.Comment, (comment) => comment.recipe),
    (0, tslib_1.__metadata)("design:type", typeof (_d = typeof Array !== "undefined" && Array) === "function" ? _d : Object)
], Recipe.prototype, "comments", void 0);
Recipe = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)('Recipe'),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], Recipe);
exports.Recipe = Recipe;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/recipes/recipe.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipeModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const user_module_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.module.ts");
const recipe_controller_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.controller.ts");
const recipe_service_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.service.ts");
const recipe_rating_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.rating.model.ts");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const recipe_comment_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.comment.model.ts");
const common_1 = __webpack_require__("@nestjs/common");
let RecipeModule = class RecipeModule {
};
RecipeModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([recipe_model_1.Recipe, recipe_rating_model_1.RecipeRating, recipe_comment_model_1.Comment]),
            user_module_1.UserModule,
        ],
        providers: [recipe_service_1.RecipeService],
        controllers: [recipe_controller_1.RecipeController],
    })
], RecipeModule);
exports.RecipeModule = RecipeModule;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/recipes/recipe.rating.model.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipeRating = void 0;
const tslib_1 = __webpack_require__("tslib");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const typeorm_1 = __webpack_require__("typeorm");
let RecipeRating = class RecipeRating extends typeorm_1.BaseEntity {
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, tslib_1.__metadata)("design:type", Number)
], RecipeRating.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, { onDelete: 'CASCADE' }),
    (0, tslib_1.__metadata)("design:type", typeof (_a = typeof user_model_1.User !== "undefined" && user_model_1.User) === "function" ? _a : Object)
], RecipeRating.prototype, "rater", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('int', { width: 5 }),
    (0, tslib_1.__metadata)("design:type", Number)
], RecipeRating.prototype, "rating", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.ManyToOne)(() => recipe_model_1.Recipe, (recipe) => recipe.raters, { onDelete: 'CASCADE' }),
    (0, tslib_1.__metadata)("design:type", typeof (_b = typeof recipe_model_1.Recipe !== "undefined" && recipe_model_1.Recipe) === "function" ? _b : Object)
], RecipeRating.prototype, "recipe", void 0);
RecipeRating = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)('RecipeRating')
], RecipeRating);
exports.RecipeRating = RecipeRating;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/recipes/recipe.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipeService = void 0;
const tslib_1 = __webpack_require__("tslib");
const user_service_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.service.ts");
const recipe_comment_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.comment.model.ts");
const recipe_service_types_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.service.types.ts");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const recipe_rating_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.rating.model.ts");
const recipe_dtos_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.dtos.ts");
const image_uploader_1 = __webpack_require__("./apps/taysteer-backend/src/utils/image.uploader.ts");
let RecipeService = class RecipeService {
    constructor(recipeRepository, recipeRatingsRepository, recipeCommentsRepository, usersService) {
        this.recipeRepository = recipeRepository;
        this.recipeRatingsRepository = recipeRatingsRepository;
        this.recipeCommentsRepository = recipeCommentsRepository;
        this.usersService = usersService;
        this.validateRecipeData = (recipe) => {
            var _a, _b;
            if (recipe.title.length > 50 ||
                recipe.description.length > 500 ||
                !recipe.image)
                return false;
            for (const ingredient of recipe.ingredients) {
                if (ingredient.count > 1000000 ||
                    ingredient.count < 0 ||
                    ingredient.name.length > 100)
                    return false;
            }
            for (const stepKey of Object.keys(recipe.steps)) {
                const step = recipe.steps[stepKey];
                if (((_a = step.title) === null || _a === void 0 ? void 0 : _a.length) > 100 ||
                    ((_b = step.description) === null || _b === void 0 ? void 0 : _b.length) > 500 ||
                    !step.image)
                    return false;
            }
            return true;
        };
        this.validateComment = (commentText) => commentText.length <= 500;
        this.hasRecipeAccess = (userId, recipeId) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const userIsOwner = yield this.recipeRepository.findOne(recipeId, {
                relations: [recipe_service_types_1.RecipeStringTypes.USER],
                where: {
                    user: {
                        id: userId,
                    },
                },
            });
            return Boolean(userIsOwner);
        });
        this.hasCommentAccess = (userId, commentId) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const userIsOwner = yield this.recipeCommentsRepository.findOne(commentId, {
                relations: [recipe_service_types_1.RecipeStringTypes.USER],
                where: {
                    user: {
                        id: userId,
                    },
                },
            });
            return Boolean(userIsOwner);
        });
        this.getRecipes = (page = 1) => this.recipeRepository.find({
            order: { rating: 'DESC' },
            skip: page ? (page - 1) * 10 : 0,
            take: 10,
        });
        this.getRecipeById = (id) => this.recipeRepository.findOne(id, {
            relations: [recipe_service_types_1.RecipeStringTypes.USER, recipe_service_types_1.RecipeStringTypes.RATERS],
        });
        this.getRecipesByTitle = (title, page = 1) => this.recipeRepository.find({
            where: { title: (0, typeorm_2.Like)(`%${title}%`) },
            order: { rating: 'DESC' },
            skip: page ? (page - 1) * 10 : 0,
            take: 10,
        });
        this.addRecipe = (form, userId) => { var form_1, form_1_1; return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var e_1, _a;
            try {
                const recipeData = new recipe_dtos_1.RecipeDataDto(); // Create the object for recipe data
                // Add user to recipe
                const user = yield this.usersService.getUserById(userId);
                if (!user)
                    return false;
                recipeData.user = user;
                try {
                    // Extract form data
                    for (form_1 = (0, tslib_1.__asyncValues)(form); form_1_1 = yield form_1.next(), !form_1_1.done;) {
                        const part = form_1_1.value;
                        // Insert field if it's a field
                        if (part['value']) {
                            try {
                                // Get steps
                                if (part.fieldname === 'steps') {
                                    const newData = JSON.parse(part['value']);
                                    for (const stepKey of Object.keys(recipeData.steps)) {
                                        const oldStep = recipeData.steps[stepKey];
                                        if (oldStep.image) {
                                            newData[stepKey].image = oldStep.image;
                                        }
                                    }
                                    recipeData[part.fieldname] = newData;
                                }
                                else {
                                    // Get other data
                                    recipeData[part.fieldname] = JSON.parse(part['value']);
                                }
                            }
                            catch (_b) {
                                try {
                                    recipeData[part.fieldname] = JSON.parse(part['value']);
                                }
                                catch (_c) {
                                    recipeData[part.fieldname] = part['value'];
                                }
                            }
                        }
                        // Upload if it's a file
                        else if (part.file) {
                            const isMainImage = part.fieldname == recipe_service_types_1.RecipeStringTypes.IMAGE;
                            const isStepImage = part.fieldname.includes(recipe_service_types_1.RecipeStringTypes.STEP_IMAGE);
                            // Calculate image id
                            let id = '1';
                            if (isStepImage) {
                                // Get image id
                                id = String(Number(part.fieldname.replace(recipe_service_types_1.RecipeStringTypes.STEP_IMAGE, '')) -
                                    1);
                                // Check id
                                if (Number(id) < 0)
                                    return false;
                                else if (!recipeData.steps || !recipeData.steps[id]) {
                                    if (!recipeData.steps)
                                        recipeData.steps = {};
                                    recipeData.steps[id] = { title: '', description: '', image: '' };
                                }
                            }
                            else if (!isMainImage)
                                return false; // Exit if it's not supported image
                            // Upload image
                            const uploadedResponse = yield (0, image_uploader_1.uploadImage)(part.file, recipe_service_types_1.RecipeStringTypes.IMAGE_FOLDER);
                            // Save link
                            if (uploadedResponse) {
                                if (isMainImage)
                                    recipeData.image = uploadedResponse;
                                else if (isStepImage)
                                    recipeData.steps[id].image = uploadedResponse;
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (form_1_1 && !form_1_1.done && (_a = form_1.return)) yield _a.call(form_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // Validate data
                if (!this.validateRecipeData(recipeData))
                    return false;
                // Create recipe
                const recipe = this.recipeRepository.create(new recipe_model_1.Recipe(recipeData));
                // Save recipe
                return yield this.recipeRepository.save(recipe);
            }
            catch (_d) {
                return false;
            }
        }); };
        this.updateRecipe = (form, recipeId) => { var form_2, form_2_1; return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var e_2, _a;
            try {
                const recipe = yield this.recipeRepository.findOne(recipeId);
                // Extract form data
                const recipeData = new recipe_dtos_1.RecipeDataDto();
                try {
                    for (form_2 = (0, tslib_1.__asyncValues)(form); form_2_1 = yield form_2.next(), !form_2_1.done;) {
                        const part = form_2_1.value;
                        // Insert field if it's a field
                        if (part['value']) {
                            try {
                                // Get steps
                                if (part.fieldname === 'steps') {
                                    const newData = JSON.parse(part['value']);
                                    for (const stepKey of Object.keys(recipeData.steps)) {
                                        const oldStep = recipeData.steps[stepKey];
                                        if (oldStep.image) {
                                            newData[stepKey].image = oldStep.image;
                                        }
                                    }
                                    recipeData[part.fieldname] = newData;
                                }
                                else {
                                    // Get other data
                                    recipeData[part.fieldname] = JSON.parse(part['value']);
                                }
                            }
                            catch (_b) {
                                try {
                                    recipeData[part.fieldname] = JSON.parse(part['value']);
                                }
                                catch (_c) {
                                    recipeData[part.fieldname] = part['value'];
                                }
                            }
                        }
                        // Upload if it's a file
                        else if (part.file) {
                            const isMainImage = part.fieldname == recipe_service_types_1.RecipeStringTypes.IMAGE;
                            const isStepImage = part.fieldname.includes(recipe_service_types_1.RecipeStringTypes.STEP_IMAGE);
                            // Calculate image id
                            let id = '1';
                            if (isStepImage) {
                                // Get image id
                                id = String(Number(part.fieldname.replace(recipe_service_types_1.RecipeStringTypes.STEP_IMAGE, '')) -
                                    1);
                                // Check id
                                if (Number(id) < 0)
                                    return false;
                                else if (!recipeData.steps || !recipeData.steps[id]) {
                                    if (!recipeData.steps)
                                        recipeData.steps = {};
                                    recipeData.steps[id] = { title: '', description: '', image: '' };
                                }
                            }
                            else if (!isMainImage)
                                return false; // Exit if it's not supported image
                            // Upload image
                            const uploadedResponse = yield (0, image_uploader_1.uploadImage)(part.file, recipe_service_types_1.RecipeStringTypes.IMAGE_FOLDER);
                            // Save link
                            if (uploadedResponse) {
                                if (isMainImage)
                                    recipeData.image = uploadedResponse;
                                else if (isStepImage)
                                    recipeData.steps[id].image = uploadedResponse;
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (form_2_1 && !form_2_1.done && (_a = form_2.return)) yield _a.call(form_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                // Validate data
                if (!this.validateRecipeData(recipeData))
                    return false;
                // Delete old images from the server
                const images = [
                    recipe.image,
                    ...Object.keys(recipe.steps).map((key) => recipe.steps[key].image),
                ];
                images.forEach((image) => (0, image_uploader_1.deleteImage)(image));
                const newRecipe = new recipe_model_1.Recipe(Object.assign(Object.assign({}, recipeData), { update: true }));
                // Save recipe
                return yield this.recipeRepository.save(Object.assign(Object.assign({}, recipe), newRecipe));
            }
            catch (_d) {
                return false;
            }
        }); };
        this.deleteRecipe = (id) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // Get the recipe
            const recipe = yield this.getRecipeById(id);
            // Delete images
            const images = [
                recipe.image,
                ...Object.keys(recipe.steps).map((key) => recipe.steps[key].image),
            ];
            images.forEach((image) => (0, image_uploader_1.deleteImage)(image));
            // Delete the recipe
            const deleteResult = yield this.recipeRepository.delete(id);
            return deleteResult.affected;
        });
        this.rateRecipe = (recipeId, raterId, rating) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // Validate data
            if (!rating)
                return false;
            else if (rating > 5)
                rating = 5;
            // Get the user with relations
            const recipe = yield this.getRecipeById(recipeId);
            if (!recipe)
                return false;
            const user = yield this.usersService.getUserById(raterId);
            // Try to find the rating
            const findingResult = yield this.recipeRatingsRepository.findOne({
                rater: user,
                recipe: recipe,
            }, {
                relations: [recipe_service_types_1.RecipeStringTypes.RATER, recipe_service_types_1.RecipeStringTypes.RECIPE],
            });
            // Create a new rater if not found
            const ratingObject = findingResult || this.recipeRatingsRepository.create(new recipe_rating_model_1.RecipeRating());
            ratingObject.rater = user;
            ratingObject.rating = rating;
            // Save the rater
            yield this.recipeRatingsRepository.save(ratingObject);
            let new_ratings_count = recipe.ratingsCount, new_ratings_sum = recipe.ratingsSum - recipe.rating + rating, new_rating = Math.round(rating);
            // If it's the first rating
            // Calculate the rating
            if (!findingResult) {
                new_ratings_count = recipe.ratingsCount + 1;
                new_ratings_sum = recipe.ratingsSum + rating;
                recipe.raters.push(ratingObject);
            }
            // If it's the update of the rating
            else {
                new_rating = Math.round(new_ratings_sum / new_ratings_count);
            }
            // Update the user
            return this.recipeRepository.save(Object.assign(Object.assign({}, recipe), {
                ratingsCount: new_ratings_count,
                ratingsSum: new_ratings_sum,
                rating: new_rating,
                raters: recipe.raters,
            }));
        });
        this.getComments = (recipeId, page = 1) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const recipe = yield this.getRecipeById(recipeId);
            return this.recipeCommentsRepository.find({
                relations: [recipe_service_types_1.RecipeStringTypes.RECIPE, recipe_service_types_1.RecipeStringTypes.USER],
                where: { recipe: recipe },
                order: { date: 'DESC' },
                skip: page ? (page - 1) * 10 : 0,
                take: 10,
            });
        });
        this.getCommentById = (id) => this.recipeCommentsRepository.findOne(id, {
            relations: [recipe_service_types_1.RecipeStringTypes.USER, recipe_service_types_1.RecipeStringTypes.RECIPE],
        });
        this.getCommentWithAnswersById = (id, page) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const mainComment = yield this.getCommentById(id); // Get main comment
            // Get the page of child comments
            const childComments = yield this.recipeCommentsRepository.find({
                where: { mainComment: mainComment },
                relations: [recipe_service_types_1.RecipeStringTypes.MAIN_COMMENT, recipe_service_types_1.RecipeStringTypes.USER],
                order: { date: 'ASC' },
                skip: page ? (page - 1) * 3 : 0,
                take: 3,
            });
            mainComment.childComments = childComments;
            return mainComment;
        });
        this.addRecipeComment = (commentText, userId, recipeId) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (!this.validateComment(commentText))
                return false; // Validate comment
            // Get recipe and user
            const recipe = yield this.getRecipeById(recipeId);
            if (!recipe)
                return false;
            const user = yield this.usersService.getUserById(userId);
            // Create the comment
            const comment = this.recipeCommentsRepository.create(new recipe_comment_model_1.Comment({ text: commentText }));
            // Set relatives
            comment.user = user;
            comment.recipe = recipe;
            // Save the comment
            return this.recipeCommentsRepository.save(comment);
        });
        this.addCommentComment = (commentText, userId, mainCommentId) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (!this.validateComment(commentText))
                return false; // Validate comment
            // Get recipe and user
            const mainComment = yield this.getCommentById(mainCommentId);
            if (!mainComment)
                return false;
            const user = yield this.usersService.getUserById(userId);
            // Create the comment
            const comment = this.recipeCommentsRepository.create(new recipe_comment_model_1.Comment({ text: commentText }));
            // Set relatives
            comment.user = user;
            comment.mainComment = mainComment;
            // Save the comment
            return this.recipeCommentsRepository.save(comment);
        });
        this.updateComment = (commentText, commentId) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const comment = yield this.getCommentById(commentId); // Get the comment
            if (!this.validateComment(commentText))
                return false; // Validate
            // Save
            return this.recipeCommentsRepository.save(Object.assign(Object.assign({}, comment), {
                text: commentText,
                updated: true,
            }));
        });
        this.deleteComment = (commentId) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const deleteResult = yield this.recipeCommentsRepository.delete(commentId); // Delete the comment
            return deleteResult.affected; // Return a result
        });
    }
};
RecipeService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, typeorm_1.InjectRepository)(recipe_model_1.Recipe)),
    (0, tslib_1.__param)(1, (0, typeorm_1.InjectRepository)(recipe_rating_model_1.RecipeRating)),
    (0, tslib_1.__param)(2, (0, typeorm_1.InjectRepository)(recipe_comment_model_1.Comment)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof user_service_1.UsersService !== "undefined" && user_service_1.UsersService) === "function" ? _d : Object])
], RecipeService);
exports.RecipeService = RecipeService;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/recipes/recipe.service.types.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecipeStringTypes = void 0;
var RecipeStringTypes;
(function (RecipeStringTypes) {
    RecipeStringTypes["IMAGE"] = "image";
    RecipeStringTypes["STEP_IMAGE"] = "stepImage";
    RecipeStringTypes["IMAGE_FOLDER"] = "recipe_images";
    RecipeStringTypes["NOT_FOUND"] = "not_found";
    RecipeStringTypes["USER"] = "user";
    RecipeStringTypes["RATER"] = "rater";
    RecipeStringTypes["RATERS"] = "raters";
    RecipeStringTypes["RECIPE"] = "recipe";
    RecipeStringTypes["COMMENTS"] = "comments";
    RecipeStringTypes["CHILD_COMMENTS"] = "childComments";
    RecipeStringTypes["MAIN_COMMENT"] = "mainComment";
})(RecipeStringTypes = exports.RecipeStringTypes || (exports.RecipeStringTypes = {}));


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/users/user.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const tslib_1 = __webpack_require__("tslib");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const common_1 = __webpack_require__("@nestjs/common");
const express_1 = __webpack_require__("express");
const user_service_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.service.ts");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
const interfaces_1 = __webpack_require__("./apps/taysteer-backend/src/typification/interfaces.ts");
const user_service_types_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.service.types.ts");
const cookie_auth_guard_1 = __webpack_require__("./apps/taysteer-backend/src/auth/guards/cookie-auth.guard.ts");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getUserById(res, id) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.usersService.getUserById(id);
            return user
                ? res.status(common_1.HttpStatus.OK).send(yield user_model_1.User.toResponseDetailed(user))
                : res.status(common_1.HttpStatus.NOT_FOUND).send();
        });
    }
    getMe(req, res, detailed = 'false') {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.usersService.getUserById(req.user.id);
            const response = detailed === 'true'
                ? yield user_model_1.User.toResponseDetailed(user)
                : yield user_model_1.User.toResponse(user);
            return res.status(common_1.HttpStatus.OK).send(response);
        });
    }
    createUser(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // Create an account
            const createdUser = yield this.usersService.addUser(req.parts());
            if (createdUser == user_service_types_1.UserStringTypes.CONFLICT)
                return res.status(common_1.HttpStatus.CONFLICT).send(); // Response if user already exist
            return createdUser && typeof createdUser != 'string'
                ? res.status(common_1.HttpStatus.CREATED).send(yield user_model_1.User.toResponse(createdUser))
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    updateUserById(req, res, userId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // Check access to an account
            const hasAccess = yield this.usersService.checkAccess(req.user, userId || req.user.id, true);
            if (!hasAccess)
                return res.status(common_1.HttpStatus.FORBIDDEN).send();
            // Update the account
            const updatedUser = yield this.usersService.updateUser(userId || req.user.id, req.parts());
            if (updatedUser === user_service_types_1.UserStringTypes.CONFLICT)
                return res.status(common_1.HttpStatus.CONFLICT).send(); // Response if user with new login already exist
            return updatedUser && typeof updatedUser != 'string'
                ? res.status(common_1.HttpStatus.OK).send(yield user_model_1.User.toResponse(updatedUser))
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    deleteUserById(req, res, userId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const hasAccess = yield this.usersService.checkAccess(req.user, userId || req.user.id, true);
            if (!hasAccess)
                return res.status(common_1.HttpStatus.FORBIDDEN).send();
            // Delete user
            const userDeleted = yield this.usersService.deleteUser(userId || req.user.id);
            return userDeleted
                ? res.status(common_1.HttpStatus.NO_CONTENT).send()
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    getUsersByRating(res, page) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const users = yield this.usersService.getUsersByRating(page);
            const usersToResponse = users.map((user) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () { return yield user_model_1.User.toResponse(user); }));
            return res.status(common_1.HttpStatus.OK).send(yield Promise.all(usersToResponse));
        });
    }
    deleteProfileImage(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const hasAccess = yield this.usersService.checkAccess(req.user, req.user.id, true);
            if (!hasAccess)
                return res.status(common_1.HttpStatus.FORBIDDEN).send();
            const userExists = yield this.usersService.getUserById(req.user.id);
            if (!userExists)
                return res.status(common_1.HttpStatus.NOT_FOUND).send();
            const userWithDeletedImage = yield this.usersService.deleteUserImage(req.user.id);
            return userWithDeletedImage
                ? res
                    .status(common_1.HttpStatus.OK)
                    .send(yield user_model_1.User.toResponse(userWithDeletedImage))
                : res.status(common_1.HttpStatus.BAD_REQUEST).send();
        });
    }
    getUserRecipes(res, id, page) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const recipes = yield this.usersService.getUserRecipes(id, page);
            const toResponse = recipes.map((recipe) => recipe_model_1.Recipe.toResponse(recipe));
            return res.status(common_1.HttpStatus.OK).send(toResponse);
        });
    }
};
(0, tslib_1.__decorate)([
    (0, common_1.Get)(':id'),
    (0, tslib_1.__param)(0, (0, common_1.Res)()),
    (0, tslib_1.__param)(1, (0, common_1.Param)('id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _a : Object, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Query)('detailed')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object, Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
(0, tslib_1.__decorate)([
    (0, common_1.Post)(),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _d : Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
(0, tslib_1.__decorate)([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Query)('user_id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _f : Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "updateUserById", null);
(0, tslib_1.__decorate)([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__param)(2, (0, common_1.Query)('user_id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_h = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _h : Object, typeof (_j = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _j : Object, String]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "deleteUserById", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)('rating'),
    (0, tslib_1.__param)(0, (0, common_1.Res)()),
    (0, tslib_1.__param)(1, (0, common_1.Query)('page')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_k = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _k : Object, Number]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "getUsersByRating", null);
(0, tslib_1.__decorate)([
    (0, common_1.Delete)('delete_image'),
    (0, common_1.UseGuards)(cookie_auth_guard_1.CookieAuthGuard),
    (0, tslib_1.__param)(0, (0, common_1.Req)()),
    (0, tslib_1.__param)(1, (0, common_1.Res)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_l = typeof interfaces_1.ExtendedRequest !== "undefined" && interfaces_1.ExtendedRequest) === "function" ? _l : Object, typeof (_m = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _m : Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "deleteProfileImage", null);
(0, tslib_1.__decorate)([
    (0, common_1.Get)(':id/recipes'),
    (0, tslib_1.__param)(0, (0, common_1.Res)()),
    (0, tslib_1.__param)(1, (0, common_1.Param)('id')),
    (0, tslib_1.__param)(2, (0, common_1.Query)('page')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_o = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _o : Object, String, Number]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UsersController.prototype, "getUserRecipes", null);
UsersController = (0, tslib_1.__decorate)([
    (0, common_1.Controller)('api/users'),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_p = typeof user_service_1.UsersService !== "undefined" && user_service_1.UsersService) === "function" ? _p : Object])
], UsersController);
exports.UsersController = UsersController;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/users/user.dto.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDataDto = void 0;
class UserDataDto {
}
exports.UserDataDto = UserDataDto;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/users/user.model.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var User_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const tslib_1 = __webpack_require__("tslib");
const user_service_types_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.service.types.ts");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const typeorm_1 = __webpack_require__("typeorm");
let User = User_1 = class User extends typeorm_1.BaseEntity {
    constructor({ name = '', login = '', password = '', description = '', image = '', } = {}) {
        super();
        this.name = name;
        this.login = login;
        this.password = password;
        this.description = description;
        this.image = image;
        this.rating = 0;
    }
    static calculateRating(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return (yield (0, typeorm_1.getRepository)(recipe_model_1.Recipe).find({
                relations: [user_service_types_1.UserStringTypes.USER],
                where: { user: user },
            })).filter((recipe) => {
                return recipe.rating > 0;
            }).reduce((accumulated, recipe, index) => {
                return (accumulated * index + recipe.rating) / (index + 1);
            }, 0);
        });
    }
    static toResponse(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rating = yield User_1.calculateRating(user);
            const { id, name, login, image } = user;
            return { id, name, login, image, rating };
        });
    }
    static toResponseDetailed(user) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rating = yield User_1.calculateRating(user);
            const countOfRecipes = yield (0, typeorm_1.getRepository)(recipe_model_1.Recipe).count({
                relations: [user_service_types_1.UserStringTypes.USER],
                where: { user: user },
            });
            const { id, name, login, image, description } = user;
            return {
                id,
                name,
                login,
                image,
                rating,
                description,
                countOfRecipes,
            };
        });
    }
    static toResponseMin(user) {
        const { id, login } = user;
        return { id, login };
    }
};
(0, tslib_1.__decorate)([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { length: 50 }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "name", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { length: 50 }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "login", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { length: 60 }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "password", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { length: 150 }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "image", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('varchar', { length: 500 }),
    (0, tslib_1.__metadata)("design:type", String)
], User.prototype, "description", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.Column)('int', { width: 10 }),
    (0, tslib_1.__metadata)("design:type", Number)
], User.prototype, "rating", void 0);
(0, tslib_1.__decorate)([
    (0, typeorm_1.OneToMany)(() => recipe_model_1.Recipe, (recipe) => recipe.user),
    (0, tslib_1.__metadata)("design:type", Array)
], User.prototype, "recipes", void 0);
User = User_1 = (0, tslib_1.__decorate)([
    (0, typeorm_1.Entity)('User'),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], User);
exports.User = User;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/users/user.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const common_1 = __webpack_require__("@nestjs/common");
const user_service_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.service.ts");
const user_controller_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.controller.ts");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
let UserModule = class UserModule {
};
UserModule = (0, tslib_1.__decorate)([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_model_1.User, recipe_model_1.Recipe])],
        providers: [user_service_1.UsersService],
        controllers: [user_controller_1.UsersController],
        exports: [user_service_1.UsersService],
    })
], UserModule);
exports.UserModule = UserModule;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/users/user.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const tslib_1 = __webpack_require__("tslib");
const recipe_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/recipes/recipe.model.ts");
const user_dto_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.dto.ts");
const user_service_types_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.service.types.ts");
const user_model_1 = __webpack_require__("./apps/taysteer-backend/src/resources/users/user.model.ts");
const common_1 = __webpack_require__("@nestjs/common");
const typeorm_1 = __webpack_require__("@nestjs/typeorm");
const typeorm_2 = __webpack_require__("typeorm");
const bcryptjs_1 = (0, tslib_1.__importDefault)(__webpack_require__("bcryptjs"));
const config_1 = __webpack_require__("./configs/common/config.ts");
const image_uploader_1 = __webpack_require__("./apps/taysteer-backend/src/utils/image.uploader.ts");
let UsersService = class UsersService {
    constructor(userRepository, recipeRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.createAdmin = () => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const adminExists = yield this.userRepository.findOne({
                login: config_1.ADMIN_LOGIN,
            });
            if (!adminExists) {
                const admin = new user_model_1.User({ login: config_1.ADMIN_LOGIN, password: config_1.ADMIN_PASSWORD });
                this.userRepository.save(Object.assign(Object.assign({}, admin), {
                    password: yield bcryptjs_1.default.hash(config_1.ADMIN_PASSWORD, bcryptjs_1.default.genSaltSync(10)),
                }));
            }
        });
        this.checkAccess = (user, requestedId, shouldBeOwner = true) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const userExists = yield this.getUserById(requestedId);
            const isOwner = user.id == requestedId;
            const isAdmin = user.id == (yield this.getUserByLogin(config_1.ADMIN_LOGIN)).id;
            return userExists && (isOwner == shouldBeOwner || isAdmin);
        });
        this.validateUserData = (userData, updating = false) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (!updating) {
                // If it's a data for creating a new user
                if (!userData.password)
                    return false; // Check if the login and password exists
            }
            if (
            // Check if the data is valid
            ((_a = userData.name) === null || _a === void 0 ? void 0 : _a.length) > 50 ||
                ((_b = userData.login) === null || _b === void 0 ? void 0 : _b.length) > 50 ||
                ((_c = userData.password) === null || _c === void 0 ? void 0 : _c.length) > 50 ||
                ((_d = userData.description) === null || _d === void 0 ? void 0 : _d.length) > 500)
                return false;
            return true;
        });
        this.getUserById = (id) => this.userRepository.findOne(id);
        this.getUserByLogin = (login) => this.userRepository.findOne({ login: login });
        this.addUser = (form) => { var form_1, form_1_1; return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var e_1, _a;
            const userData = new user_dto_1.UserDataDto(); // Create the object for user data
            try {
                // Extract form data
                for (form_1 = (0, tslib_1.__asyncValues)(form); form_1_1 = yield form_1.next(), !form_1_1.done;) {
                    const part = form_1_1.value;
                    // Insert field if it's a field
                    if (part['value'])
                        userData[part.fieldname] = part['value'];
                    // Upload if it's a file
                    else if (part.file) {
                        // Upload image
                        const uploadedResponse = yield (0, image_uploader_1.uploadImage)(part.file, user_service_types_1.UserStringTypes.IMAGES_FOLDER);
                        if (uploadedResponse)
                            userData.image = uploadedResponse;
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (form_1_1 && !form_1_1.done && (_a = form_1.return)) yield _a.call(form_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (yield this.getUserByLogin(userData.login))
                return user_service_types_1.UserStringTypes.CONFLICT; // Check if the user does not exist
            if (!(yield this.validateUserData(userData, false)))
                return false; // Validate data
            const user = this.userRepository.create(new user_model_1.User(userData)); // Create user object
            // Save user with password hash
            return this.userRepository.save(Object.assign(Object.assign({}, user), { password: yield bcryptjs_1.default.hash(user.password, bcryptjs_1.default.genSaltSync(10)) }));
        }); };
        this.updateUser = (id, form) => { var form_2, form_2_1; return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            var e_2, _a;
            const user = yield this.getUserById(id); // Get user
            const userData = new user_dto_1.UserDataDto();
            try {
                // Extract form data
                for (form_2 = (0, tslib_1.__asyncValues)(form); form_2_1 = yield form_2.next(), !form_2_1.done;) {
                    const part = form_2_1.value;
                    // If it's a field
                    if (part['value'])
                        userData[part.fieldname] = part['value'];
                    // If it's a file
                    else if (part.file) {
                        // Upload image
                        const uploadedResponse = yield (0, image_uploader_1.uploadImage)(part.file, user_service_types_1.UserStringTypes.IMAGES_FOLDER);
                        if (uploadedResponse)
                            userData.image = uploadedResponse;
                        break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (form_2_1 && !form_2_1.done && (_a = form_2.return)) yield _a.call(form_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // Check if the user with the same login does not exist
            if (userData.login !== user.login &&
                (yield this.getUserByLogin(userData.login)))
                return user_service_types_1.UserStringTypes.CONFLICT;
            if (!(yield this.validateUserData(userData, true)))
                return false; // Validate data
            // Delete old image from the server
            if (userData.image && user.image) {
                (0, image_uploader_1.deleteImage)(user.image);
            }
            // Create the user object with the new data
            const newUser = new user_model_1.User(Object.assign(Object.assign({}, userData), { login: userData.login || user.login, update: true }));
            // Update the user
            return this.userRepository.save(Object.assign(Object.assign({}, user), Object.assign(Object.assign({}, newUser), {
                password: newUser.password // Set a hash of the password
                    ? yield bcryptjs_1.default.hash(newUser.password, bcryptjs_1.default.genSaltSync(10))
                    : user.password,
            })));
        }); };
        this.deleteUser = (id) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.getUserById(id);
            (0, image_uploader_1.deleteImage)(user.image); // Delete the image
            const deleteResult = yield this.userRepository.delete(id); // Delete the user
            return deleteResult.affected; // Return a result
        });
        this.getUsersByRating = (page = 1) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // Find users by rating in descending order
            const users = yield this.userRepository.find({
                order: { rating: 'DESC' },
                skip: page ? (page - 1) * 10 : 0,
                take: 10,
            });
            return users;
        });
        this.deleteUserImage = (userId) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            const deleted = yield (0, image_uploader_1.deleteImage)(user.image);
            if (deleted) {
                return this.userRepository.save(Object.assign(Object.assign({}, user), { image: '' }));
            }
            else
                return false;
        });
        this.getUserRecipes = (userId, page = 1) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            return yield this.recipeRepository.find({
                relations: [user_service_types_1.UserStringTypes.USER],
                where: { user: user },
                order: { rating: 'DESC' },
                skip: page ? (page - 1) * 10 : 0,
                take: 10,
            });
        });
        this.createAdmin();
    }
};
UsersService = (0, tslib_1.__decorate)([
    (0, common_1.Injectable)(),
    (0, tslib_1.__param)(0, (0, typeorm_1.InjectRepository)(user_model_1.User)),
    (0, tslib_1.__param)(1, (0, typeorm_1.InjectRepository)(recipe_model_1.Recipe)),
    (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], UsersService);
exports.UsersService = UsersService;


/***/ }),

/***/ "./apps/taysteer-backend/src/resources/users/user.service.types.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStringTypes = void 0;
var UserStringTypes;
(function (UserStringTypes) {
    UserStringTypes["IMAGE"] = "image";
    UserStringTypes["CONFLICT"] = "conflict";
    UserStringTypes["IMAGES_FOLDER"] = "user_avatar";
    UserStringTypes["RECIPES"] = "recipes";
    UserStringTypes["USER"] = "user";
    UserStringTypes["RATING"] = "rating";
})(UserStringTypes = exports.UserStringTypes || (exports.UserStringTypes = {}));


/***/ }),

/***/ "./apps/taysteer-backend/src/typification/interfaces.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./apps/taysteer-backend/src/utils/current.time.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTime = void 0;
const getTime = () => {
    const date_ob = new Date();
    // Adjust 0 before single digit date
    const date = ('0' + date_ob.getDate()).slice(-2);
    // Current month
    const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    // Current year
    const year = date_ob.getFullYear();
    // Current hours
    const hours = date_ob.getHours();
    // Current minutes
    const minutes = date_ob.getMinutes();
    // Current seconds
    const seconds = date_ob.getSeconds();
    // Date & time in YYYY-MM-DD HH:MM:SS format
    const dateTime = year +
        '-' +
        month +
        '-' +
        date +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds;
    return dateTime;
};
exports.getTime = getTime;


/***/ }),

/***/ "./apps/taysteer-backend/src/utils/image.uploader.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteImage = exports.uploadImage = void 0;
const tslib_1 = __webpack_require__("tslib");
const cloudinary_1 = __webpack_require__("./configs/utils/cloudinary.ts");
const promise_controller_1 = __webpack_require__("./apps/taysteer-backend/src/utils/promise.controller.ts");
const uploadImage = (fileReadStream, folder) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const promiseController = new promise_controller_1.PromiseController(); // Create a new promise controller
    // Create upload stream
    const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({ folder: folder }, (error, result) => {
        if (!error) {
            promiseController.resolve(result.url); // Return a response using the promise
        }
        else
            promiseController.resolve(false);
    });
    fileReadStream.pipe(uploadStream); // Connect the file read stream
    const uploadedResponse = yield promiseController.promise; // Get a response
    return uploadedResponse;
});
exports.uploadImage = uploadImage;
const deleteImage = (link) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const public_id = link.match(/(?<!\/\/)(?<=\/)\w+(?=\.)/)[0];
    const folder = link.match(/(?<=[0-9]\W).+(?=\W\w+\.\w+)/)[0];
    // Delete an old image
    const response = yield cloudinary_1.cloudinary.uploader.destroy(`${folder}/${public_id}`);
    return response.result == 'ok';
});
exports.deleteImage = deleteImage;


/***/ }),

/***/ "./apps/taysteer-backend/src/utils/logger.ts":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const tslib_1 = __webpack_require__("tslib");
const promises_1 = (0, tslib_1.__importDefault)(__webpack_require__("fs/promises"));
// Write log to the file
const log = (message, consoleLog = false) => {
    if (consoleLog)
        console.log(message);
    promises_1.default.appendFile('./logs/logs.txt', `${message}\n`);
};
// Write error log to the file and console
const error = (error) => {
    console.error(error);
    promises_1.default.appendFile('./logs/errors.txt', `${error}\n`);
};
module.exports = { log, error };


/***/ }),

/***/ "./apps/taysteer-backend/src/utils/promise.controller.ts":
/***/ ((__unused_webpack_module, exports) => {


/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseController = void 0;
// Allows to return values from callback functions
// Usage:
// const promiseController = new PromiseController();
// fcn((callbackData) => {return promiseController.resolve(callbackData);})
// return promiseController.promise;
class PromiseController {
    constructor() {
        this.resolve = () => null;
        this.reject = () => null;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.PromiseController = PromiseController;


/***/ }),

/***/ "./apps/taysteer-backend/src/utils/promise.loader.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.objectPromise = void 0;
const tslib_1 = __webpack_require__("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const objectZip = (keys, values) => keys.reduce((others, key, index) => (Object.assign(Object.assign({}, others), { [key]: values[index] })), {});
const objectPromise = (obj) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () { return objectZip(Object.keys(obj), yield Promise.all(Object.values(obj))); });
exports.objectPromise = objectPromise;


/***/ }),

/***/ "./configs/common/config.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ADMIN_PASSWORD = exports.ADMIN_LOGIN = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.POSTGRES_DATABASE = exports.POSTGRES_PASSWORD = exports.POSTGRES_USER = exports.POSTGRES_PORT = exports.POSTGRES_HOST = exports.SESSION_SECRET_SALT = exports.SESSION_SECRET_KEY = exports.PORT_FRONTEND = exports.PORT_BACKEND = exports.HOST_FRONTEND = exports.HOST_BACKEND = void 0;
exports.HOST_BACKEND = process.env['HOST_BACKEND'] || 'localhost';
exports.HOST_FRONTEND = process.env['HOST_FRONTEND'] || 'localhost';
exports.PORT_BACKEND = process.env['PORT_BACKEND'] || 4000;
exports.PORT_FRONTEND = process.env['PORT_FRONTEND'] || 3000;
exports.SESSION_SECRET_KEY = process.env['SESSION_SECRET_KEY'];
exports.SESSION_SECRET_SALT = process.env['SESSION_SECRET_SALT'];
exports.POSTGRES_HOST = process.env['POSTGRES_HOST'];
exports.POSTGRES_PORT = Number(process.env['POSTGRES_PORT']);
exports.POSTGRES_USER = process.env['POSTGRES_USER'];
exports.POSTGRES_PASSWORD = process.env['POSTGRES_PASSWORD'];
exports.POSTGRES_DATABASE = process.env['POSTGRES_DB'];
exports.CLOUDINARY_CLOUD_NAME = process.env['CLOUDINARY_CLOUD_NAME'];
exports.CLOUDINARY_API_KEY = process.env['CLOUDINARY_API_KEY'];
exports.CLOUDINARY_API_SECRET = process.env['CLOUDINARY_API_SECRET'];
exports.ADMIN_LOGIN = process.env['ADMIN_LOGIN'];
exports.ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'];


/***/ }),

/***/ "./configs/utils/cloudinary.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cloudinary = void 0;
const config_1 = __webpack_require__("./configs/common/config.ts");
const cloudinary_1 = __webpack_require__("cloudinary");
Object.defineProperty(exports, "cloudinary", ({ enumerable: true, get: function () { return cloudinary_1.v2; } }));
cloudinary_1.v2.config({
    cloud_name: config_1.CLOUDINARY_CLOUD_NAME,
    api_key: config_1.CLOUDINARY_API_KEY,
    api_secret: config_1.CLOUDINARY_API_SECRET,
});


/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/passport":
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/platform-fastify":
/***/ ((module) => {

module.exports = require("@nestjs/platform-fastify");

/***/ }),

/***/ "@nestjs/swagger":
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/typeorm":
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),

/***/ "bcryptjs":
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "cloudinary":
/***/ ((module) => {

module.exports = require("cloudinary");

/***/ }),

/***/ "express":
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "fastify":
/***/ ((module) => {

module.exports = require("fastify");

/***/ }),

/***/ "fastify-multipart":
/***/ ((module) => {

module.exports = require("fastify-multipart");

/***/ }),

/***/ "fastify-passport":
/***/ ((module) => {

module.exports = require("fastify-passport");

/***/ }),

/***/ "fastify-secure-session":
/***/ ((module) => {

module.exports = require("fastify-secure-session");

/***/ }),

/***/ "fs/promises":
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),

/***/ "passport-local":
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "path":
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "typeorm":
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),

/***/ "yamljs":
/***/ ((module) => {

module.exports = require("yamljs");

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

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const core_1 = __webpack_require__("@nestjs/core");
const app_module_1 = __webpack_require__("./apps/taysteer-backend/src/app.module.ts");
const config_1 = __webpack_require__("./configs/common/config.ts");
const platform_fastify_1 = __webpack_require__("@nestjs/platform-fastify");
const path_1 = (0, tslib_1.__importDefault)(__webpack_require__("path"));
const yamljs_1 = (0, tslib_1.__importDefault)(__webpack_require__("yamljs"));
const swagger_1 = __webpack_require__("@nestjs/swagger");
const fastify_secure_session_1 = (0, tslib_1.__importDefault)(__webpack_require__("fastify-secure-session"));
const fastify_passport_1 = (0, tslib_1.__importDefault)(__webpack_require__("fastify-passport"));
const fastify_multipart_1 = (0, tslib_1.__importDefault)(__webpack_require__("fastify-multipart"));
function bootstrap() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter(), {
            cors: {
                origin: `http://localhost:${config_1.PORT_FRONTEND}`,
                credentials: true,
            },
            logger: ['error', 'warn'],
        });
        app.register(fastify_secure_session_1.default, {
            secret: config_1.SESSION_SECRET_KEY,
            salt: config_1.SESSION_SECRET_SALT,
            cookie: {
                maxAge: 60 * 60 * 24 * 30, // 30 days
            },
        });
        app.register(fastify_passport_1.default.initialize());
        app.register(fastify_passport_1.default.secureSession());
        app.register(fastify_multipart_1.default);
        const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, '../../../apps/taysteer-backend/doc/api.yaml'));
        swagger_1.SwaggerModule.setup('doc', app, swaggerDocument);
        app.listen(config_1.PORT_BACKEND, '0.0.0.0', () => {
            console.log(`Service is running at http://localhost:${config_1.PORT_BACKEND}`);
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