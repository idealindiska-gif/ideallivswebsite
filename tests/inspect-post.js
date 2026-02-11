
const WORDPRESS_URL = 'https://crm.ideallivs.com';

async function inspectPost() {
    console.log("Fetching single post for inspection...");
    try {
        const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=1`);
        const posts = await response.json();

        if (posts.length > 0) {
            console.log(JSON.stringify(posts[0], null, 2));
        } else {
            console.log("No posts found.");
        }
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}

inspectPost();
