(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculatePercentage",
    ()=>calculatePercentage,
    "clearCompletedSurveys",
    ()=>clearCompletedSurveys,
    "clearSurveyCompletion",
    ()=>clearSurveyCompletion,
    "cn",
    ()=>cn,
    "endSession",
    ()=>endSession,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatFileSize",
    ()=>formatFileSize,
    "formatTimeSpent",
    ()=>formatTimeSpent,
    "generateSessionId",
    ()=>generateSessionId,
    "getAdminPath",
    ()=>getAdminPath,
    "getDeviceInfo",
    ()=>getDeviceInfo,
    "getOrCreateSessionId",
    ()=>getOrCreateSessionId,
    "hasCompletedSurvey",
    ()=>hasCompletedSurvey,
    "isAdminPath",
    ()=>isAdminPath,
    "isSurveyActive",
    ()=>isSurveyActive,
    "isValidMediaFile",
    ()=>isValidMediaFile,
    "markSurveyCompleted",
    ()=>markSurveyCompleted,
    "renewSessionId",
    ()=>renewSessionId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
function formatDateTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function isSurveyActive(isActive, startDate, endDate) {
    if (!isActive) return false;
    const now = new Date();
    if (startDate && new Date(startDate) > now) {
        return false;
    }
    if (endDate && new Date(endDate) < now) {
        return false;
    }
    return true;
}
function formatTimeSpent(seconds) {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function getOrCreateSessionId(forceNew = false) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const storageKey = 'survey_session_id';
    // If forceNew is true, always generate a new session ID
    if (forceNew) {
        const sessionId = generateSessionId();
        localStorage.setItem(storageKey, sessionId);
        return sessionId;
    }
    let sessionId = localStorage.getItem(storageKey);
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem(storageKey, sessionId);
    }
    return sessionId;
}
function endSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.removeItem('survey_session_id');
}
function renewSessionId() {
    endSession(); // First end the old session
    return getOrCreateSessionId(true);
}
function hasCompletedSurvey(surveyId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const completedSurveys = localStorage.getItem('completed_surveys');
    if (!completedSurveys) return false;
    const completed = JSON.parse(completedSurveys);
    return completed.includes(surveyId);
}
function markSurveyCompleted(surveyId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const completedSurveys = localStorage.getItem('completed_surveys');
    const completed = completedSurveys ? JSON.parse(completedSurveys) : [];
    if (!completed.includes(surveyId)) {
        completed.push(surveyId);
        localStorage.setItem('completed_surveys', JSON.stringify(completed));
    }
}
function clearCompletedSurveys() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.removeItem('completed_surveys');
}
function clearSurveyCompletion(surveyId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const completedSurveys = localStorage.getItem('completed_surveys');
    if (!completedSurveys) return;
    const completed = JSON.parse(completedSurveys);
    const filtered = completed.filter((id)=>id !== surveyId);
    localStorage.setItem('completed_surveys', JSON.stringify(filtered));
}
function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round(value / total * 100);
}
function isValidMediaFile(file) {
    const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm',
        'video/quicktime'
    ];
    return validTypes.includes(file.type);
}
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = [
        'Bytes',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
function getAdminPath() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.ADMIN_SECRET_PATH || 'admin-x9QpK7';
}
function isAdminPath(pathname) {
    const adminPath = getAdminPath();
    return pathname.startsWith(`/${adminPath}`);
}
function getDeviceInfo() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const ua = navigator.userAgent;
    // Detect device type
    let device_type = 'desktop';
    if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
        device_type = 'tablet';
    } else if (/Mobile|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        device_type = 'mobile';
    }
    // Detect browser
    let browser = 'Unknown';
    if (/Edg\//i.test(ua)) {
        browser = 'Edge';
    } else if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) {
        browser = 'Chrome';
    } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
        browser = 'Safari';
    } else if (/Firefox/i.test(ua)) {
        browser = 'Firefox';
    } else if (/MSIE|Trident/i.test(ua)) {
        browser = 'Internet Explorer';
    } else if (/Opera|OPR/i.test(ua)) {
        browser = 'Opera';
    } else if (/Samsung/i.test(ua)) {
        browser = 'Samsung Browser';
    }
    // Detect OS
    let os = 'Unknown';
    if (/Windows/i.test(ua)) {
        os = 'Windows';
    } else if (/Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) {
        os = 'macOS';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        os = 'iOS';
    } else if (/Android/i.test(ua)) {
        os = 'Android';
    } else if (/Linux/i.test(ua)) {
        os = 'Linux';
    } else if (/CrOS/i.test(ua)) {
        os = 'Chrome OS';
    }
    return {
        device_type,
        browser,
        os
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/survey/ClientSurveyRedirect.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientSurveyRedirect",
    ()=>ClientSurveyRedirect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ClientSurveyRedirect({ surveys }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const isNewSession = searchParams.get('new') === 'true';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClientSurveyRedirect.useEffect": ()=>{
            // If user wants a new session (clicked "Take Another Survey")
            if (isNewSession) {
                // Clear completed surveys to allow retaking
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.removeItem('completed_surveys');
                }
            // Note: renewSessionId() is not needed here as session was already ended
            // A new session will be created automatically when the survey loads
            }
            // Find the first survey that hasn't been completed
            const availableSurvey = surveys.find({
                "ClientSurveyRedirect.useEffect.availableSurvey": (survey)=>!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasCompletedSurvey"])(survey.id)
            }["ClientSurveyRedirect.useEffect.availableSurvey"]);
            if (availableSurvey) {
                // Redirect to the first uncompleted survey
                setTimeout({
                    "ClientSurveyRedirect.useEffect": ()=>{
                        router.push(`/survey/${availableSurvey.id}`);
                    }
                }["ClientSurveyRedirect.useEffect"], 100);
            } else if (surveys.length > 0 && isNewSession) {
                // If new session requested and surveys exist, go to first one (allow retake)
                setTimeout({
                    "ClientSurveyRedirect.useEffect": ()=>{
                        router.push(`/survey/${surveys[0].id}`);
                    }
                }["ClientSurveyRedirect.useEffect"], 100);
            } else {
                // All surveys completed, refresh to show "all completed" message
                router.refresh();
            }
        }
    }["ClientSurveyRedirect.useEffect"], [
        surveys,
        router,
        isNewSession
    ]);
    // Show loading while redirecting
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-pink-50 to-red-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center max-w-md px-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-6xl mb-4 heart-pulse",
                    children: "💖"
                }, void 0, false, {
                    fileName: "[project]/src/components/survey/ClientSurveyRedirect.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-lg text-muted-foreground mb-2",
                    children: "Loading survey..."
                }, void 0, false, {
                    fileName: "[project]/src/components/survey/ClientSurveyRedirect.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground",
                    children: [
                        "Found ",
                        surveys.length,
                        " active survey",
                        surveys.length !== 1 ? 's' : ''
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/survey/ClientSurveyRedirect.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                surveys.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-red-500 mt-2",
                    children: "No surveys found. Please create one in the admin dashboard."
                }, void 0, false, {
                    fileName: "[project]/src/components/survey/ClientSurveyRedirect.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/survey/ClientSurveyRedirect.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/survey/ClientSurveyRedirect.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(ClientSurveyRedirect, "8i1PHtDhDf9NMpKTkROQKKwA/RI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ClientSurveyRedirect;
var _c;
__turbopack_context__.k.register(_c, "ClientSurveyRedirect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/survey/ClearHistoryButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClearHistoryButton",
    ()=>ClearHistoryButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function ClearHistoryButton() {
    const handleClear = ()=>{
        localStorage.removeItem('completed_surveys');
        window.location.reload();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleClear,
        className: "px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium",
        children: "🔄 Clear History & Start Fresh"
    }, void 0, false, {
        fileName: "[project]/src/components/survey/ClearHistoryButton.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = ClearHistoryButton;
var _c;
__turbopack_context__.k.register(_c, "ClearHistoryButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_140bd058._.js.map