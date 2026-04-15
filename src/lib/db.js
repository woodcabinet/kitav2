/**
 * KitaKakis — Supabase data layer
 * All DB calls go through here so components stay clean.
 */
import supabase from './supabase';

// ─── ORDERS ─────────────────────────────────────────────────────────────────

export async function saveOrder({ userId, items, total }) {
  const { data, error } = await supabase
    .from('orders')
    .insert({ user_id: userId, items, total })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ─── RSVPs ───────────────────────────────────────────────────────────────────

export async function saveRsvp({ userId, eventId, eventTitle }) {
  const { data, error } = await supabase
    .from('rsvps')
    .upsert({ user_id: userId, event_id: eventId, event_title: eventTitle },
             { onConflict: 'user_id,event_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRsvp({ userId, eventId }) {
  const { error } = await supabase
    .from('rsvps')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);
  if (error) throw error;
}

export async function getRsvps(userId) {
  const { data, error } = await supabase
    .from('rsvps')
    .select('event_id')
    .eq('user_id', userId);
  if (error) throw error;
  return new Set(data.map(r => r.event_id));
}

// ─── WISHLIST ────────────────────────────────────────────────────────────────

export async function saveWishlistItem({ userId, itemId }) {
  const { error } = await supabase
    .from('wishlist')
    .upsert({ user_id: userId, item_id: itemId },
             { onConflict: 'user_id,item_id' });
  if (error) throw error;
}

export async function deleteWishlistItem({ userId, itemId }) {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('item_id', itemId);
  if (error) throw error;
}

export async function getWishlist(userId) {
  const { data, error } = await supabase
    .from('wishlist')
    .select('item_id')
    .eq('user_id', userId);
  if (error) throw error;
  return new Set(data.map(w => w.item_id));
}

// ─── BRAND FOLLOWS ───────────────────────────────────────────────────────────

export async function followBrand({ userId, brandId }) {
  const { error } = await supabase
    .from('follows')
    .upsert({ user_id: userId, brand_id: brandId },
             { onConflict: 'user_id,brand_id' });
  if (error) throw error;
}

export async function unfollowBrand({ userId, brandId }) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('user_id', userId)
    .eq('brand_id', brandId);
  if (error) throw error;
}

export async function getFollows(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select('brand_id')
    .eq('user_id', userId);
  if (error) throw error;
  return new Set(data.map(f => f.brand_id));
}
