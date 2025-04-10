module.exports = {

"[project]/apps/nextjs/.next-internal/server/app/(dashboard)/page/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
}}),
"[project]/apps/nextjs/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/nextjs/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/apps/nextjs/src/app/(dashboard)/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/nextjs/src/app/(dashboard)/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[externals]/pg [external] (pg, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("pg", () => require("pg"));

module.exports = mod;
}}),
"[project]/packages/db/src/auth-schema.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "account": (()=>account),
    "session": (()=>session),
    "user": (()=>user),
    "verification": (()=>verification)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/text.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-rsc] (ecmascript)");
;
const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])("user", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('name').notNull(),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('email').notNull().unique(),
    emailVerified: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["boolean"])('email_verified').notNull(),
    image: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('image'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at').notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').notNull()
});
const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])("session", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('expires_at').notNull(),
    token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('token').notNull().unique(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at').notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').notNull(),
    ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('ip_address'),
    userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('user_agent'),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('user_id').notNull().references(()=>user.id)
});
const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])("account", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    accountId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('account_id').notNull(),
    providerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('provider_id').notNull(),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('user_id').notNull().references(()=>user.id),
    accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('access_token'),
    refreshToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('refresh_token'),
    idToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('id_token'),
    accessTokenExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('access_token_expires_at'),
    refreshTokenExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('refresh_token_expires_at'),
    scope: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('scope'),
    password: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('password'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at').notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').notNull()
});
const verification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])("verification", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    identifier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('identifier').notNull(),
    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('value').notNull(),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('expires_at').notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at'),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('updated_at')
});
}}),
"[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CreatePostSchema": (()=>CreatePostSchema),
    "Post": (()=>Post),
    "Video": (()=>Video),
    "VideoComment": (()=>VideoComment),
    "videoCommentRelations": (()=>videoCommentRelations)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/relations.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$zod$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-zod/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/db/src/auth-schema.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const Post = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])("post", (t)=>({
        id: t.uuid().notNull().primaryKey().defaultRandom(),
        title: t.varchar({
            length: 256
        }).notNull(),
        content: t.text().notNull(),
        createdAt: t.timestamp().defaultNow().notNull(),
        updatedAt: t.timestamp({
            mode: "date",
            withTimezone: true
        }).$onUpdateFn(()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`now()`)
    }));
const Video = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])("video", (t)=>({
        id: t.uuid().notNull().primaryKey().defaultRandom(),
        title: t.varchar({
            length: 256
        }).notNull(),
        description: t.text(),
        userId: t.text("user_id").notNull().references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["user"].id),
        createdAt: t.timestamp().defaultNow().notNull(),
        updatedAt: t.timestamp({
            mode: "date",
            withTimezone: true
        }).$onUpdateFn(()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`now()`)
    }));
const VideoComment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])("video_comment", (t)=>({
        id: t.uuid().notNull().primaryKey().defaultRandom(),
        content: t.text(),
        startTime: t.real(),
        endTime: t.real(),
        createdAt: t.timestamp().defaultNow().notNull(),
        updatedAt: t.timestamp({
            mode: "date",
            withTimezone: true
        }).$onUpdateFn(()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`now()`),
        videoId: t.uuid("video_id").notNull().references(()=>Video.id),
        userId: t.text("user_id").notNull().references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["user"].id)
    }));
const videoCommentRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(VideoComment, ({ one })=>({
        video: one(Video, {
            fields: [
                VideoComment.videoId
            ],
            references: [
                Video.id
            ]
        }),
        user: one(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["user"], {
            fields: [
                VideoComment.userId
            ],
            references: [
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["user"].id
            ]
        })
    }));
const CreatePostSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$zod$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createInsertSchema"])(Post, {
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().max(256),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().max(256)
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
;
}}),
"[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$zod$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-zod/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/db/src/auth-schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <locals>");
}}),
"[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CreatePostSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CreatePostSchema"]),
    "Post": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Post"]),
    "Video": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Video"]),
    "VideoComment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["VideoComment"]),
    "account": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["account"]),
    "session": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["session"]),
    "user": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["user"]),
    "verification": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verification"]),
    "videoCommentRelations": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["videoCommentRelations"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$auth$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/db/src/auth-schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <locals>");
}}),
"[project]/packages/db/src/schema.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CreatePostSchema": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["CreatePostSchema"]),
    "Post": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Post"]),
    "Video": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Video"]),
    "VideoComment": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["VideoComment"]),
    "account": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["account"]),
    "session": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["session"]),
    "user": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["user"]),
    "verification": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["verification"]),
    "videoCommentRelations": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["videoCommentRelations"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <exports>");
}}),
"[project]/packages/db/src/client.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "db": (()=>db)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/node-postgres/driver.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript)");
;
;
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["drizzle"])(process.env.POSTGRES_URL, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    casing: "snake_case"
});
}}),
"[externals]/node:crypto [external] (node:crypto, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:util [external] (node:util, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}}),
"[externals]/node:http [external] (node:http, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}}),
"[externals]/node:https [external] (node:https, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:https", () => require("node:https"));

