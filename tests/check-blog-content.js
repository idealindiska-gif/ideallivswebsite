
const { getPostBySlug, getPostsPaginated } = require('./lib/wordpress');

async function checkBlogPosts() {
    try {
        console.log("Checking blog posts...");
        const response = await getPostsPaginated(1, 5);
        if (!response.data || response.data.length === 0) {
            console.log("No blog posts found.");
            return;
        }

        console.log(`Found ${response.data.length} posts.`);

        for (const post of response.data) {
            console.log(`\n--- Post: ${post.title.rendered} ---`);
            console.log(`Slug: ${post.slug}`);
            console.log(`Content present: ${!!post.content && !!post.content.rendered}`);
            if (post.content && post.content.rendered) {
                console.log(`Content snippet: ${post.content.rendered.substring(0, 100)}...`);
            } else {
                console.log("Content is empty or missing!");
            }
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Need to mock fetch because lib/wordpress uses it and this is node environment
// Actually let's assume fetch is available in Node 18+ which the user likely has.
// If not we might need to rely on the environment being set up.
// But wait, lib/wordpress is TS, can't run directly with node unless compiled or using ts-node.
// Let's create a JS version that does a raw fetch.

const WORDPRESS_URL = 'https://crm.ideallivs.com';

async function directFetch() {
    console.log("Attempting direct fetch from WP API...");
    try {
        const res = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=3`);
        const posts = await res.json();

        posts.forEach(post => {
            console.log(`\nID: ${post.id}`);
            console.log(`Title: ${post.title.rendered}`);
            console.log(`Content Length: ${post.content.rendered.length}`);
            console.log(`Snippet: ${post.content.rendered.substring(0, 150)}`);
        });
    } catch (e) {
        console.error("Direct fetch failed:", e);
    }
}

directFetch();
