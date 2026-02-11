
const WORDPRESS_URL = 'https://crm.ideallivs.com';

async function directFetch() {
    console.log("Attempting direct fetch from WP API...");
    try {
        const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=3`);
        const posts = await response.json();

        posts.forEach(post => {
            console.log(`\nID: ${post.id}`);
            console.log(`Title: ${post.title.rendered}`);
            if (post.content && post.content.rendered) {
                console.log(`Content Length: ${post.content.rendered.length}`);
                console.log(`Snippet: ${post.content.rendered.substring(0, 150)}`);
            } else {
                console.log("No content found!");
            }
        });
    } catch (e) {
        console.error("Direct fetch failed:", e.message);
    }
}

directFetch();
