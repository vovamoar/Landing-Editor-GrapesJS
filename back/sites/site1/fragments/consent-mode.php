<script async src="https://www.googletagmanager.com/gtag/js?id=<?= $tagId ?>"></script>
<script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('consent', 'default', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });
</script>
<script>
    gtag('config', '<?= $tagId ?>');
</script>