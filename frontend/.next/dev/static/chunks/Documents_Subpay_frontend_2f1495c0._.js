(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/Subpay/frontend/lib/api/Explore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exploreApi",
    ()=>exploreApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/lib/apiClient.ts [app-client] (ecmascript)");
;
function buildQuery(params) {
    const parts = [];
    for (const [key, value] of Object.entries(params)){
        if (value !== undefined && value !== null && value !== "") {
            parts.push(`${key}=${encodeURIComponent(String(value))}`);
        }
    }
    return parts.length ? `?${parts.join("&")}` : "";
}
const exploreApi = {
    hubs: (params = {})=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/api/v1/explore/hubs${buildQuery({
            skip: 0,
            limit: 20,
            ...params
        })}`),
    content: (params = {})=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/api/v1/explore/content${buildQuery({
            skip: 0,
            limit: 20,
            ...params
        })}`),
    creators: (params = {})=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/api/v1/explore/creators${buildQuery({
            skip: 0,
            limit: 20,
            ...params
        })}`)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Subpay/frontend/hooks/useExplore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useExploreContent",
    ()=>useExploreContent,
    "useExploreCreators",
    ()=>useExploreCreators,
    "useExploreHubs",
    ()=>useExploreHubs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/@tanstack+react-query@5.91.2_react@19.2.3/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Explore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/lib/api/Explore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/lib/queryKeys.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
function useExploreHubs(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].exploreHubs(params),
        queryFn: {
            "useExploreHubs.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Explore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exploreApi"].hubs(params)
        }["useExploreHubs.useQuery"]
    });
}
_s(useExploreHubs, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useExploreContent(params = {}) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].exploreContent(params),
        queryFn: {
            "useExploreContent.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Explore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exploreApi"].content(params)
        }["useExploreContent.useQuery"]
    });
}
_s1(useExploreContent, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useExploreCreators(params = {}) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].exploreCreators(params),
        queryFn: {
            "useExploreCreators.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Explore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exploreApi"].creators(params)
        }["useExploreCreators.useQuery"]
    });
}
_s2(useExploreCreators, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Subpay/frontend/lib/api/subscription.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "subscriptionsApi",
    ()=>subscriptionsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/lib/apiClient.ts [app-client] (ecmascript)");
;
const subscriptionsApi = {
    // Member
    create: (body)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/api/v1/subscriptions", body),
    listMine: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/api/v1/subscriptions/me"),
    getOne: (subscriptionId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/api/v1/subscriptions/me/${subscriptionId}`),
    cancel: (subscriptionId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/api/v1/subscriptions/me/${subscriptionId}`),
    renew: (subscriptionId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/api/v1/subscriptions/me/${subscriptionId}/renew`),
    // Creator — own hub subscribers
    listSubscribers: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/api/v1/hubs/me/subscribers"),
    getSubscriber: (subscriptionId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/api/v1/hubs/me/subscribers/${subscriptionId}`)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Subpay/frontend/hooks/useSubscriptions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCancelSubscription",
    ()=>useCancelSubscription,
    "useCreateSubscription",
    ()=>useCreateSubscription,
    "useHubSubscriber",
    ()=>useHubSubscriber,
    "useHubSubscribers",
    ()=>useHubSubscribers,
    "useMySubscription",
    ()=>useMySubscription,
    "useMySubscriptions",
    ()=>useMySubscriptions,
    "useRenewSubscription",
    ()=>useRenewSubscription
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/@tanstack+react-query@5.91.2_react@19.2.3/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/@tanstack+react-query@5.91.2_react@19.2.3/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/@tanstack+react-query@5.91.2_react@19.2.3/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$subscription$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/lib/api/subscription.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/lib/queryKeys.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
function useMySubscriptions() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].subscriptionsMine,
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$subscription$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionsApi"].listMine
    });
}
_s(useMySubscriptions, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useMySubscription(subscriptionId) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].subscriptionOne(subscriptionId),
        queryFn: {
            "useMySubscription.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$subscription$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionsApi"].getOne(subscriptionId)
        }["useMySubscription.useQuery"],
        enabled: !!subscriptionId
    });
}
_s1(useMySubscription, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateSubscription() {
    _s2();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateSubscription.useMutation": (body)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$subscription$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionsApi"].create(body)
        }["useCreateSubscription.useMutation"],
        onSuccess: {
            "useCreateSubscription.useMutation": ()=>{
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].subscriptionsMine
                });
            }
        }["useCreateSubscription.useMutation"]
    });
}
_s2(useCreateSubscription, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCancelSubscription() {
    _s3();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCancelSubscription.useMutation": (subscriptionId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$subscription$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionsApi"].cancel(subscriptionId)
        }["useCancelSubscription.useMutation"],
        onSuccess: {
            "useCancelSubscription.useMutation": (_data, subscriptionId)=>{
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].subscriptionOne(subscriptionId)
                });
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].subscriptionsMine
                });
            }
        }["useCancelSubscription.useMutation"]
    });
}
_s3(useCancelSubscription, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useRenewSubscription() {
    _s4();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useRenewSubscription.useMutation": (subscriptionId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$subscription$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionsApi"].renew(subscriptionId)
        }["useRenewSubscription.useMutation"],
        onSuccess: {
            "useRenewSubscription.useMutation": (updated)=>{
                qc.setQueryData(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].subscriptionOne(updated.id), updated);
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].subscriptionsMine
                });
            }
        }["useRenewSubscription.useMutation"]
    });
}
_s4(useRenewSubscription, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useHubSubscribers() {
    _s5();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].hubSubscribers,
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$subscription$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionsApi"].listSubscribers
    });
}
_s5(useHubSubscribers, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useHubSubscriber(subscriptionId) {
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].hubSubscriber(subscriptionId),
        queryFn: {
            "useHubSubscriber.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$subscription$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionsApi"].getSubscriber(subscriptionId)
        }["useHubSubscriber.useQuery"],
        enabled: !!subscriptionId
    });
}
_s6(useHubSubscriber, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Subpay/frontend/lib/api/Plans.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "plansApi",
    ()=>plansApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/lib/apiClient.ts [app-client] (ecmascript)");
;
const plansApi = {
    // Creator — own hub plans
    listMyPlans: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/api/v1/hubs/me/plans"),
    createPlan: (body)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/api/v1/hubs/me/plans", body),
    getMyPlan: (planId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/api/v1/hubs/me/plans/${planId}`),
    updatePlan: (planId, body)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/api/v1/hubs/me/plans/${planId}`, body),
    deletePlan: (planId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/api/v1/hubs/me/plans/${planId}`),
    togglePlan: (planId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/api/v1/hubs/me/plans/${planId}/toggle`),
    // Member — browse another hub's plans
    listHubPlans: (hubId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/api/v1/hubs/${hubId}/plans`)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Subpay/frontend/hooks/usePlans.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreatePlan",
    ()=>useCreatePlan,
    "useDeletePlan",
    ()=>useDeletePlan,
    "useHubPlans",
    ()=>useHubPlans,
    "useMyPlan",
    ()=>useMyPlan,
    "useMyPlans",
    ()=>useMyPlans,
    "useTogglePlan",
    ()=>useTogglePlan,
    "useUpdatePlan",
    ()=>useUpdatePlan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/@tanstack+react-query@5.91.2_react@19.2.3/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/@tanstack+react-query@5.91.2_react@19.2.3/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/@tanstack+react-query@5.91.2_react@19.2.3/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/lib/api/Plans.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/lib/queryKeys.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
