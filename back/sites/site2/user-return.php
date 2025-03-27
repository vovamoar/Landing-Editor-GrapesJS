<?php include(__DIR__.'/'.'config.php'); ?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <meta name="rating" content="General">
            <meta name="format-detection" content="phone=no">
            <meta name="robots" content="index,follow">
            <meta property="og:image" content="<?= $getImage('components.index.mainImage') ?>" />
            <meta property="article:author" content="<?= $domainName ?>" >
    
    <title><?= $translate('components.return-policy.meta.title') ?></title>

    
            <link href="ui-resources/style-library/MGKYWzcKe9Ml0jR2.css" rel="stylesheet">
            <link href="ui-resources/style-library/pAF85T4xmQzhOk1j.css" rel="stylesheet">
    
    <link rel="icon" href="favicon.ico">

    
        <link rel="apple-touch-icon" href="<?= $logoPath ?>">
    
    
    <?php include(__DIR__.'/'.'libs/consent-mode.php'); ?>
</head>

<body>
            <?php include(__DIR__.'/'.'libs/header.php'); ?>
    
    <main class="bg-white">
        <div style="min-height:100svh !important;">
                <?php include(__DIR__.'/'.'libs/return-policy/' . $locale . '.php'); ?>
        </div>
    </main>

            <?php include(__DIR__.'/'.'libs/footer.php'); ?>
    
    
            <script src="ui-resources/interactions/sNaainbXk4bbdXhs.js" defer></script>
            <script src="ui-resources/interactions/WVo1UEgaNegN13pu.js" defer></script>
    </body>

</html>
