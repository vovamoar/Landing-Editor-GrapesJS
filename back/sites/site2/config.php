<?php
$themeColor = [
  'headerBgClassList' => 'bg-dark navbar-dark',
  'headerTextClassList' => 'text-dark',
  'footerBgClassList' => 'bg-dark bg-gradient text-dark',
  'footerTextClassList' => 'text-dark',
  'firstBtnBgClassList' => 'btn-outline-secondary',
  'secondBtnBgClassList' => 'btn-warning',
  'otherElementsBgClassList' => 'bg-info bg-gradient text-light',
];
$tagId = '';
$now = date('Y');
$logoPath = 'ui-resources/images/logo.png?b32c2d0f-d0e4-30e7-877a-593994b214f7';
$name = 'TestArvhive';
$domainName = 'TestArchive';
$availableLocales = [
  0 => 'uk_UA',
];
$locale = checkAndSetLocale($availableLocales);
$lang = getLang($locale);
$localeDirPath =  __DIR__ . '/vernacular';
$pathToLocaleFile = $localeDirPath . '/' . $locale . '.php';
$includesDirPath =  __DIR__ . '/libs';
$pathToImagesStructureFile = $includesDirPath . '/images.php';
$contactsInformation = [
  'addresses' => 
  [
    'uk_UA' => 'Odessa',
  ],
  'has_iframe' => false,
  'telegram' => 'https://www.telegram.com/TestArchive',
  'instagram' => 'https://www.instagram.com/TestArchive',
  'tiktok' => 'https://www.tiktok.com/@TestArchive',
  'x' => 'https://twitter.com/TestArchive',
  'facebook' => 'https://www.facebook.com/TestArchive',
  'linkedin' => 'https://www.linkedin.com/in/TestArchive',
  'youtube' => 'https://www.youtube.com/TestArchive',
];
$commonData = [
  'iframeSrc' => NULL,
  'minPrice' => NULL,
  'maxPrice' => NULL,
  'currencyLabel' => NULL,
  'servicesQuantity' => NULL,
  'goodsQuantity' => NULL,
  'postsQuantity' => NULL,
];

if (file_exists($pathToLocaleFile)) {
    $structure = include $pathToLocaleFile;
} else {
    echo "Error to load translate file: $pathToLocaleFile";
    exit;
}

if (file_exists($pathToImagesStructureFile)) {
    $imagesStructure = include $pathToImagesStructureFile;
} else {
    echo "Error to load images structure file: $pathToImagesStructureFile";
    exit;
}

if (!function_exists('array_merge_recursive_distinct')) {
    function array_merge_recursive_distinct(array &$array1, array &$array2) {
        $merged = $array1;

        foreach ($array2 as $key => &$value) {
            if (is_array($value) && isset($merged[$key]) && is_array($merged[$key])) {
                $merged[$key] = array_merge_recursive_distinct($merged[$key], $value);
            } else {
                $merged[$key] = $value;
            }
        }

        return $merged;
    }
}

$allStructure = array_merge_recursive_distinct($structure, $imagesStructure);

function checkAndSetLocale(array $availableLocales)
{
    $defaultLocale = $availableLocales[0];

    if (isset($_COOKIE["locale"]) && in_array($_COOKIE["locale"], $availableLocales)) {
        $locale = $_COOKIE["locale"];
    } else {
        $locale = $defaultLocale;
        setcookie("locale", $locale, time() + 3600 * 24 * 30, "/");
    }

    return $locale;
}

function createTranslator(array $structure)
{
    return function ($key) use ($structure) {
        $keys = explode('.', $key);
        $current = $structure;

        foreach ($keys as $nestedKey) {
            if (isset($current[$nestedKey])) {
                if (empty($current[$nestedKey])) {
                    return $key;
                }
                $current = $current[$nestedKey];
            } else {
                return "key: $key is not exists";
            }
        }

        if(is_array($current)){
            return $key;
        }

        return $current;
    };
}

function createImageGetter(array $imagesStructure)
{
    return function ($key) use ($imagesStructure) {
        $keys = explode('.', $key);
        $keys[] = 'localPath';
        $current = $imagesStructure;

        foreach ($keys as $nestedKey) {
            if (isset($current[$nestedKey])) {
                if (empty($current[$nestedKey])) {
                    return $key;
                }
                $current = $current[$nestedKey];
            } else {
                return "key: $key is not exists";
            }
        }

        return $current;
    };
}

function getLang(string $locale)
{
    $explodeLocale = explode('_', $locale);
    return $explodeLocale[0];
}

function truncateText($text, $maxLength, $encoding = 'UTF-8')
{
    if (mb_strlen($text, $encoding) > $maxLength) {
        return mb_substr($text, 0, $maxLength, $encoding) . '...';
    }
    return $text;
}

function formatTextToParagraphs($text) {
    $sentences = preg_split('/(\.|\!|\?)(\s)/', $text, -1, PREG_SPLIT_DELIM_CAPTURE);

    $paragraphs = '';
    $paragraph = '';

    foreach ($sentences as $sentence) {
        $paragraph .= $sentence;

        if (preg_match('/(\.|\!|\?)$/', $sentence)) {
            $paragraphs .= '<p>' . trim($paragraph) . '</p>' . "\n";
            $paragraph = '';
        }
    }

    if (!empty(trim($paragraph))) {
        $paragraphs .= '<p>' . trim($paragraph) . '</p>' . "\n";
    }

    return $paragraphs;
}

$translate = createTranslator($structure);
$contacts = createTranslator($contactsInformation);
$getImage = createImageGetter($imagesStructure);
extract($themeColor);
?>
