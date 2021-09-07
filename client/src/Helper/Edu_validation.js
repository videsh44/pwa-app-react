export const checkNumberFieldLength = (elem) => {
    if (elem.target.value.length > 4) {
        elem.target.value = elem.target.value.slice(0, 4);
    }
}

export const checkregistrationfieldlength = (elem) => {
    if (elem.target.value.length > 16) {
        elem.target.value = elem.target.value.slice(0, 16);
    }
}

