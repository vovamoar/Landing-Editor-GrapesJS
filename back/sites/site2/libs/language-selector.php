<style>
        .modal-backdrop {
            --bs-backdrop-zindex: 1050;
            --bs-backdrop-bg: #000;
            --bs-backdrop-opacity: 0.5;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100vw;
            height: 100vh;
            background-color: var(--bs-backdrop-bg);
        }
    </style>

<button type="button" class="nav-link <?= $headerTextClassList ?>" data-bs-toggle="modal" data-bs-target="#languageSelectorModal"
    id="language-selector">
    <?= $translate('common.language-selector.' . $locale) ?>
</button>


<div class="modal fade" id="languageSelectorModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="list-group">
                    <?php foreach($availableLocales as $availableLocale): ?>
                    <a href="#" onclick="setLanguageCookie('<?= $availableLocale ?>')"
                        class="list-group-item list-group-item-action"><?= $translate('common.language-selector.' . $availableLocale) ?></a>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
</div>
