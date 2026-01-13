'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuestion, updateQuestion, deleteQuestion, bulkImportQuestions } from '@/actions/questions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { QuestionType, type Question, type Category } from '@/lib/types';

interface QuestionManagerProps {
  surveyId: string;
  questions: (Question & { category?: Category })[];
  categories: Category[];
}

export function QuestionManager({ surveyId, questions: initialQuestions, categories }: QuestionManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [quickEditImageId, setQuickEditImageId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question_text: '',
    description: '',
    media_url: '',
    media_urls: [] as string[],
    question_type: QuestionType.LIKE_DISLIKE,
    category_id: categories[0]?.id || '',
  });

  const [bulkImportData, setBulkImportData] = useState({
    questions_text: '',
    question_type: QuestionType.LIKE_DISLIKE,
    category_id: categories[0]?.id || '',
  });

  const resetForm = () => {
    setFormData({
      question_text: '',
      description: '',
      media_url: '',
      media_urls: [],
      question_type: QuestionType.LIKE_DISLIKE,
      category_id: categories[0]?.id || '',
    });
    setEditingQuestion(null);
    setShowForm(false);
  };

  const resetBulkImport = () => {
    setBulkImportData({
      questions_text: '',
      question_type: QuestionType.LIKE_DISLIKE,
      category_id: categories[0]?.id || '',
    });
    setShowBulkImport(false);
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('bulk');

    try {
      const questions = bulkImportData.questions_text
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 0);

      if (questions.length === 0) {
        alert('Please enter at least one question');
        setLoading(null);
        return;
      }

      const result = await bulkImportQuestions({
        survey_id: surveyId,
        category_id: bulkImportData.category_id,
        question_type: bulkImportData.question_type,
        questions,
        start_order_index: initialQuestions.length,
      });

      if (result.success) {
        alert(`Successfully imported ${result.count} questions!`);
        resetBulkImport();
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('An error occurred during import');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('form');

    try {
      const result = editingQuestion
        ? await updateQuestion(editingQuestion.id, formData)
        : await createQuestion({
            ...formData,
            survey_id: surveyId,
            order_index: initialQuestions.length,
          });

      if (result.success) {
        resetForm();
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('An error occurred');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      description: question.description || '',
      media_url: question.media_url || '',
      media_urls: question.media_urls || [],
      question_type: question.question_type,
      category_id: question.category_id || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, questionText: string) => {
    if (!confirm(`Are you sure you want to delete "${questionText}"?`)) {
      return;
    }

    setLoading(id);
    const result = await deleteQuestion(id, surveyId);
    setLoading(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleQuickImageUpdate = async (questionId: string, mediaUrl: string) => {
    setLoading(`image-${questionId}`);
    
    const result = await updateQuestion(questionId, { media_url: mediaUrl });
    
    if (result.success) {
      setQuickEditImageId(null);
      router.refresh();
    } else {
      alert(result.error);
    }
    
    setLoading(null);
  };

  const handleQuickImageRemove = async (questionId: string) => {
    if (!confirm('Are you sure you want to remove this image?')) {
      return;
    }
    
    setLoading(`image-${questionId}`);
    
    const result = await updateQuestion(questionId, { media_url: '' });
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    
    setLoading(null);
  };

  const questionTypeOptions = [
    { value: QuestionType.LIKE_DISLIKE, label: '👍👎 Like / Dislike' },
    { value: QuestionType.RATING_1_5, label: '⭐ Rating 1-5' },
    { value: QuestionType.COMBINED, label: '🎯 Combined (Both)' },
  ];

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  if (categoryOptions.length === 0) {
    categoryOptions.push({ value: '', label: 'No category' });
  }

  return (
    <div className="space-y-6">
      {!showForm && !showBulkImport && (
        <div className="flex gap-3">
          <Button onClick={() => setShowForm(true)}>
            Add Question
          </Button>
          <Button variant="secondary" onClick={() => setShowBulkImport(true)}>
            Bulk Import
          </Button>
        </div>
      )}

      {showBulkImport && (
        <div className="border border-border rounded-lg p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">
            Bulk Import Questions
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter one question per line. All questions will be imported with the same category and type.
          </p>
          <form onSubmit={handleBulkImport} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Question Type"
                options={questionTypeOptions}
                value={bulkImportData.question_type}
                onChange={(e) =>
                  setBulkImportData({
                    ...bulkImportData,
                    question_type: e.target.value as QuestionType,
                  })
                }
                disabled={loading === 'bulk'}
              />

              {categories.length > 0 && (
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={bulkImportData.category_id}
                  onChange={(e) =>
                    setBulkImportData({ ...bulkImportData, category_id: e.target.value })
                  }
                  disabled={loading === 'bulk'}
                />
              )}
            </div>

            <Textarea
              label="Questions (one per line)"
              placeholder="Enter your questions here, one per line:&#10;What do you think about feature A?&#10;How would you rate feature B?&#10;Do you like feature C?"
              value={bulkImportData.questions_text}
              onChange={(e) =>
                setBulkImportData({ ...bulkImportData, questions_text: e.target.value })
              }
              rows={10}
              required
              disabled={loading === 'bulk'}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {bulkImportData.questions_text.split('\n').filter(q => q.trim().length > 0).length} question(s) to import
              </p>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading === 'bulk'}>
                  {loading === 'bulk' ? 'Importing...' : 'Import Questions'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetBulkImport}
                  disabled={loading === 'bulk'}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showForm && (
        <div className="border border-border rounded-lg p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">
            {editingQuestion ? 'Edit Question' : 'New Question'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Question Text"
              placeholder="Enter your question"
              value={formData.question_text}
              onChange={(e) =>
                setFormData({ ...formData, question_text: e.target.value })
              }
              required
              disabled={loading === 'form'}
            />

            <Textarea
              label="Description (optional)"
              placeholder="Additional context or instructions"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={loading === 'form'}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Question Type"
                options={questionTypeOptions}
                value={formData.question_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    question_type: e.target.value as QuestionType,
                  })
                }
                disabled={loading === 'form'}
              />

              {categories.length > 0 && (
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  disabled={loading === 'form'}
                />
              )}
            </div>

            {/* Image Upload Mode Toggle */}
            <div className="border border-border rounded-lg p-4 bg-background">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-sm">Media</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, media_urls: [] })}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                      formData.media_urls.length === 0
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={loading === 'form'}
                  >
                    Single Image
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.media_urls.length === 0 && formData.media_url) {
                        setFormData({ ...formData, media_urls: [formData.media_url], media_url: '' });
                      } else if (formData.media_urls.length === 0) {
                        setFormData({ ...formData, media_urls: [''] });
                      }
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                      formData.media_urls.length > 0
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={loading === 'form'}
                  >
                    📸 Multiple Images
                  </button>
                </div>
              </div>

              {/* Single Image Mode */}
              {formData.media_urls.length === 0 && (
                <MediaUpload
                  currentUrl={formData.media_url}
                  onUpload={(url) => setFormData({ ...formData, media_url: url })}
                  onRemove={() => setFormData({ ...formData, media_url: '' })}
                  disabled={loading === 'form'}
                />
              )}

              {/* Multiple Images Mode */}
              {formData.media_urls.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Add multiple images for this question. Users can view them all (not as a carousel).
                  </p>
                  
                  {formData.media_urls.map((url, index) => (
                    <div key={index} className="border border-border rounded-lg p-3 bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-2">
                          {url && (
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full max-h-32 object-cover rounded-lg"
                            />
                          )}
                          <MediaUpload
                            currentUrl={url}
                            onUpload={(newUrl) => {
                              const newUrls = [...formData.media_urls];
                              newUrls[index] = newUrl;
                              setFormData({ ...formData, media_urls: newUrls });
                            }}
                            onRemove={() => {
                              const newUrls = formData.media_urls.filter((_, i) => i !== index);
                              setFormData({ ...formData, media_urls: newUrls });
                            }}
                            disabled={loading === 'form'}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          {/* Move Up */}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newUrls = [...formData.media_urls];
                                [newUrls[index], newUrls[index - 1]] = [newUrls[index - 1], newUrls[index]];
                                setFormData({ ...formData, media_urls: newUrls });
                              }}
                              className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                              title="Move up"
                              disabled={loading === 'form'}
                            >
                              ⬆️
                            </button>
                          )}
                          {/* Move Down */}
                          {index < formData.media_urls.length - 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newUrls = [...formData.media_urls];
                                [newUrls[index], newUrls[index + 1]] = [newUrls[index + 1], newUrls[index]];
                                setFormData({ ...formData, media_urls: newUrls });
                              }}
                              className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                              title="Move down"
                              disabled={loading === 'form'}
                            >
                              ⬇️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setFormData({ ...formData, media_urls: [...formData.media_urls, ''] })}
                    disabled={loading === 'form'}
                  >
                    ➕ Add Another Image
                  </Button>
                  
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    💡 Tip: Users will see all images in a grid. They can click to reveal each one.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading === 'form'}>
                {loading === 'form' ? 'Saving...' : editingQuestion ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                disabled={loading === 'form'}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {initialQuestions.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No questions yet. Add your first question above.
        </p>
      ) : (
        <div className="space-y-4">
          {initialQuestions.map((question, index) => (
            <div
              key={question.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      #{index + 1}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-primary-light text-primary rounded">
                      {question.question_type === QuestionType.LIKE_DISLIKE
                        ? '👍👎 Like/Dislike'
                        : question.question_type === QuestionType.RATING_1_5
                        ? '⭐ Rating 1-5'
                        : '🎯 Combined'}
                    </span>
                    {question.category && (
                      <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                        {question.category.name}
                      </span>
                    )}
                    {question.media_urls && question.media_urls.length > 0 ? (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                        📸 {question.media_urls.length} Images
                      </span>
                    ) : question.media_url ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                        🖼️ 1 Image
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                        No Image
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-foreground mb-1">
                    {question.question_text}
                  </h4>
                  {question.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {question.description}
                    </p>
                  )}
                  
                  {/* Multiple Images Preview */}
                  {question.media_urls && question.media_urls.length > 0 && quickEditImageId !== question.id && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {question.media_urls.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={url}
                            alt={`Media ${idx + 1}`}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Single Image Preview (legacy) */}
                  {question.media_url && !question.media_urls && quickEditImageId !== question.id && (
                    <div className="mt-2 relative inline-block">
                      {question.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={question.media_url}
                          alt="Question media"
                          className="max-w-xs max-h-32 rounded-lg object-cover"
                        />
                      ) : (
                        <video
                          src={question.media_url}
                          controls
                          className="max-w-xs rounded-lg"
                        />
                      )}
                    </div>
                  )}

                  {/* Quick Image Upload Section */}
                  {quickEditImageId === question.id && (
                    <div className="mt-3 p-4 border border-primary/30 rounded-lg bg-primary-lighter">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-primary">Quick Image Upload</p>
                        <button
                          onClick={() => setQuickEditImageId(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      <MediaUpload
                        currentUrl={question.media_url || ''}
                        onUpload={(url) => handleQuickImageUpdate(question.id, url)}
                        onRemove={() => handleQuickImageRemove(question.id)}
                        disabled={loading === `image-${question.id}`}
                      />
                      {loading === `image-${question.id}` && (
                        <p className="text-xs text-primary mt-2">Saving...</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2">
                  <Button
                    size="sm"
                    variant={(question.media_url || (question.media_urls && question.media_urls.length > 0)) ? 'secondary' : 'primary'}
                    onClick={() => setQuickEditImageId(quickEditImageId === question.id ? null : question.id)}
                    disabled={loading === question.id || loading === `image-${question.id}`}
                    title={(question.media_url || (question.media_urls && question.media_urls.length > 0)) ? 'Change Images' : 'Add Images'}
                  >
                    <span className="sm:hidden">{(question.media_url || (question.media_urls && question.media_urls.length > 0)) ? '🖼️' : '📷'}</span>
                    <span className="hidden sm:inline">{(question.media_url || (question.media_urls && question.media_urls.length > 0)) ? '🖼️ Edit' : '📷 Add'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(question)}
                    disabled={loading === question.id}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(question.id, question.question_text)}
                    disabled={loading === question.id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
