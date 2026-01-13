'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { QuestionFormData } from '@/lib/types';

export async function getQuestions(surveyId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('questions')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('survey_id', surveyId)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get questions error:', error);
    return { success: false, error: 'Failed to fetch questions' };
  }
}

export async function getQuestion(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('questions')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get question error:', error);
    return { success: false, error: 'Failed to fetch question' };
  }
}

export async function createQuestion(formData: QuestionFormData) {
  try {
    // Filter out empty URLs from media_urls array
    const cleanMediaUrls = formData.media_urls && formData.media_urls.length > 0
      ? formData.media_urls.filter(url => url && url.trim().length > 0)
      : null;

    const { data, error } = await supabaseAdmin
      .from('questions')
      .insert([
        {
          survey_id: formData.survey_id,
          category_id: formData.category_id || null,
          question_text: formData.question_text,
          description: formData.description || null,
          media_url: formData.media_url || null,
          media_urls: cleanMediaUrls,
          question_type: formData.question_type,
          order_index: formData.order_index,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/[admin]/surveys/${formData.survey_id}`);
    return { success: true, data };
  } catch (error) {
    console.error('Create question error:', error);
    return { success: false, error: 'Failed to create question' };
  }
}

export async function updateQuestion(id: string, formData: Partial<QuestionFormData>) {
  try {
    const updateData: any = {};
    
    if (formData.question_text !== undefined) updateData.question_text = formData.question_text;
    if (formData.description !== undefined) updateData.description = formData.description || null;
    if (formData.media_url !== undefined) updateData.media_url = formData.media_url || null;
    if (formData.media_urls !== undefined) {
      // Filter out empty URLs
      const cleanMediaUrls = formData.media_urls && formData.media_urls.length > 0
        ? formData.media_urls.filter(url => url && url.trim().length > 0)
        : null;
      updateData.media_urls = cleanMediaUrls;
    }
    if (formData.question_type !== undefined) updateData.question_type = formData.question_type;
    if (formData.category_id !== undefined) updateData.category_id = formData.category_id || null;
    if (formData.order_index !== undefined) updateData.order_index = formData.order_index;

    const { data, error } = await supabaseAdmin
      .from('questions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/[admin]/surveys`);
    return { success: true, data };
  } catch (error) {
    console.error('Update question error:', error);
    return { success: false, error: 'Failed to update question' };
  }
}

export async function deleteQuestion(id: string, surveyId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath(`/[admin]/surveys/${surveyId}`);
    return { success: true };
  } catch (error) {
    console.error('Delete question error:', error);
    return { success: false, error: 'Failed to delete question' };
  }
}

export async function uploadMedia(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('survey-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('survey-media')
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Upload media error:', error);
    return { success: false, error: 'Failed to upload media' };
  }
}

export async function deleteMedia(url: string) {
  try {
    // Extract filename from URL
    const filename = url.split('/').pop();
    if (!filename) throw new Error('Invalid URL');

    const { error } = await supabaseAdmin.storage
      .from('survey-media')
      .remove([filename]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Delete media error:', error);
    return { success: false, error: 'Failed to delete media' };
  }
}

export async function bulkImportQuestions(data: {
  survey_id: string;
  category_id: string;
  question_type: string;
  questions: string[];
  start_order_index: number;
}) {
  try {
    const { survey_id, category_id, question_type, questions, start_order_index } = data;

    // Filter out empty lines and trim whitespace
    const cleanedQuestions = questions
      .map(q => q.trim())
      .filter(q => q.length > 0);

    if (cleanedQuestions.length === 0) {
      return { success: false, error: 'No valid questions to import' };
    }

    // Create question records
    const questionRecords = cleanedQuestions.map((question_text, index) => ({
      survey_id,
      category_id: category_id || null,
      question_text,
      description: null,
      media_url: null,
      question_type,
      order_index: start_order_index + index,
    }));

    const { data: insertedData, error } = await supabaseAdmin
      .from('questions')
      .insert(questionRecords)
      .select();

    if (error) throw error;

    revalidatePath(`/[admin]/surveys/${survey_id}`);
    return { 
      success: true, 
      data: insertedData,
      count: insertedData?.length || 0 
    };
  } catch (error) {
    console.error('Bulk import questions error:', error);
    return { success: false, error: 'Failed to import questions' };
  }
}
