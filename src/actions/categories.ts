'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { CategoryFormData } from '@/lib/types';

export async function getCategories(surveyId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('survey_id', surveyId)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get categories error:', error);
    return { success: false, error: 'Failed to fetch categories' };
  }
}

export async function createCategory(formData: CategoryFormData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([
        {
          survey_id: formData.survey_id,
          name: formData.name,
          order_index: formData.order_index,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/[admin]/surveys/${formData.survey_id}`);
    return { success: true, data };
  } catch (error) {
    console.error('Create category error:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, formData: Partial<CategoryFormData>) {
  try {
    const updateData: any = {};
    
    if (formData.name !== undefined) updateData.name = formData.name;
    if (formData.order_index !== undefined) updateData.order_index = formData.order_index;

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/[admin]/surveys`);
    return { success: true, data };
  } catch (error) {
    console.error('Update category error:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string, surveyId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath(`/[admin]/surveys/${surveyId}`);
    return { success: true };
  } catch (error) {
    console.error('Delete category error:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}

export async function reorderCategories(
  surveyId: string,
  categories: { id: string; order_index: number }[]
) {
  try {
    // Update all categories with new order
    const updates = categories.map((cat) =>
      supabaseAdmin
        .from('categories')
        .update({ order_index: cat.order_index })
        .eq('id', cat.id)
    );

    await Promise.all(updates);

    revalidatePath(`/[admin]/surveys/${surveyId}`);
    return { success: true };
  } catch (error) {
    console.error('Reorder categories error:', error);
    return { success: false, error: 'Failed to reorder categories' };
  }
}
