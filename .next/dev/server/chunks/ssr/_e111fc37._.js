module.exports = [
"[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://qbynypvtlhobjjbqykhl.supabase.co");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase service role environment variables');
}
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false
    }
});
}),
"[project]/src/actions/tracking.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00e63fec07494d9b6bff512376f82685ed66565342":"cleanupOldSessions","4017dbf073cb4ec536d5cb3613184aba2d701ff611":"trackMediaView","4052c6c9a3b04008f12a4c7518ca7673eb1f3c98eb":"getMediaViewStats","4085610fbd31f5950682d194e61a6d8f4e1edd0f0f":"updateSessionTracking","40e64fb6d82efeec2f18a24bb724d5eccb62ad1f77":"getActiveSessions"},"",""] */ __turbopack_context__.s([
    "cleanupOldSessions",
    ()=>cleanupOldSessions,
    "getActiveSessions",
    ()=>getActiveSessions,
    "getMediaViewStats",
    ()=>getMediaViewStats,
    "trackMediaView",
    ()=>trackMediaView,
    "updateSessionTracking",
    ()=>updateSessionTracking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function updateSessionTracking(data) {
    try {
        // Check if session exists
        const { data: existing, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('session_tracking').select('*').eq('survey_id', data.survey_id).eq('session_id', data.session_id).single();
        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }
        const now = new Date().toISOString();
        if (existing) {
            // Calculate time spent on previous question/page
            const lastActive = new Date(existing.last_active_at);
            const timeSpentSeconds = Math.floor((Date.now() - lastActive.getTime()) / 1000);
            // Update existing session
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('session_tracking').update({
                current_page: data.current_page,
                question_id: data.question_id || null,
                time_spent_seconds: existing.time_spent_seconds + timeSpentSeconds,
                last_active_at: now
            }).eq('id', existing.id);
            if (updateError) throw updateError;
        } else {
            // Insert new session
            const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('session_tracking').insert([
                {
                    survey_id: data.survey_id,
                    session_id: data.session_id,
                    current_page: data.current_page,
                    question_id: data.question_id || null,
                    time_spent_seconds: 0,
                    last_active_at: now
                }
            ]);
            if (insertError) throw insertError;
        }
        return {
            success: true
        };
    } catch (error) {
        console.error('Update session tracking error:', error);
        return {
            success: false,
            error: 'Failed to update session tracking'
        };
    }
}
async function getActiveSessions(surveyId) {
    try {
        // Get sessions active in last 2 minutes
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const { data: sessions, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('session_tracking').select(`
        *,
        question:questions(question_text)
      `).eq('survey_id', surveyId).gte('last_active_at', twoMinutesAgo).order('last_active_at', {
            ascending: false
        });
        if (error) throw error;
        // Calculate stats
        const activeSessions = (sessions || []).map((session)=>({
                session_id: session.session_id,
                current_page: session.current_page,
                question_id: session.question_id,
                question_text: session.question?.question_text,
                time_spent_seconds: session.time_spent_seconds,
                last_active_at: session.last_active_at
            }));
        const totalTimeSpent = activeSessions.reduce((sum, session)=>sum + session.time_spent_seconds, 0);
        const averageTime = activeSessions.length > 0 ? totalTimeSpent / activeSessions.length : 0;
        return {
            success: true,
            data: {
                total_active_users: activeSessions.length,
                active_sessions: activeSessions,
                average_time_per_question: averageTime
            }
        };
    } catch (error) {
        console.error('Get active sessions error:', error);
        return {
            success: false,
            error: 'Failed to fetch active sessions'
        };
    }
}
async function cleanupOldSessions() {
    try {
        // Remove sessions older than 1 hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('session_tracking').delete().lt('last_active_at', oneHourAgo);
        if (error) throw error;
        return {
            success: true
        };
    } catch (error) {
        console.error('Cleanup old sessions error:', error);
        return {
            success: false,
            error: 'Failed to cleanup old sessions'
        };
    }
}
async function trackMediaView(data) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('media_views').insert([
            {
                survey_id: data.survey_id,
                question_id: data.question_id,
                session_id: data.session_id
            }
        ]);
        if (error) throw error;
        return {
            success: true
        };
    } catch (error) {
        console.error('Track media view error:', error);
        return {
            success: false,
            error: 'Failed to track media view'
        };
    }
}
async function getMediaViewStats(surveyId) {
    try {
        // First, get all questions with media for this survey
        const { data: questions, error: questionsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('questions').select('id, question_text, media_url').eq('survey_id', surveyId).not('media_url', 'is', null);
        if (questionsError) throw questionsError;
        // Then get all media views for this survey
        const { data: views, error: viewsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('media_views').select('question_id').eq('survey_id', surveyId);
        if (viewsError) throw viewsError;
        // Count views per question
        const viewCounts = {};
        (views || []).forEach((view)=>{
            viewCounts[view.question_id] = (viewCounts[view.question_id] || 0) + 1;
        });
        // Build stats for all questions with media
        const stats = (questions || []).filter((q)=>q.media_url) // Only questions with media
        .map((q)=>({
                question_id: q.id,
                question_text: q.question_text,
                media_url: q.media_url,
                view_count: viewCounts[q.id] || 0
            }));
        return {
            success: true,
            data: stats
        };
    } catch (error) {
        console.error('Get media view stats error:', error);
        return {
            success: false,
            error: 'Failed to fetch media view stats'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateSessionTracking,
    getActiveSessions,
    cleanupOldSessions,
    trackMediaView,
    getMediaViewStats
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateSessionTracking, "4085610fbd31f5950682d194e61a6d8f4e1edd0f0f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getActiveSessions, "40e64fb6d82efeec2f18a24bb724d5eccb62ad1f77", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cleanupOldSessions, "00e63fec07494d9b6bff512376f82685ed66565342", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(trackMediaView, "4017dbf073cb4ec536d5cb3613184aba2d701ff611", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMediaViewStats, "4052c6c9a3b04008f12a4c7518ca7673eb1f3c98eb", null);
}),
"[project]/.next-internal/server/app/survey/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/tracking.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/tracking.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/.next-internal/server/app/survey/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/tracking.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4017dbf073cb4ec536d5cb3613184aba2d701ff611",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["trackMediaView"],
    "4085610fbd31f5950682d194e61a6d8f4e1edd0f0f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSessionTracking"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$survey$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/survey/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/tracking.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/tracking.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_e111fc37._.js.map