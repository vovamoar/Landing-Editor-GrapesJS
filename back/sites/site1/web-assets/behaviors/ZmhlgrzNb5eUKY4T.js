
function setLanguageCookie(locale) {
    document.cookie = "locale=" + locale + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    var dropdownWrapper = document.getElementById('language-selector-wrapper');

    if(!dropdownWrapper){
        return;
    }

    var dropdownItems = dropdownWrapper.querySelectorAll('.dropdown-item'); 

    dropdownItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var selectedLanguage = this.getAttribute('data-locale');
            setLanguageCookie(selectedLanguage);
        });
    });
});

