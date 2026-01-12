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
"[project]/src/actions/responses.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"406b21244ee557a9647d952317d3486239a8046928":"getAggregatedResults","4097bae697e96ba10038c062f23ee4d218b076e922":"getResponses","40ba19ae6e6ca055909fa4865fa33fbaaca0ed809d":"getIndividualResponses"},"",""] */ __turbopack_context__.s([
    "getAggregatedResults",
    ()=>getAggregatedResults,
    "getIndividualResponses",
    ()=>getIndividualResponses,
    "getResponses",
    ()=>getResponses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getResponses(surveyId) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('responses').select('*').eq('survey_id', surveyId);
        if (error) throw error;
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Get responses error:', error);
        return {
            success: false,
            error: 'Failed to fetch responses'
        };
    }
}
async function getAggregatedResults(surveyId) {
    try {
        // Get all responses for the survey
        const { data: responses, error: responsesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('responses').select('*').eq('survey_id', surveyId);
        if (responsesError) throw responsesError;
        // Get all questions for the survey
        const { data: questions, error: questionsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('questions').select('*').eq('survey_id', surveyId);
        if (questionsError) throw questionsError;
        if (!responses || !questions) {
            return {
                success: true,
                data: {
                    survey_id: surveyId,
                    total_responses: 0,
                    by_age: {},
                    by_gender: {},
                    by_device: {},
                    by_browser: {},
                    by_os: {},
                    questions: []
                }
            };
        }
        // Calculate aggregations
        const byAge = {};
        const byGender = {};
        const byDevice = {};
        const byBrowser = {};
        const byOs = {};
        // Track unique sessions to avoid counting device info multiple times
        const sessionDevices = {};
        responses.forEach((response)=>{
            byAge[response.age_range] = (byAge[response.age_range] || 0) + 1;
            byGender[response.gender] = (byGender[response.gender] || 0) + 1;
            // Track device info per session (only count once per session)
            if (!sessionDevices[response.session_id]) {
                const device = response.device_type || 'desktop';
                const browser = response.browser || 'Unknown';
                const os = response.os || 'Unknown';
                sessionDevices[response.session_id] = {
                    device,
                    browser,
                    os
                };
                byDevice[device] = (byDevice[device] || 0) + 1;
                byBrowser[browser] = (byBrowser[browser] || 0) + 1;
                byOs[os] = (byOs[os] || 0) + 1;
            }
        });
        // Aggregate by question
        const questionResults = questions.map((question)=>{
            const questionResponses = responses.filter((r)=>r.question_id === question.id);
            const result = {
                question_id: question.id,
                question_text: question.question_text,
                question_type: question.question_type,
                total_responses: questionResponses.length
            };
            if (question.question_type === 'like_dislike') {
                result.like_count = questionResponses.filter((r)=>r.answer_value === 'like').length;
                result.dislike_count = questionResponses.filter((r)=>r.answer_value === 'dislike').length;
            } else if (question.question_type === 'rating_1_5') {
                result.rating_1 = questionResponses.filter((r)=>r.answer_value === '1').length;
                result.rating_2 = questionResponses.filter((r)=>r.answer_value === '2').length;
                result.rating_3 = questionResponses.filter((r)=>r.answer_value === '3').length;
                result.rating_4 = questionResponses.filter((r)=>r.answer_value === '4').length;
                result.rating_5 = questionResponses.filter((r)=>r.answer_value === '5').length;
                const sum = questionResponses.reduce((acc, r)=>acc + parseInt(r.answer_value), 0);
                result.average_rating = questionResponses.length > 0 ? sum / questionResponses.length : 0;
            }
            return result;
        });
        // Get unique session count
        const uniqueSessions = new Set(responses.map((r)=>r.session_id));
        return {
            success: true,
            data: {
                survey_id: surveyId,
                total_responses: uniqueSessions.size,
                by_age: byAge,
                by_gender: byGender,
                by_device: byDevice,
                by_browser: byBrowser,
                by_os: byOs,
                questions: questionResults
            }
        };
    } catch (error) {
        console.error('Get aggregated results error:', error);
        return {
            success: false,
            error: 'Failed to fetch aggregated results'
        };
    }
}
async function getIndividualResponses(surveyId) {
    try {
        // Get all responses with question info
        const { data: responses, error: responsesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('responses').select(`
        *,
        question:questions(id, question_text, question_type, media_url)
      `).eq('survey_id', surveyId).order('created_at', {
            ascending: true
        });
        if (responsesError) throw responsesError;
        // Get all media views for this survey
        const { data: mediaViews, error: mediaViewsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('media_views').select('question_id, session_id').eq('survey_id', surveyId);
        if (mediaViewsError) throw mediaViewsError;
        // Create a set of viewed media for quick lookup
        const viewedMedia = new Set((mediaViews || []).map((mv)=>`${mv.session_id}-${mv.question_id}`));
        if (!responses || responses.length === 0) {
            return {
                success: true,
                data: []
            };
        }
        // Group responses by session_id
        const sessionMap = {};
        // Track device names for numbering
        const deviceCounter = {};
        responses.forEach((response)=>{
            const sid = response.session_id;
            if (!sessionMap[sid]) {
                const deviceType = response.device_type || 'desktop';
                const browser = response.browser || 'Unknown';
                // Create device identifier for numbering
                const deviceKey = `${deviceType}-${browser}`;
                deviceCounter[deviceKey] = (deviceCounter[deviceKey] || 0) + 1;
                // Create display name like "iPhone Safari #1" or "Desktop Chrome #2"
                const deviceLabel = deviceType === 'mobile' ? '📱' : deviceType === 'tablet' ? '📲' : '🖥️';
                const displayName = `${deviceLabel} ${browser} #${deviceCounter[deviceKey]}`;
                sessionMap[sid] = {
                    session_id: sid,
                    display_name: displayName,
                    age_range: response.age_range,
                    gender: response.gender,
                    device_type: deviceType,
                    browser: browser,
                    os: response.os || 'Unknown',
                    submitted_at: response.created_at,
                    total_time_seconds: 0,
                    answers: []
                };
            }
            const timeSpent = response.time_spent_seconds || 0;
            const hasMedia = !!response.question?.media_url;
            const mediaViewed = viewedMedia.has(`${sid}-${response.question_id}`);
            sessionMap[sid].answers.push({
                question_id: response.question_id,
                question_text: response.question?.question_text || 'Unknown',
                question_type: response.question?.question_type || 'unknown',
                answer_value: response.answer_value,
                time_spent_seconds: timeSpent,
                has_media: hasMedia,
                media_viewed: mediaViewed
            });
            // Update total time
            sessionMap[sid].total_time_seconds += timeSpent;
            // Update submitted_at to the latest answer time
            if (new Date(response.created_at) > new Date(sessionMap[sid].submitted_at)) {
                sessionMap[sid].submitted_at = response.created_at;
            }
        });
        // Convert to array and sort by submission time (newest first)
        const individuals = Object.values(sessionMap).sort((a, b)=>new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
        return {
            success: true,
            data: individuals
        };
    } catch (error) {
        console.error('Get individual responses error:', error);
        return {
            success: false,
            error: 'Failed to fetch individual responses'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getResponses,
    getAggregatedResults,
    getIndividualResponses
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getResponses, "4097bae697e96ba10038c062f23ee4d218b076e922", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAggregatedResults, "406b21244ee557a9647d952317d3486239a8046928", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getIndividualResponses, "40ba19ae6e6ca055909fa4865fa33fbaaca0ed809d", null);
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
"[project]/.next-internal/server/app/[admin]/surveys/[id]/results/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/surveys.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/responses.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/actions/tracking.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/surveys.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$responses$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/responses.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/tracking.ts [app-rsc] (ecmascript)");
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
"[project]/.next-internal/server/app/[admin]/surveys/[id]/results/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/actions/surveys.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/actions/responses.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/actions/tracking.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0044c53403e3e6604193e2aa1c0d11d56084a09ed0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAdmin"],
    "00b5af0f019f07563997cf748ee8535a9b5066dce2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkAdminSession"],
    "00e3fdbd53c91de81a3ecacf9c1bcec97e0f099327",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminPath"],
    "00e63fec07494d9b6bff512376f82685ed66565342",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cleanupOldSessions"],
    "00ee61176fd1ce9dd9bbe5ebcd46ef5009a2aeb479",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSurveys"],
    "4017dbf073cb4ec536d5cb3613184aba2d701ff611",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["trackMediaView"],
    "4027a64e0dccf3631de50036c8fe6a8b8163861436",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAdmin"],
    "4052c6c9a3b04008f12a4c7518ca7673eb1f3c98eb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMediaViewStats"],
    "405b5c6f81d49ce5f4d5ac91c1a80fc9c41984ba0c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSurvey"],
    "406b21244ee557a9647d952317d3486239a8046928",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$responses$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAggregatedResults"],
    "4085610fbd31f5950682d194e61a6d8f4e1edd0f0f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSessionTracking"],
    "4097bae697e96ba10038c062f23ee4d218b076e922",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$responses$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getResponses"],
    "409ea891199aef9c726d2008793c2f1494a2ea4528",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSurvey"],
    "40a51905bbba375e10727af3af66eff74326aaf293",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteSurvey"],
    "40ba19ae6e6ca055909fa4865fa33fbaaca0ed809d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$responses$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getIndividualResponses"],
    "40e64fb6d82efeec2f18a24bb724d5eccb62ad1f77",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveSessions"],
    "6058276b6aeea1adfddfc94ad1a11ced5f30bf9cad",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleSurveyStatus"],
    "60b32d01d78c3fbd5337100d854341b71b93d794d9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSurvey"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f5b$admin$5d2f$surveys$2f5b$id$5d2f$results$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$responses$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/[admin]/surveys/[id]/results/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/actions/surveys.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/actions/responses.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/actions/tracking.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$surveys$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/surveys.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$responses$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/responses.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$tracking$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/tracking.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_d67d1350._.js.map