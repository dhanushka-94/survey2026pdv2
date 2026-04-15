'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createReward, updateReward, deleteReward } from '@/actions/rewards';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { Reward } from '@/lib/types';

interface RewardManagerProps {
  surveyId: string;
  rewards: Reward[];
}

export function RewardManager({ surveyId, rewards }: RewardManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [editTitle, setEditTitle] = useState('');
  const [editCouponCode, setEditCouponCode] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const resetCreateForm = () => {
    setTitle('');
    setCouponCode('');
    setWebsiteUrl('');
    setDescription('');
    setIsActive(true);
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading('create');
    const result = await createReward({
      survey_id: surveyId,
      title: title.trim(),
      coupon_code: couponCode.trim(),
      website_url: websiteUrl.trim(),
      description: description.trim(),
      is_active: isActive,
    });
    setLoading(null);
    if (!result.success) return alert(result.error);
    setIsAdding(false);
    resetCreateForm();
    router.refresh();
  };

  const startEdit = (reward: Reward) => {
    setEditingId(reward.id);
    setEditTitle(reward.title);
    setEditCouponCode(reward.coupon_code || '');
    setEditWebsiteUrl(reward.website_url || '');
    setEditDescription(reward.description || '');
    setEditIsActive(reward.is_active);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditCouponCode('');
    setEditWebsiteUrl('');
    setEditDescription('');
    setEditIsActive(true);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) return;
    setLoading(id);
    const result = await updateReward(id, {
      title: editTitle.trim(),
      coupon_code: editCouponCode.trim(),
      website_url: editWebsiteUrl.trim(),
      description: editDescription.trim(),
      is_active: editIsActive,
    });
    setLoading(null);
    if (!result.success) return alert(result.error);
    cancelEdit();
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reward?')) return;
    setLoading(id);
    const result = await deleteReward(id, surveyId);
    setLoading(null);
    if (!result.success) return alert(result.error);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {rewards.map((reward) => (
        <div key={reward.id} className="border border-border rounded-lg p-4 space-y-3">
          {editingId === reward.id ? (
            <>
              <Input label="Reward title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <div className="space-y-2">
                <Input label="Coupon code" value={editCouponCode} onChange={(e) => setEditCouponCode(e.target.value)} />
                <Button size="sm" variant="secondary" onClick={() => setEditCouponCode(generateCouponCode())}>
                  Auto Generate
                </Button>
              </div>
              <Input label="Website URL" value={editWebsiteUrl} onChange={(e) => setEditWebsiteUrl(e.target.value)} />
              <Textarea label="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
                Active reward
              </label>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleUpdate(reward.id)} disabled={loading === reward.id}>Save</Button>
                <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={loading === reward.id}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{reward.title}</p>
                  {reward.coupon_code && <p className="text-sm text-muted-foreground">Code: {reward.coupon_code}</p>}
                  {reward.website_url && <p className="text-sm text-muted-foreground break-all">{reward.website_url}</p>}
                  {reward.description && <p className="text-sm text-muted-foreground mt-2">{reward.description}</p>}
                </div>
                <span className={`px-2 py-1 text-xs rounded ${reward.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {reward.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => startEdit(reward)} disabled={loading === reward.id}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(reward.id)} disabled={loading === reward.id}>Delete</Button>
              </div>
            </>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/40">
          <Input label="Reward title" placeholder="e.g. $50 Coupon" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="space-y-2">
            <Input label="Coupon code" placeholder="e.g. VIXEN50" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
            <Button size="sm" variant="secondary" onClick={() => setCouponCode(generateCouponCode())}>
              Auto Generate
            </Button>
          </div>
          <Input label="Website URL" placeholder="https://example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
          <Textarea label="Description" placeholder="Short reward description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active reward
          </label>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={loading === 'create' || !title.trim()}>Create Reward</Button>
            <Button size="sm" variant="secondary" onClick={() => { setIsAdding(false); resetCreateForm(); }} disabled={loading === 'create'}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)}>Add Reward</Button>
      )}
    </div>
  );
}
