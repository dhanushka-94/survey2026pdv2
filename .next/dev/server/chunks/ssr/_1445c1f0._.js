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
"[project]/src/actions/questions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4004cdd95628b105e30275ce41ad6ae95621ceef86":"uploadMedia","40501c750a2e4df480723a1a2aa078daf73f1469a7":"createQuestion","40534b527f7df28cae1d0759510187131c5909a7f7":"bulkImportQuestions","408f7ab6c1bdb6502bee9c9239c0992a0461e59f34":"getQuestions","40eff2f7c9f01d91e110eac8d0f63b028776b2eb1f":"deleteMedia","40fd37e11ec7da95f56026929cd0578043204dc97c":"getQuestion","608ba289557efdaadcef71ac6d21638dc036c0d573":"deleteQuestion","60b99da49f46600ce1558790fcca53acd3146f052d":"updateQuestion"},"",""] */ __turbopack_context__.s([
    "bulkImportQuestions",
    ()=>bulkImportQuestions,
    "createQuestion",
    ()=>createQuestion,
    "deleteMedia",
    ()=>deleteMedia,
    "deleteQuestion",
    ()=>deleteQuestion,
    "getQuestion",
    ()=>getQuestion,
    "getQuestions",
    ()=>getQuestions,
    "updateQuestion",
    ()=>updateQuestion,
    "uploadMedia",
    ()=>uploadMedia
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getQuestions(surveyId) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('questions').select(`
        *,
        category:categories(*)
      `).eq('survey_id', surveyId).order('order_index', {
            ascending: true
        });
        if (error) throw error;
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Get questions error:', error);
        return {
            success: false,
            error: 'Failed to fetch questions'
        };
    }
}
async function getQuestion(id) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('questions').select(`
        *,
        category:categories(*)
      `).eq('id', id).single();
        if (error) throw error;
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Get question error:', error);
        return {
            success: false,
            error: 'Failed to fetch question'
        };
    }
}
async function createQuestion(formData) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('questions').insert([
            {
                survey_id: formData.survey_id,
                category_id: formData.category_id || null,
                question_text: formData.question_text,
                description: formData.description || null,
                media_url: formData.media_url || null,
                question_type: formData.question_type,
                order_index: formData.order_index
            }
        ]).select().single();
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/[admin]/surveys/${formData.survey_id}`);
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Create question error:', error);
        return {
            success: false,
            error: 'Failed to create question'
        };
    }
}
async function updateQuestion(id, formData) {
    try {
        const updateData = {};
        if (formData.question_text !== undefined) updateData.question_text = formData.question_text;
        if (formData.description !== undefined) updateData.description = formData.description || null;
        if (formData.media_url !== undefined) updateData.media_url = formData.media_url || null;
        if (formData.question_type !== undefined) updateData.question_type = formData.question_type;
        if (formData.category_id !== undefined) updateData.category_id = formData.category_id || null;
        if (formData.order_index !== undefined) updateData.order_index = formData.order_index;
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('questions').update(updateData).eq('id', id).select().single();
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/[admin]/surveys`);
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Update question error:', error);
        return {
            success: false,
            error: 'Failed to update question'
        };
    }
}
async function deleteQuestion(id, surveyId) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('questions').delete().eq('id', id);
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/[admin]/surveys/${surveyId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error('Delete question error:', error);
        return {
            success: false,
            error: 'Failed to delete question'
        };
    }
}
async function uploadMedia(file) {
    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        // Upload to Supabase Storage
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from('survey-media').upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });
        if (error) throw error;
        // Get public URL
        const { data: urlData } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from('survey-media').getPublicUrl(fileName);
        return {
            success: true,
            url: urlData.publicUrl
        };
    } catch (error) {
        console.error('Upload media error:', error);
        return {
            success: false,
            error: 'Failed to upload media'
        };
    }
}
async function deleteMedia(url) {
    try {
        // Extract filename from URL
        const filename = url.split('/').pop();
        if (!filename) throw new Error('Invalid URL');
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from('survey-media').remove([
            filename
        ]);
        if (error) throw error;
        return {
            success: true
        };
    } catch (error) {
        console.error('Delete media error:', error);
        return {
            success: false,
            error: 'Failed to delete media'
        };
    }
}
async function bulkImportQuestions(data) {
    try {
        const { survey_id, category_id, question_type, questions, start_order_index } = data;
        // Filter out empty lines and trim whitespace
        const cleanedQuestions = questions.map((q)=>q.trim()).filter((q)=>q.length > 0);
        if (cleanedQuestions.length === 0) {
            return {
                success: false,
                error: 'No valid questions to import'
            };
        }
        // Create question records
        const questionRecords = cleanedQuestions.map((question_text, index)=>({
                survey_id,
                category_id: category_id || null,
                question_text,
                description: null,
                media_url: null,
                question_type,
                order_index: start_order_index + index
            }));
        const { data: insertedData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('questions').insert(questionRecords).select();
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/[admin]/surveys/${survey_id}`);
        return {
            success: true,
            data: insertedData,
            count: insertedData?.length || 0
        };
    } catch (error) {
        console.error('Bulk import questions error:', error);
        return {
            success: false,
            error: 'Failed to import questions'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    uploadMedia,
    deleteMedia,
    bulkImportQuestions
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getQuestions, "408f7ab6c1bdb6502bee9c9239c0992a0461e59f34", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getQuestion, "40fd37e11ec7da95f56026929cd0578043204dc97c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createQuestion, "40501c750a2e4df480723a1a2aa078daf73f1469a7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateQuestion, "60b99da49f46600ce1558790fcca53acd3146f052d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteQuestion, "608ba289557efdaadcef71ac6d21638dc036c0d573", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(uploadMedia, "4004cdd95628b105e30275ce41ad6ae95621ceef86", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteMedia, "40eff2f7c9f01d91e110eac8d0f63b028776b2eb1f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkImportQuestions, "40534b527f7df28cae1d0759510187131c5909a7f7", null);
}),
"[project]/src/actions/categories.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4063ad7326721af96ef7b3726d846e64d3807ce5b8":"createCategory","40721b0b34b99f1bb6814b9791dd876e3e70c72fdd":"getCategories","60117fc807b9f27d0a4a32b82b39dba6e5528ef196":"deleteCategory","60d2a13d922f4e17d997840445563989816657ed32":"updateCategory","60d5491057f4e142632a70830ca82867c59d4f10be":"reorderCategories"},"",""] */ __turbopack_context__.s([
    "createCategory",
    ()=>createCategory,
    "deleteCategory",
    ()=>deleteCategory,
    "getCategories",
    ()=>getCategories,
    "reorderCategories",
    ()=>reorderCategories,
    "updateCategory",
    ()=>updateCategory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getCategories(surveyId) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('categories').select('*').eq('survey_id', surveyId).order('order_index', {
            ascending: true
        });
        if (error) throw error;
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Get categories error:', error);
        return {
            success: false,
            error: 'Failed to fetch categories'
        };
    }
}
async function createCategory(formData) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('categories').insert([
            {
                survey_id: formData.survey_id,
                name: formData.name,
                order_index: formData.order_index
            }
        ]).select().single();
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/[admin]/surveys/${formData.survey_id}`);
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Create category error:', error);
        return {
            success: false,
            error: 'Failed to create category'
        };
    }
}
async function updateCategory(id, formData) {
    try {
        const updateData = {};
        if (formData.name !== undefined) updateData.name = formData.name;
        if (formData.order_index !== undefined) updateData.order_index = formData.order_index;
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('categories').update(updateData).eq('id', id).select().single();
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/[admin]/surveys`);
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Update category error:', error);
        return {
            success: false,
            error: 'Failed to update category'
        };
    }
}
async function deleteCategory(id, surveyId) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('categories').delete().eq('id', id);
        if (error) throw error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/[admin]/surveys/${surveyId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error('Delete category error:', error);
        return {
            success: false,
            error: 'Failed to delete category'
        };
    }
}
async function reorderCategories(surveyId, categories) {
    try {
        // Update all categories with new order
        const updates = categories.map((cat)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('categories').update({
                order_index: cat.order_index
            }).eq('id', cat.id));
        await Promise.all(updates);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/[admin]/surveys/${surveyId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error('Reorder categories error:', error);
        return {
            success: false,
            error: 'Failed to reorder categories'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCategories, "40721b0b34b99f1bb6814b9791dd876e3e70c72fdd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createCategory, "4063ad7326721af96ef7b3726d846e64d3807ce5b8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCategory, "60d2a13d922f4e17d997840445563989816657ed32", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCategory, "60117fc807b9f27d0a4a32b82b39dba6e5528ef196", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(reorderCategories, "60d5491057f4e142632a70830ca82867c59d4f10be", null);
}),
"[project]/.next-internal/server/app/[admin]/surveys/[id]/questions/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/surveys.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/questions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/actions/categories.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/surveys.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/questions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/categories.ts [app-rsc] (ecmascript)");
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
;
;
;
;
;
}),
"[project]/.next-internal/server/app/[admin]/surveys/[id]/questions/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/surveys.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/questions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/actions/categories.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
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
    "4004cdd95628b105e30275ce41ad6ae95621ceef86",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uploadMedia"],
    "4027a64e0dccf3631de50036c8fe6a8b8163861436",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAdmin"],
    "40501c750a2e4df480723a1a2aa078daf73f1469a7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createQuestion"],
    "40534b527f7df28cae1d0759510187131c5909a7f7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["bulkImportQuestions"],
    "405b5c6f81d49ce5f4d5ac91c1a80fc9c41984ba0c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSurvey"],
    "4063ad7326721af96ef7b3726d846e64d3807ce5b8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCategory"],
    "40721b0b34b99f1bb6814b9791dd876e3e70c72fdd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"],
    "408f7ab6c1bdb6502bee9c9239c0992a0461e59f34",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getQuestions"],
    "409ea891199aef9c726d2008793c2f1494a2ea4528",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSurvey"],
    "40a51905bbba375e10727af3af66eff74326aaf293",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteSurvey"],
    "40eff2f7c9f01d91e110eac8d0f63b028776b2eb1f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteMedia"],
    "40fd37e11ec7da95f56026929cd0578043204dc97c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getQuestion"],
    "60117fc807b9f27d0a4a32b82b39dba6e5528ef196",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteCategory"],
    "6058276b6aeea1adfddfc94ad1a11ced5f30bf9cad",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleSurveyStatus"],
    "608ba289557efdaadcef71ac6d21638dc036c0d573",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteQuestion"],
    "60b32d01d78c3fbd5337100d854341b71b93d794d9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSurvey"],
    "60b99da49f46600ce1558790fcca53acd3146f052d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateQuestion"],
    "60d2a13d922f4e17d997840445563989816657ed32",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCategory"],
    "60d5491057f4e142632a70830ca82867c59d4f10be",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["reorderCategories"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b$admin$5d2f$surveys$2f5b$id$5d2f$questions$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/[admin]/surveys/[id]/questions/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/surveys.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/actions/questions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/actions/categories.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/surveys.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$questions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/questions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$categories$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/categories.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_1445c1f0._.js.map