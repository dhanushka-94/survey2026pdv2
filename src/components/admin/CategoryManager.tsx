'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory, updateCategory, deleteCategory } from '@/actions/categories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Category } from '@/lib/types';

interface CategoryManagerProps {
  surveyId: string;
  categories: Category[];
}

export function CategoryManager({ surveyId, categories: initialCategories }: CategoryManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;

    setLoading('add');
    const result = await createCategory({
      survey_id: surveyId,
      name: newCategoryName,
      order_index: categories.length,
    });
    setLoading(null);

    if (result.success) {
      setNewCategoryName('');
      setIsAdding(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;

    setLoading(id);
    const result = await updateCategory(id, { name: editingName });
    setLoading(null);

    if (result.success) {
      setEditingId(null);
      setEditingName('');
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setLoading(id);
    const result = await deleteCategory(id, surveyId);
    setLoading(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="space-y-4">
      {categories.length === 0 && !isAdding && (
        <p className="text-muted-foreground text-center py-8">
          No categories yet. Add your first category below.
        </p>
      )}

      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center gap-3 p-4 border border-border rounded-lg"
        >
          {editingId === category.id ? (
            <>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Category name"
                disabled={loading === category.id}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => handleUpdate(category.id)}
                disabled={loading === category.id || !editingName.trim()}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={cancelEdit}
                disabled={loading === category.id}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <span className="flex-1 font-medium">{category.name}</span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => startEdit(category)}
                disabled={loading === category.id}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(category.id, category.name)}
                disabled={loading === category.id}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-muted/50">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            disabled={loading === 'add'}
            className="flex-1"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={loading === 'add' || !newCategoryName.trim()}
          >
            Add
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setIsAdding(false);
              setNewCategoryName('');
            }}
            disabled={loading === 'add'}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)}>
          Add Category
        </Button>
      )}
    </div>
  );
}
