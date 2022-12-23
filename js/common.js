$(window).ready(function (){
    const input1 = document.querySelector('#input1');
    input1.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            input1.value = 0;
        } else {
            const formatValue = value.toLocaleString('ko-KR');
            input1.value = formatValue;
        }
    });

    const input2 = document.querySelector('#input2');
    input2.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            input2.value = 0;
        } else {
            const formatValue = value.toLocaleString('ko-KR');
            input2.value = formatValue;
        }
    });
    
    const input3 = document.querySelector('#input3');
    input3.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            input3.value = 0;
        } else {
            const formatValue = value.toLocaleString('ko-KR');
            input3.value = formatValue;
        }
    });
    
    const input4 = document.querySelector('#input4');
    input4.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {
            input4.value = 0;
        } else {
            const formatValue = value.toLocaleString('ko-KR');
            input4.value = formatValue;
        }
    });

});