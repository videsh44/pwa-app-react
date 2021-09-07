import $ from 'jquery'
 function inputPlaceHolders(){
    $(".input__field").each(function () {   
        let currentInput = this;
        if ($(currentInput).val() != '') {
            $(currentInput).parents('fieldset').addClass("input--filled")
        }
        $(currentInput).off();
        $(currentInput).on('focus', onFocus);
        $(currentInput).on('blur', onBlur);
    });

    function onFocus() {
        $(this).parents('fieldset').addClass('input--filled');
    }

    function onBlur() {
        if ($(this).val() === "") {
            $(this).parents('fieldset').removeClass("input--filled")
        }
    }
}

export default inputPlaceHolders;