module.exports = mod;
}}),
"[externals]/node:events [external] (node:events, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}}),
"[externals]/node:crypto [external] (node:crypto, cjs) <export randomFillSync as default>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomFillSync"])
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
}}),
"[project]/packages/auth/src/auth.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "auth": (()=>auth),
    "config": (()=>config)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$better$2d$auth$2f$expo$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@better-auth/expo/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/index.mjs [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$adapters$2f$drizzle$2d$adapter$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/adapters/drizzle-adapter/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/plugins/index.mjs [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/plugins/email-otp/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$oauth$2d$proxy$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/plugins/oauth-proxy/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-rsc] (ecmascript)");
// import sgMail from "@sendgrid/mail"; // Uncomment this in production
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/db/src/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/env.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
// Initialize Resend with your API key
const resend = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Resend"](__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"].RESEND_API_KEY);
const config = {
    database: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$adapters$2f$drizzle$2d$adapter$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["drizzleAdapter"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"], {
        provider: "pg"
    }),
    secret: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"].AUTH_SECRET,
    plugins: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$oauth$2d$proxy$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["oAuthProxy"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$better$2d$auth$2f$expo$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["expo"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailOTP"])({
            async sendVerificationOTP ({ email, otp, type }) {
                // Always log the OTP to the console for testing
                console.log(`Sending ${type} OTP to ${email}: ${otp}`);
                try {
                    // In test mode, Resend only allows sending to the verified email
                    const verifiedEmail = "cruceru.andrei2202@gmail.com";
                    // Send the email using Resend to the verified email, but include the intended recipient in the subject
                    const { data, error } = await resend.emails.send({
                        from: "onboarding@resend.dev",
                        to: verifiedEmail,
                        subject: `${getSubject(type)} [For: ${email}]`,
                        html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${getSubject(type)}</title>
                <style>
                  body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                    text-align: center;
                    padding: 20px 0;
                    border-bottom: 1px solid #eaeaea;
                  }
                  .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #4f46e5;
                  }
                  .content {
                    padding: 30px 20px;
                    text-align: center;
                  }
                  .code {
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    padding: 15px;
                    margin: 25px 0;
                    background-color: #f3f4f6;
                    border-radius: 6px;
                    display: inline-block;
                  }
                  .footer {
                    text-align: center;
                    padding: 20px 0;
                    color: #6b7280;
                    font-size: 14px;
                    border-top: 1px solid #eaeaea;
                  }
                  .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #4f46e5;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 600;
                    margin-top: 20px;
                  }
                  .note {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #6b7280;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="logo">comment.video</div>
                  </div>
                  <div class="content">
                    <div style="background-color: #ffe8e8; padding: 10px; margin-bottom: 20px; border-radius: 4px; text-align: left;">
                      <strong>Development Mode Notice:</strong> This email was intended for <strong>${email}</strong> but was sent to you because of Resend's test mode limitations.
                    </div>
                    <h2>${getEmailHeading(type)}</h2>
                    <p>${getEmailMessage(type)}</p>
                    <div class="code">${otp}</div>
                    <p>This code will expire in 5 minutes.</p>
                    <p class="note">If you didn't request this code, you can safely ignore this email.</p>
                  </div>
                  <div class="footer">
                    &copy; ${new Date().getFullYear()} comment.video. All rights reserved.
                  </div>
                </div>
              </body>
              </html>
            `
                    });
                    if (error) {
                        console.error("Resend API Error:", error);
                    } else {
                        console.log("Email sent successfully:", data);
                    }
                } catch (error) {
                    console.error("Error sending email:", error);
                // Still allow the OTP to be generated even if email sending fails
                }
            },
            // Set OTP length to 6 digits
            otpLength: 6,
            // OTP expires in 5 minutes (300 seconds)
            expiresIn: 300,
            // Allow automatic sign-up when the user is not registered
            disableSignUp: false
        })
    ],
    socialProviders: {
        google: {
            clientId: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"].GOOGLE_CLIENT_ID,
            clientSecret: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"].GOOGLE_CLIENT_SECRET
        }
    },
    trustedOrigins: [
        "exp://"
    ]
};
// Helper function to get the subject line based on the OTP type
function getSubject(type) {
    switch(type){
        case "sign-in":
            return "Your Sign In Code for comment.video";
        case "email-verification":
            return "Verify Your Email Address for comment.video";
        case "forget-password":
            return "Reset Your Password for comment.video";
        default:
            return "Your Verification Code for comment.video";
    }
}
// Helper function to get the email heading based on the OTP type
function getEmailHeading(type) {
    switch(type){
        case "sign-in":
            return "Sign In to Your Account";
        case "email-verification":
            return "Verify Your Email Address";
        case "forget-password":
            return "Reset Your Password";
        default:
            return "Your Verification Code";
    }
}
// Helper function to get the email message based on the OTP type
function getEmailMessage(type) {
    switch(type){
        case "sign-in":
            return "Use the following code to sign in to your account:";
        case "email-verification":
            return "To verify your email address, please enter the following code:";
        case "forget-password":
            return "To reset your password, please enter the following code:";
        default:
            return "Your verification code is:";
    }
}
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["betterAuth"])(config);
}}),
"[project]/packages/auth/src/index.rsc.ts [app-rsc] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getSession": (()=>getSession)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/auth.ts [app-rsc] (ecmascript)");
;
;
;
const getSession = async ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"].api.getSession)({
        headers: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])()
    });
;
}}),
"[project]/packages/auth/src/index.rsc.ts [app-rsc] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$index$2e$rsc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/auth/src/index.rsc.ts [app-rsc] (ecmascript) <locals>");
}}),
"[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */ __turbopack_context__.s({
    "createCallerFactory": (()=>createCallerFactory),
    "createTRPCContext": (()=>createTRPCContext),
    "createTRPCRouter": (()=>createTRPCRouter),
    "protectedProcedure": (()=>protectedProcedure),
    "publicProcedure": (()=>publicProcedure)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@trpc/server/dist/index.mjs [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$unstable$2d$core$2d$do$2d$not$2d$import$2f$initTRPC$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@trpc/server/dist/unstable-core-do-not-import/initTRPC.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$unstable$2d$core$2d$do$2d$not$2d$import$2f$error$2f$TRPCError$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@trpc/server/dist/unstable-core-do-not-import/error/TRPCError.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/superjson/dist/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/db/src/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$index$2e$rsc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/auth/src/index.rsc.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/auth.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const createTRPCContext = async (opts)=>{
    const session = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"].api.getSession({
        headers: opts.headers
    });
    return {
        session,
        db: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"]
    };
};
/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */ const t = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$unstable$2d$core$2d$do$2d$not$2d$import$2f$initTRPC$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initTRPC"].context().create({
    transformer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"],
    errorFormatter: ({ shape, error })=>({
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ZodError"] ? error.cause.flatten() : null
            }
        })
});
const createCallerFactory = t.createCallerFactory;
const createTRPCRouter = t.router;
/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */ const timingMiddleware = t.middleware(async ({ next, path })=>{
    const start = Date.now();
    if (t._config.isDev) {
        // artificial delay in dev 100-500ms
        const waitMs = Math.floor(Math.random() * 400) + 100;
        await new Promise((resolve)=>setTimeout(resolve, waitMs));
    }
    const result = await next();
    const end = Date.now();
    console.log(`[TRPC] ${path} took ${end - start}ms to execute`);
    return result;
});
const publicProcedure = t.procedure.use(timingMiddleware);
const protectedProcedure = t.procedure.use(timingMiddleware).use(({ ctx, next })=>{
    if (!ctx.session?.user) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$unstable$2d$core$2d$do$2d$not$2d$import$2f$error$2f$TRPCError$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRPCError"]({
            code: "UNAUTHORIZED"
        });
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: {
                ...ctx.session,
                user: ctx.session.user
            }
        }
    });
});
}}),
"[project]/packages/api/src/router/auth.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "authRouter": (()=>authRouter)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)");
;
const authRouter = {
    getSession: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["publicProcedure"].query(({ ctx })=>{
        return ctx.session;
    }),
    getSecretMessage: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].query(()=>{
        return "you can see this secret message!";
    })
};
}}),
"[externals]/@aws-sdk/client-s3 [external] (@aws-sdk/client-s3, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@aws-sdk/client-s3", () => require("@aws-sdk/client-s3"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/node:stream [external] (node:stream, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/http2 [external] (http2, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}}),
"[project]/packages/api/src/router/aws.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "awsRouter": (()=>awsRouter)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$aws$2d$sdk$2f$client$2d$s3__$5b$external$5d$__$2840$aws$2d$sdk$2f$client$2d$s3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@aws-sdk/client-s3 [external] (@aws-sdk/client-s3, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$sdk$2f$s3$2d$request$2d$presigner$2f$dist$2d$es$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@aws-sdk/s3-request-presigner/dist-es/index.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$sdk$2f$s3$2d$request$2d$presigner$2f$dist$2d$es$2f$getSignedUrl$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-sdk/s3-request-presigner/dist-es/getSignedUrl.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@trpc/server/dist/index.mjs [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$unstable$2d$core$2d$do$2d$not$2d$import$2f$error$2f$TRPCError$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@trpc/server/dist/unstable-core-do-not-import/error/TRPCError.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const bucketName = process.env.AWS_BUCKET_NAME;
const maxMB = 700;
const awsRouter = {
    initiateMultipartUpload: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
        videoId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string(),
        parts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].number(),
        contentLength: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].number()
    })).mutation(async ({ ctx, input })=>{
        const key = input.videoId;
        if (input.contentLength > maxMB * 1024 * 1024) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$unstable$2d$core$2d$do$2d$not$2d$import$2f$error$2f$TRPCError$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRPCError"]({
                code: "PRECONDITION_FAILED",
                message: "File is too large"
            });
        }
        const client = new __TURBOPACK__imported__module__$5b$externals$5d2f40$aws$2d$sdk$2f$client$2d$s3__$5b$external$5d$__$2840$aws$2d$sdk$2f$client$2d$s3$2c$__cjs$29$__["S3Client"]({
            useAccelerateEndpoint: true
        });
        const createCommand = new __TURBOPACK__imported__module__$5b$externals$5d2f40$aws$2d$sdk$2f$client$2d$s3__$5b$external$5d$__$2840$aws$2d$sdk$2f$client$2d$s3$2c$__cjs$29$__["CreateMultipartUploadCommand"]({
            Bucket: bucketName,
            Key: key,
            Metadata: {
                videoid: input.videoId,
                userid: ctx.session.user.id
            }
        });
        const { UploadId } = await client.send(createCommand);
        if (!UploadId) throw new Error("Failed to initiate multipart upload");
        const signedUrls = await Promise.all(Array.from({
            length: input.parts
        }, async (_, index)=>{
            const uploadPartCommand = new __TURBOPACK__imported__module__$5b$externals$5d2f40$aws$2d$sdk$2f$client$2d$s3__$5b$external$5d$__$2840$aws$2d$sdk$2f$client$2d$s3$2c$__cjs$29$__["UploadPartCommand"]({
                Bucket: bucketName,
                Key: key,
                UploadId,
                PartNumber: index + 1
            });
            const signedUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$sdk$2f$s3$2d$request$2d$presigner$2f$dist$2d$es$2f$getSignedUrl$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSignedUrl"])(client, uploadPartCommand, {
                expiresIn: 3600
            });
            return {
                url: signedUrl,
                partNumber: index + 1
            };
        }));
        return {
            uploadId: UploadId,
            signedUrls
        };
    }),
    completeMultipartUpload: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
        videoId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string(),
        uploadId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string(),
        parts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
            ETag: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string(),
            PartNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].number()
        }))
    })).mutation(async ({ ctx, input })=>{
        const key = input.videoId;
        const client = new __TURBOPACK__imported__module__$5b$externals$5d2f40$aws$2d$sdk$2f$client$2d$s3__$5b$external$5d$__$2840$aws$2d$sdk$2f$client$2d$s3$2c$__cjs$29$__["S3Client"]({
            useAccelerateEndpoint: true
        });
        try {
            const command = new __TURBOPACK__imported__module__$5b$externals$5d2f40$aws$2d$sdk$2f$client$2d$s3__$5b$external$5d$__$2840$aws$2d$sdk$2f$client$2d$s3$2c$__cjs$29$__["CompleteMultipartUploadCommand"]({
                Bucket: bucketName,
                Key: key,
                UploadId: input.uploadId,
                MultipartUpload: {
                    Parts: input.parts
                }
            });
            await client.send(command);
            const videoUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
            return {
                success: true,
                videoUrl
            };
        } catch (_error) {
            await client.send(new __TURBOPACK__imported__module__$5b$externals$5d2f40$aws$2d$sdk$2f$client$2d$s3__$5b$external$5d$__$2840$aws$2d$sdk$2f$client$2d$s3$2c$__cjs$29$__["AbortMultipartUploadCommand"]({
                Bucket: bucketName,
                Key: key,
                UploadId: input.uploadId
            }));
            // Sentry.captureException(_error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$unstable$2d$core$2d$do$2d$not$2d$import$2f$error$2f$TRPCError$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRPCError"]({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to complete multipart upload"
            });
        }
    })
};
}}),
"[project]/packages/db/src/index.ts [app-rsc] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
;
}}),
"[project]/packages/db/src/index.ts [app-rsc] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/db/src/index.ts [app-rsc] (ecmascript) <locals>");
}}),
"[project]/packages/api/src/router/comment.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "commentRouter": (()=>commentRouter)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/db/src/index.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)");
;
;
;
;
const commentRouter = {
    byVideoId: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
        videoId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string()
    })).query(async ({ ctx, input })=>{
        const comments = await ctx.db.query.VideoComment.findMany({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["VideoComment"].videoId, input.videoId),
            orderBy: (videoComment, { desc })=>[
                    desc(videoComment.createdAt)
                ],
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });
        return comments;
    }),
    create: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
        videoId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string(),
        content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string(),
        startTime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].number().optional(),
        endTime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].number().optional()
    })).mutation(async ({ ctx, input })=>{
        return ctx.db.insert(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["VideoComment"]).values({
            videoId: input.videoId,
            content: input.content,
            userId: ctx.session.user.id,
            startTime: input.startTime,
            endTime: input.endTime
        }).returning({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["VideoComment"].id
        });
    }),
    delete: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string()).mutation(async ({ ctx, input })=>{
        return ctx.db.delete(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["VideoComment"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["VideoComment"].id, input));
    })
};
}}),
"[project]/packages/api/src/router/post.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "postRouter": (()=>postRouter)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/db/src/index.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/select.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)");
;
;
;
;
const postRouter = {
    all: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["publicProcedure"].query(({ ctx })=>{
        // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
        return ctx.db.query.Post.findMany({
            orderBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Post"].id),
            limit: 10
        });
    }),
    byId: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["publicProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string()
    })).query(({ ctx, input })=>{
        // return ctx.db
        //   .select()
        //   .from(schema.post)
        //   .where(eq(schema.post.id, input.id));
        return ctx.db.query.Post.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Post"].id, input.id)
        });
    }),
    create: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CreatePostSchema"]).mutation(({ ctx, input })=>{
        return ctx.db.insert(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Post"]).values(input);
    }),
    delete: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string()).mutation(({ ctx, input })=>{
        return ctx.db.delete(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Post"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Post"].id, input));
    })
};
}}),
"[project]/packages/api/src/router/video.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "videoRouter": (()=>videoRouter)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/db/src/index.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/db/src/schema.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)");
;
;
;
;
const videoRouter = {
    create: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
        title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string()
    })).mutation(async ({ ctx, input })=>{
        return ctx.db.insert(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Video"]).values({
            title: input.title,
            userId: ctx.session.user.id
        }).returning({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Video"].id
        });
    }),
    all: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].query(async ({ ctx })=>{
        return ctx.db.query.Video.findMany({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Video"].userId, ctx.session.user.id)
        });
    }),
    delete: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string()).mutation(async ({ ctx, input })=>{
        return ctx.db.delete(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Video"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Video"].id, input));
    }),
    byId: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["protectedProcedure"].input(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string()).query(async ({ ctx, input })=>{
        return ctx.db.query.Video.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Video"].id, input)
        });
    })
};
}}),
"[project]/packages/api/src/root.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "appRouter": (()=>appRouter)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/router/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$aws$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/router/aws.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$comment$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/router/comment.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$post$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/router/post.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$video$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/router/video.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
const appRouter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTRPCRouter"])({
    auth: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authRouter"],
    post: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$post$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["postRouter"],
    aws: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$aws$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["awsRouter"],
    video: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$video$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["videoRouter"],
    comment: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$router$2f$comment$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commentRouter"]
});
}}),
"[project]/packages/api/src/index.ts [app-rsc] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createCaller": (()=>createCaller)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$root$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/root.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)");
;
;
/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */ const createCaller = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCallerFactory"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$root$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appRouter"]);
;
}}),
"[project]/packages/api/src/index.ts [app-rsc] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$root$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/root.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/api/src/index.ts [app-rsc] (ecmascript) <locals>");
}}),
"[project]/apps/nextjs/src/trpc/query-client.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createQueryClient": (()=>createQueryClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$hydration$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/hydration.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/superjson/dist/index.js [app-rsc] (ecmascript)");
;
;
const createQueryClient = ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 30 * 1000
            },
            dehydrate: {
                serializeData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].serialize,
                shouldDehydrateQuery: (query)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$hydration$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defaultShouldDehydrateQuery"])(query) || query.state.status === "pending",
                shouldRedactErrors: ()=>{
                    // We should not catch Next.js server errors
                    // as that's how Next.js detects dynamic pages
                    // so we cannot redact them.
                    // Next.js also automatically redacts errors for us
                    // with better digests.
                    return false;
                }
            },
            hydrate: {
                deserializeData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].deserialize
            }
        }
    });
}}),
"[project]/apps/nextjs/src/trpc/server.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "HydrateClient": (()=>HydrateClient),
    "getQueryClient": (()=>getQueryClient),
    "prefetch": (()=>prefetch),
    "trpc": (()=>trpc)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$hydration$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/hydration.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$HydrationBoundary$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/HydrationBoundary.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$tanstack$2d$react$2d$query$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@trpc/tanstack-react-query/dist/index.mjs [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$tanstack$2d$react$2d$query$2f$dist$2f$internals$2f$createOptionsProxy$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@trpc/tanstack-react-query/dist/internals/createOptionsProxy.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/packages/api/src/index.ts [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$root$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/root.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/api/src/trpc.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$trpc$2f$query$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs/src/trpc/query-client.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */ const createContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const heads = new Headers(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])());
    heads.set("x-trpc-source", "rsc");
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$trpc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTRPCContext"])({
        headers: heads
    });
});
const getQueryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$trpc$2f$query$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createQueryClient"]);
const trpc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$trpc$2f$tanstack$2d$react$2d$query$2f$dist$2f$internals$2f$createOptionsProxy$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTRPCOptionsProxy"])({
    router: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$api$2f$src$2f$root$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appRouter"],
    ctx: createContext,
    queryClient: getQueryClient
});
function HydrateClient(props) {
    const queryClient = getQueryClient();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$HydrationBoundary$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HydrationBoundary"], {
        state: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$hydration$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dehydrate"])(queryClient),
        children: props.children
    }, void 0, false, {
        fileName: "[project]/apps/nextjs/src/trpc/server.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
function prefetch(queryOptions) {
    const queryClient = getQueryClient();
    if (queryOptions.queryKey[1]?.type === "infinite") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        void queryClient.prefetchInfiniteQuery(queryOptions);
    } else {
        void queryClient.prefetchQuery(queryOptions);
    }
}
}}),
"[project]/apps/nextjs/src/app/(dashboard)/_components/video-dropzone.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "VideoDropzone": (()=>VideoDropzone)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const VideoDropzone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call VideoDropzone() from the server but VideoDropzone is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/nextjs/src/app/(dashboard)/_components/video-dropzone.tsx <module evaluation>", "VideoDropzone");
}}),
"[project]/apps/nextjs/src/app/(dashboard)/_components/video-dropzone.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "VideoDropzone": (()=>VideoDropzone)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const VideoDropzone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call VideoDropzone() from the server but VideoDropzone is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/nextjs/src/app/(dashboard)/_components/video-dropzone.tsx", "VideoDropzone");
}}),
"[project]/apps/nextjs/src/app/(dashboard)/_components/video-dropzone.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$dropzone$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/nextjs/src/app/(dashboard)/_components/video-dropzone.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$dropzone$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/apps/nextjs/src/app/(dashboard)/_components/video-dropzone.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$dropzone$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/apps/nextjs/src/app/(dashboard)/_components/video-list.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "VideoList": (()=>VideoList)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const VideoList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call VideoList() from the server but VideoList is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/nextjs/src/app/(dashboard)/_components/video-list.tsx <module evaluation>", "VideoList");
}}),
"[project]/apps/nextjs/src/app/(dashboard)/_components/video-list.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "VideoList": (()=>VideoList)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const VideoList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call VideoList() from the server but VideoList is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/nextjs/src/app/(dashboard)/_components/video-list.tsx", "VideoList");
}}),
"[project]/apps/nextjs/src/app/(dashboard)/_components/video-list.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$list$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/nextjs/src/app/(dashboard)/_components/video-list.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$list$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/apps/nextjs/src/app/(dashboard)/_components/video-list.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$list$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/apps/nextjs/src/app/(dashboard)/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>HomePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$trpc$2f$server$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs/src/trpc/server.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$dropzone$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs/src/app/(dashboard)/_components/video-dropzone.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/nextjs/src/app/(dashboard)/_components/video-list.tsx [app-rsc] (ecmascript)");
;
;
;
;
function HomePage() {
    // You can await this here if you don't want to show Suspense fallback below
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$trpc$2f$server$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prefetch"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$trpc$2f$server$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["trpc"].video.all.queryOptions());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$trpc$2f$server$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HydrateClient"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-2xl font-semibold",
                    children: "Videos"
                }, void 0, false, {
                    fileName: "[project]/apps/nextjs/src/app/(dashboard)/page.tsx",
                    lineNumber: 12,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$dropzone$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VideoDropzone"], {}, void 0, false, {
                    fileName: "[project]/apps/nextjs/src/app/(dashboard)/page.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$nextjs$2f$src$2f$app$2f28$dashboard$292f$_components$2f$video$2d$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VideoList"], {}, void 0, false, {
                    fileName: "[project]/apps/nextjs/src/app/(dashboard)/page.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/nextjs/src/app/(dashboard)/page.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/nextjs/src/app/(dashboard)/page.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}}),
"[project]/apps/nextjs/src/app/(dashboard)/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/nextjs/src/app/(dashboard)/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__6f9253a3._.js.map