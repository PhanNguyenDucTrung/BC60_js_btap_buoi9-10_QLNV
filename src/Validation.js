const getEl = id => {
    return document.getElementById(id);
};

function Validation() {
    this.emptyCheck = function (value, spanId, mess) {
        if (value === '') {
            getEl(spanId).innerHTML = mess;
            return false;
        }
        getEl(spanId).innerHTML = '';
        return true;
    };

    this.stringLengthCheck = function (value, spanId, mess, min, max) {
        if (!(value.trim().length >= min && value.trim().length <= max)) {
            getEl(spanId).innerHTML = mess;
            return false;
        }
        getEl(spanId).innerHTML = '';
        return true;
    };

    this.allNumberCheck = function (value, spanId, mess) {
        const reg = /^[0-9]+$/;
        if (!reg.test(value)) {
            getEl(spanId).innerHTML = mess;
            return false;
        }
        getEl(spanId).innerHTML = '';
        return true;
    };

    this.allLetterCheck = function (value, spanId, mess) {
        const reg = /^[a-zA-Z]+$/;
        if (!reg.test(value)) {
            getEl(spanId).innerHTML = mess;
            return false;
        }
        getEl(spanId).innerHTML = '';
        return true;
    };

    this.emailFormatCheck = function (value, spanId, mess) {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!reg.test(value)) {
            getEl(spanId).innerHTML = mess;
            return false;
        }
        getEl(spanId).innerHTML = '';
        return true;
    };

    this.positionCheck = function (spanId, mess) {
        console.log(spanId);
        if (document.getElementById('position').selectedIndex === 0) {
            getEl(spanId).innerHTML = mess;
            return false;
        }
        getEl(spanId).innerHTML = '';
        return true;
    };

    this.dateFormatCheck = function (value, spanId, mess) {
        const reg = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (!reg.test(value)) {
            getEl(spanId).innerHTML = mess;
            return false;
        }
        getEl(spanId).innerHTML = '';
        return true;
    };

    this.passwordCheck = function (value, spanId, mess) {
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{0,}$/;
        if (!reg.test(value)) {
            getEl(spanId).innerHTML = mess;
            return false;
        }
        getEl(spanId).innerHTML = '';
        return true;
    };

    this.workHoursCheck = function (value, spanId, mess, min, max) {
        if (!(Number(value) >= 80 && Number(value) <= 200)) {
            getEl(spanId).innerHTML = mess;
            return false;
        }
        getEl(spanId).innerHTML = '';
        return true;
    };
}
