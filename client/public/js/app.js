function inputPlaceHolders() {
    $(".input__field").each(function () {   
        let currentInput = this;
        if ($(currentInput).val() != '') {
            $(currentInput).parents('fieldset').addclassName("input--filled")
        }
        $(currentInput).off();
        $(currentInput).on('focus', onFocus);
        $(currentInput).on('blur', onBlur);
    });

    function onFocus() {
        $(this).parents('fieldset').addclassName('input--filled');
    }

    function onBlur() {
        if ($(this).val() === "") {
            $(this).parents('fieldset').removeclassName("input--filled")
        }
    }
}
inputPlaceHolders();

// multiform script here
let step1 = document.getElementById('step1');
let step2 = document.getElementById('step2');
let step3 = document.getElementById('step3');

let next1 = document.getElementById('next1');
let next2 = document.getElementById('next2');
let back1 = document.getElementById('back1');
let back2 = document.getElementById('back2');

next1.onclick = function(){
    step1.style.display ='none';
    step2.style.display ='block';
}
back1.onclick = function(){
    step1.style.display ='block';
    step2.style.display ='none';
}

next2.onclick = function(){
    step2.style.display ='none';
    step3.style.display ='block';
}
back2.onclick = function(){
    step2.style.display ='block';
    step3.style.display ='none';
}