function useMyPlans() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].plansMine,
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plansApi"].listMyPlans
    });
}
_s(useMyPlans, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useMyPlan(planId) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].planMine(planId),
        queryFn: {
            "useMyPlan.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plansApi"].getMyPlan(planId)
        }["useMyPlan.useQuery"],
        enabled: !!planId
    });
}
_s1(useMyPlan, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreatePlan() {
    _s2();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreatePlan.useMutation": (body)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plansApi"].createPlan(body)
        }["useCreatePlan.useMutation"],
        onSuccess: {
            "useCreatePlan.useMutation": ()=>{
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].plansMine
                });
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].hubOwnStats
                });
            }
        }["useCreatePlan.useMutation"]
    });
}
_s2(useCreatePlan, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdatePlan() {
    _s3();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdatePlan.useMutation": ({ planId, body })=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plansApi"].updatePlan(planId, body)
        }["useUpdatePlan.useMutation"],
        onSuccess: {
            "useUpdatePlan.useMutation": (updated)=>{
                qc.setQueryData(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].planMine(updated.id), updated);
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].plansMine
                });
            }
        }["useUpdatePlan.useMutation"]
    });
}
_s3(useUpdatePlan, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeletePlan() {
    _s4();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeletePlan.useMutation": (planId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plansApi"].deletePlan(planId)
        }["useDeletePlan.useMutation"],
        onSuccess: {
            "useDeletePlan.useMutation": (_data, planId)=>{
                qc.removeQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].planMine(planId)
                });
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].plansMine
                });
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].hubOwnStats
                });
            }
        }["useDeletePlan.useMutation"]
    });
}
_s4(useDeletePlan, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useTogglePlan() {
    _s5();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useTogglePlan.useMutation": (planId)=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plansApi"].togglePlan(planId)
        }["useTogglePlan.useMutation"],
        onSuccess: {
            "useTogglePlan.useMutation": (updated)=>{
                qc.setQueryData(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].planMine(updated.id), updated);
                qc.invalidateQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].plansMine
                });
            }
        }["useTogglePlan.useMutation"]
    });
}
_s5(useTogglePlan, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useHubPlans(hubId) {
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$queryKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].plansForHub(hubId),
        queryFn: {
            "useHubPlans.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$lib$2f$api$2f$Plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["plansApi"].listHubPlans(hubId)
        }["useHubPlans.useQuery"],
        enabled: !!hubId
    });
}
_s6(useHubPlans, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$91$2e$2_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommunitiesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$hooks$2f$useExplore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/hooks/useExplore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$hooks$2f$useSubscriptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/hooks/useSubscriptions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$hooks$2f$usePlans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Subpay/frontend/hooks/usePlans.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const initial = (s)=>s.charAt(0).toUpperCase();
const HUB_COLORS = [
    "#8A2BE2",
    "#6366F1",
    "#F59E0B",
    "#10B981",
    "#EC4899",
    "#0EA5E9"
];
const hubColor = (id)=>HUB_COLORS[id % HUB_COLORS.length];
// ─── Hub Card ─────────────────────────────────────────────────────────────────
function HubCard({ hub, isSubscribed }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { data: plans = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$hooks$2f$usePlans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHubPlans"])(hub.id);
    const color = hubColor(hub.id);
    const activePlans = plans.filter((p)=>p.is_active).sort((a, b)=>a.price - b.price);
    const cheapest = activePlans[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200",
        style: {
            boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)"
        },
        onMouseEnter: (e)=>e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)",
        onMouseLeave: (e)=>e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)",
        onClick: ()=>router.push(`/hubs/${hub.id}`),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-[100px] overflow-hidden",
                children: [
                    hub.banner_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: hub.banner_url,
                        alt: "",
                        fill: true,
                        className: "object-cover transition-transform duration-500 group-hover:scale-105",
                        unoptimized: true,
                        sizes: "600px"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full",
                        style: {
                            background: `linear-gradient(135deg, #1A0A2E 0%, ${color} 100%)`
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 opacity-[0.08]",
                            style: {
                                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                backgroundSize: "24px 24px"
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 37,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-linear-to-t from-white/20 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -bottom-5 left-4 w-[48px] h-[48px] rounded-xl border-2 border-white overflow-hidden flex items-center justify-center text-white text-[17px] font-bold shrink-0",
                        style: {
                            background: hub.avatar_url ? "transparent" : color,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                        },
                        children: hub.avatar_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: hub.avatar_url,
                            alt: hub.name,
                            fill: true,
                            className: "object-cover",
                            unoptimized: true
                        }, void 0, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this) : initial(hub.creator.username)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    isSubscribed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#8A2BE2]",
                        children: "Joined"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-8 px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-3 mb-1.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-[14px] font-bold text-[#170C28] truncate",
                                    children: hub.name
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11.5px] text-[#8B7BA8] mt-0.5",
                                    children: [
                                        "@",
                                        hub.creator.username
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    hub.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[12.5px] text-[#534670] leading-relaxed mb-3 line-clamp-2",
                        children: hub.description
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this),
                    activePlans.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1.5 mb-3 flex-wrap",
                        children: activePlans.slice(0, 3).map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] font-semibold px-2.5 py-0.5 rounded-full",
                                style: {
                                    background: `${color}12`,
                                    color
                                },
                                children: [
                                    plan.name,
                                    " · ",
                                    plan.currency,
                                    " ",
                                    plan.price,
                                    "/",
                                    plan.billing_cycle === "monthly" ? "mo" : plan.billing_cycle === "yearly" ? "yr" : "once"
                                ]
                            }, plan.id, true, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                lineNumber: 80,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between pt-3 border-t border-[#F5F2FA]",
                        onClick: (e)=>e.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 text-[11.5px] text-[#BEB3D0]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            hub.subscriber_count.toLocaleString(),
                                            " members"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "·"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            hub.content_count,
                                            " posts"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            isSubscribed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[12px] font-semibold text-[#8A2BE2]",
                                children: "View →"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push(`/hubs/${hub.id}?tab=plans`),
                                className: "text-[12px] font-bold px-3.5 py-1.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.97]",
                                style: {
                                    background: "#8A2BE2",
                                    boxShadow: "0 2px 8px rgba(138,43,226,0.3)"
                                },
                                children: cheapest ? `Join · ${cheapest.currency} ${cheapest.price}` : "See plans"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(HubCard, "Fb1tOdg8E2+Yhf3BTIhEv8vtwEQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$hooks$2f$usePlans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHubPlans"]
    ];
});
_c = HubCard;
function CommunitiesPage() {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [debouncedSearch, setDebouncedSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("newest");
    const debounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleSearch = (value)=>{
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(()=>setDebouncedSearch(value), 400);
    };
    const { data: hubs = [], isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$hooks$2f$useExplore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useExploreHubs"])({
        q: debouncedSearch || undefined,
        sort_by: sort,
        limit: 50
    });
    const { data: mySubscriptions = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$hooks$2f$useSubscriptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMySubscriptions"])();
    const subscribedHubIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CommunitiesPage.useMemo[subscribedHubIds]": ()=>new Set(mySubscriptions.filter({
                "CommunitiesPage.useMemo[subscribedHubIds]": (s)=>s.status === "active"
            }["CommunitiesPage.useMemo[subscribedHubIds]"]).map({
                "CommunitiesPage.useMemo[subscribedHubIds]": (s)=>s.hub.id
            }["CommunitiesPage.useMemo[subscribedHubIds]"]))
    }["CommunitiesPage.useMemo[subscribedHubIds]"], [
        mySubscriptions
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#F7F8FC]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[680px] mx-auto px-5 py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-7",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-[24px] font-black text-[#170C28] tracking-tight",
                            children: "Communities"
                        }, void 0, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[13px] text-[#8B7BA8] mt-0.5",
                            children: "Find your people. Grow together."
                        }, void 0, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                    lineNumber: 142,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2.5 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BEB3D0]",
                                    width: "14",
                                    height: "14",
                                    viewBox: "0 0 14 14",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "1.6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "6",
                                            cy: "6",
                                            r: "4.2"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                            lineNumber: 151,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M9.5 9.5 13 13",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                            lineNumber: 151,
                                            columnNumber: 47
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: search,
                                    onChange: (e)=>handleSearch(e.target.value),
                                    placeholder: "Search communities…",
                                    className: "w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-[13px] text-[#170C28] placeholder:text-[#BEB3D0] outline-none transition-all",
                                    style: {
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)"
                                    },
                                    onFocus: (e)=>e.target.style.boxShadow = "0 0 0 2px #8A2BE2",
                                    onBlur: (e)=>e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex bg-white rounded-xl p-1 gap-1",
                            style: {
                                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)"
                            },
                            children: [
                                {
                                    label: "New",
                                    value: "newest"
                                },
                                {
                                    label: "Popular",
                                    value: "popular"
                                }
                            ].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSort(opt.value),
                                    className: "text-[12px] font-bold px-3.5 py-1.5 rounded-[9px] transition-all",
                                    style: sort === opt.value ? {
                                        background: "#8A2BE2",
                                        color: "white",
                                        boxShadow: "0 2px 8px rgba(138,43,226,0.3)"
                                    } : {
                                        color: "#8B7BA8"
                                    },
                                    children: opt.label
                                }, opt.value, false, {
                                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                    lineNumber: 148,
                    columnNumber: 9
                }, this),
                isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3",
                    children: [
                        ...Array(4)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl h-[220px] animate-pulse",
                            style: {
                                boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                            }
                        }, i, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 184,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                    lineNumber: 182,
                    columnNumber: 11
                }, this) : hubs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "py-20 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-14 h-14 rounded-2xl bg-[#F4EEFF] flex items-center justify-center mx-auto mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "22",
                                height: "22",
                                viewBox: "0 0 22 22",
                                fill: "none",
                                stroke: "#8A2BE2",
                                strokeWidth: "1.5",
                                strokeLinecap: "round",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "9",
                                        cy: "9",
                                        r: "6"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 132
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M15 15l4 4"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 161
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                                lineNumber: 190,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 189,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[14px] font-bold text-[#170C28]",
                            children: "No communities found"
                        }, void 0, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[12.5px] text-[#8B7BA8] mt-1",
                            children: "Try a different search term."
                        }, void 0, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 193,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                    lineNumber: 188,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3",
                    children: hubs.map((hub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HubCard, {
                            hub: hub,
                            isSubscribed: subscribedHubIds.has(hub.id)
                        }, hub.id, false, {
                            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                            lineNumber: 198,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
                    lineNumber: 196,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
            lineNumber: 139,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/Subpay/frontend/app/(authenticated)/communities/page.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_s1(CommunitiesPage, "qFGvlbw0tVbGMr7hCj9X0SYFOag=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$hooks$2f$useExplore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useExploreHubs"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Subpay$2f$frontend$2f$hooks$2f$useSubscriptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMySubscriptions"]
    ];
});
_c1 = CommunitiesPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "HubCard");
__turbopack_context__.k.register(_c1, "CommunitiesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_Subpay_frontend_2f1495c0._.js.map