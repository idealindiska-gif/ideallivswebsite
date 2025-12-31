/**
 * Transforms WordPress API responses to match application Post interface
 * WordPress API returns {rendered: string} objects, but components expect plain strings
 */

import type { Post as WPPost } from './wordpress.d';
import type { Post as AppPost } from '@/types/wordpress';

/**
 * Transform a WordPress API Post to application Post format
 */
export function transformPost(wpPost: WPPost): AppPost {
  return {
    ...wpPost,
    title: wpPost.title.rendered,
    content: wpPost.content?.rendered,
    excerpt: wpPost.excerpt?.rendered,
    // Keep other properties as-is since they don't have .rendered structure
  } as AppPost;
}

/**
 * Transform an array of WordPress API Posts to application Post format
 */
export function transformPosts(wpPosts: WPPost[]): AppPost[] {
  return wpPosts.map(transformPost);
}
