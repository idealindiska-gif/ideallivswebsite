<?php
/**
 * Plugin Name: Clear Stripe Scheduled Actions
 * Description: One-click solution to clear wc_stripe_database_cache_prefetch_async actions
 * Version: 1.0
 * Author: Ideal Indiska LIVS
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add admin menu
add_action('admin_menu', 'cssa_add_admin_menu');
function cssa_add_admin_menu() {
    add_submenu_page(
        'woocommerce',
        'Clear Stripe Actions',
        'Clear Stripe Actions',
        'manage_woocommerce',
        'clear-stripe-actions',
        'cssa_admin_page'
    );
}

// Admin page
function cssa_admin_page() {
    ?>
    <div class="wrap">
        <h1>Clear Stripe Scheduled Actions</h1>
        
        <?php
        // Handle form submission
        if (isset($_POST['clear_actions']) && check_admin_referer('clear_stripe_actions')) {
            $deleted = cssa_clear_actions();
            echo '<div class="notice notice-success"><p><strong>Success!</strong> Deleted ' . $deleted . ' pending Stripe cache prefetch actions.</p></div>';
        }
        
        // Count pending actions
        global $wpdb;
        $pending_count = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->prefix}actionscheduler_actions 
                 WHERE hook = %s AND status = %s",
                'wc_stripe_database_cache_prefetch_async',
                'pending'
            )
        );
        ?>
        
        <div class="card" style="max-width: 600px;">
            <h2>Current Status</h2>
            <p><strong>Pending Actions:</strong> <?php echo number_format($pending_count); ?></p>
            
            <?php if ($pending_count > 0): ?>
                <p style="color: #d63638;">⚠️ You have <?php echo number_format($pending_count); ?> pending Stripe cache prefetch actions.</p>
                
                <form method="post" onsubmit="return confirm('Are you sure you want to delete <?php echo $pending_count; ?> actions? This is safe and won\'t affect payment processing.');">
                    <?php wp_nonce_field('clear_stripe_actions'); ?>
                    <p>
                        <button type="submit" name="clear_actions" class="button button-primary button-large">
                            🗑️ Delete All <?php echo number_format($pending_count); ?> Actions
                        </button>
                    </p>
                </form>
                
                <hr>
                
                <h3>Prevent Future Buildup</h3>
                <p>After clearing, you should disable Stripe cache prefetching to prevent this from happening again.</p>
                <p>Add this to your theme's <code>functions.php</code>:</p>
                <pre style="background: #f0f0f0; padding: 10px; border-radius: 4px;">add_filter('wc_stripe_enable_database_cache_prefetch', '__return_false');</pre>
                
            <?php else: ?>
                <p style="color: #00a32a;">✅ No pending Stripe cache prefetch actions found!</p>
            <?php endif; ?>
        </div>
        
        <div class="card" style="max-width: 600px; margin-top: 20px;">
            <h2>About These Actions</h2>
            <p>The <code>wc_stripe_database_cache_prefetch_async</code> actions are created by the WooCommerce Stripe Gateway plugin to cache payment method configurations.</p>
            <p><strong>It is safe to delete these actions:</strong></p>
            <ul>
                <li>✅ They are just cache prefetching (performance optimization)</li>
                <li>✅ Not critical for payment processing</li>
                <li>✅ Won't affect existing payments or customer checkout</li>
                <li>✅ The cache will rebuild naturally as needed</li>
            </ul>
        </div>
    </div>
    <?php
}

// Clear actions function
function cssa_clear_actions() {
    global $wpdb;
    
    $deleted = $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->prefix}actionscheduler_actions 
             WHERE hook = %s AND status = %s",
            'wc_stripe_database_cache_prefetch_async',
            'pending'
        )
    );
    
    // Also clean up related data
    $wpdb->query(
        "DELETE FROM {$wpdb->prefix}actionscheduler_logs 
         WHERE action_id NOT IN (
             SELECT action_id FROM {$wpdb->prefix}actionscheduler_actions
         )"
    );
    
    $wpdb->query(
        "DELETE FROM {$wpdb->prefix}actionscheduler_claims 
         WHERE claim_id NOT IN (
             SELECT claim_id FROM {$wpdb->prefix}actionscheduler_actions
         )"
    );
    
    return $deleted;
}

// Add prevention filter automatically
add_filter('wc_stripe_enable_database_cache_prefetch', '__return_false');
