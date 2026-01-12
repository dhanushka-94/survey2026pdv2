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
"[project]/src/actions/surveys.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00ee61176fd1ce9dd9bbe5ebcd46ef5009a2aeb479":"getSurveys","405b5c6f81d49ce5f4d5ac91c1a80fc9c41984ba0c":"createSurvey","409ea891199aef9c726d2008793c2f1494a2ea4528":"getSurvey","40a51905bbba375e10727af3af66eff74326aaf293":"deleteSurvey","6058276b6aeea1adfddfc94ad1a11ced5f30bf9cad":"toggleSurveyStatus","60b32d01d78c3fbd5337100d854341b71b93d794d9":"updateSurvey"},"",""] */ __turbopack_context__.s([
    "createSurvey",
    ()=>createSurvey,
    "deleteSurvey",
    ()=>deleteSurvey,
    "getSurvey",
    ()=>getSurvey,
    "getSurveys",
    ()=>getSurveys,
    "toggleSurveyStatus",
    ()=>toggleSurveyStatus,
    "updateSurvey",
    ()=>updateSurvey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getSurveys() {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('surveys').select(`
        *,
        categories (count),
        questions (count),
        responses (count)
      `).order('created_at', {
            ascending: false
        });
        if (error) throw error;
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Get surveys error:', error);
        return {
            success: false,
            error: 'Failed to fetch surveys'
        };
    }
}
async function getSurvey(id) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('surveys').select(`
        *,
        categories (
          *,
          questions (*)
        )
      `).eq('id', id).single();
        if (error) throw error;
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Get survey error:', error);
        return {
            success: false,
            error: 'Failed to fetch survey'
        };
    }
}
async function createSurvey(formData) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('surveys').insert([
            {
                title: formData.title,
                description: formData.description || null,
                is_active: formData.is_active,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null
            }
        ]).select().single();
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/[admin]/surveys');
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Create survey error:', error);
        return {
            success: false,
            error: 'Failed to create survey'
        };
    }
}
async function updateSurvey(id, formData) {
    try {
        const updateData = {};
        if (formData.title !== undefined) updateData.title = formData.title;
        if (formData.description !== undefined) updateData.description = formData.description || null;
        if (formData.is_active !== undefined) updateData.is_active = formData.is_active;
        if (formData.start_date !== undefined) updateData.start_date = formData.start_date || null;
        if (formData.end_date !== undefined) updateData.end_date = formData.end_date || null;
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('surveys').update(updateData).eq('id', id).select().single();
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/[admin]/surveys');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/[admin]/surveys/${id}`);
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Update survey error:', error);
        return {
            success: false,
            error: 'Failed to update survey'
        };
    }
}
async function deleteSurvey(id) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('surveys').delete().eq('id', id);
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/[admin]/surveys');
        return {
            success: true
        };
    } catch (error) {
        console.error('Delete survey error:', error);
        return {
            success: false,
            error: 'Failed to delete survey'
        };
    }
}
async function toggleSurveyStatus(id, isActive) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('surveys').update({
            is_active: isActive
        }).eq('id', id).select().single();
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/[admin]/surveys');
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Toggle survey status error:', error);
        return {
            success: false,
            error: 'Failed to toggle survey status'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getSurveys,
    getSurvey,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    toggleSurveyStatus
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSurveys, "00ee61176fd1ce9dd9bbe5ebcd46ef5009a2aeb479", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSurvey, "409ea891199aef9c726d2008793c2f1494a2ea4528", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createSurvey, "405b5c6f81d49ce5f4d5ac91c1a80fc9c41984ba0c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateSurvey, "60b32d01d78c3fbd5337100d854341b71b93d794d9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteSurvey, "40a51905bbba375e10727af3af66eff74326aaf293", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleSurveyStatus, "6058276b6aeea1adfddfc94ad1a11ced5f30bf9cad", null);
}),
"[project]/.next-internal/server/app/[admin]/surveys/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/surveys.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/surveys.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/[admin]/surveys/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/surveys.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0044c53403e3e6604193e2aa1c0d11d56084a09ed0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAdmin"],
    "00b5af0f019f07563997cf748ee8535a9b5066dce2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkAdminSession"],
    "00e3fdbd53c91de81a3ecacf9c1bcec97e0f099327",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminPath"],
    "00ee61176fd1ce9dd9bbe5ebcd46ef5009a2aeb479",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSurveys"],
    "4027a64e0dccf3631de50036c8fe6a8b8163861436",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAdmin"],
    "405b5c6f81d49ce5f4d5ac91c1a80fc9c41984ba0c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSurvey"],
    "409ea891199aef9c726d2008793c2f1494a2ea4528",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSurvey"],
    "40a51905bbba375e10727af3af66eff74326aaf293",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteSurvey"],
    "6058276b6aeea1adfddfc94ad1a11ced5f30bf9cad",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleSurveyStatus"],
    "60b32d01d78c3fbd5337100d854341b71b93d794d9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSurvey"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b$admin$5d2f$surveys$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/[admin]/surveys/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/surveys.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/surveys.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_aeb7812d._.js.map