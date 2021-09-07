export function validateaccount(values) {
    if (values.Account.trim() === "") return true;
}

export function validatecountry(values) {
    if (values.Country.trim() === "") return true;
}
export function validategender(values) {
    if (values.Gender.trim() === "") return true;
}

export function isfirstname(values) {
    if (values.FirstName.trim() === "") return true;
}
//^[a-zA-Z][a-zA-Z ]+[a-zA-Z ]$ 
export function ValidFirstname(values) {
    const pattern = /^[A-Za-z]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/g;
    const result = pattern.test(values.FirstName)
    return result
}
export function isLastname(values) {
    if (values.LastName.trim() === "") return true;
}
export function ValidLastname(values) {
    const pattern = /^[A-Za-z]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/g
    const result = pattern.test(values.LastName)
    return result
}
export function isEmail(values) {
    if (values.Email.trim() === "") return true;
}
export function validateEmail(values) {
    const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,20}[\.][a-z]{2,5}/g;
    const result = pattern.test(values.Email);
    return result
}
export function isPassword(values) {
    if (values.Password === "") return true;
}

export function validatepassowrd(values) {
    const pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g;
    const result = pattern.test(values.Password);
    return result
}

export function matchPassword(values) {
    const result = (values.Password === values.Confirm_Password)
    return result;
}

export function iscontact(values) {
    if (values.phone.trim() === "") return true;
}
export function validatecontact(values) {
    const pattern = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/g;
    const result = pattern.test(values.phone);
    return result
}

export function isTitle(values) {
    if (values.title.trim() === "") return true;
}

export function isCredential(values) {
    if (values.selectedValue == "") return true;
}

export function isAddress(values) {
    if (values.address.trim() === "") return true;
}

export function isStreetaddress(values) {
    if (values.street_address.trim() === "") return true;
}

export function isStreetline2(values) {
    if (values.address_line_2.trim() === "") return true;
}

export function isCity(values) {
    if (values.city.trim() === "") return true;
}

export function isState(values) {
    if (values.State.trim() === "") return true;

}

export function isZipcode(values) {
    if (values.zip_code.trim() === "") return true;
}

export function Zipcodevalidate(values) {
    const pattern = /(^\d{5}$)|(^\d{5}-\d{4}$)/g;
    const result = pattern.test(values.zip_code)
    return result
}

export function validatecustom_category(values){
    if (values.custom_category.trim() === "") return true;
}

export function validatesubject(values) {
    if (values.Subject.trim() === "") return true;
}

export function validatemessage(values) {
    if (values.Message.trim() === "") return true;
}

export function validateYear(values) {
    if (values.graduate_year === "") return true;
}

export function isProtoca(values) {
    if (values.Protoca_year.trim() === "") return true;
}

export function validateprotoca(values) {
    const pattern = /^[1-9]\d*$/g;
    const result = pattern.test(values.Protoca_year);
    return result
}

export function isRegistration(values) {
    if (values.registraion_number.trim() === "") return true;
}

export function validateRegistration(values) {
    const pattern = /^\d{16}$/g;
    const result = pattern.test(values.registraion_number);
    return result
}
export function isBoardcertification(values) {
    if (values.board_certification.trim() === "") return true;
}

export function isSchool(values) {
    if (values.School.trim() === "") return true;
}
export function isCategory(values) {
    if (values.category == "" || values.category == undefined) return true;
}
export function isAbout(values) {
    if (values.about.trim() === "") return true;
}
export function isAmount(values) {
    if (values.amount.trim() === "") return true;
}
export function validateAmount(values) {
    const pattern = /^\d+(\.\d{1,2})?$/g;
    const result = pattern.test(values.amount);
    return result
}
export function isOtp(values) {
    if (values.Otp.trim() === "") return true;
}
export function isMentalhealth(values) {
    if (values.Mental_health_role.trim() === "") return true;
}

export function isLicensestate(values) {
    if (values.License_state.trim() === "") return true;
}

export function isLicensenumber(values) {
    if (values.License_number.trim() === "") return true;
}

export function isLicensexpiration(values) {
    if (values.startDate === null) return true;
}
export function iscustom_address(values) {
    if (values.custom_address.trim() === "") return true;
}

export function validatecountry1(values) {
    if (values.Country1.trim() === "") return true;
}

export function isAddress1(values) {
    if (values.address1.trim() === "") return true;
}

export function isStreetaddress1(values) {
    if (values.street_address1.trim() === "") return true;
}

export function isStreetline21(values) {
    if (values.address_line_21.trim() === "") return true;
}

export function isCity1(values) {
    if (values.city1.trim() === "") return true;
}

export function isState1(values) {
    if (values.State1.trim() === "") return true;
}

export function isZipcode1(values) {
    if (values.zip_code1.trim() === "") return true;
}

export function Zipcodevalidate1(values) {
    const pattern = /(^\d{5}$)|(^\d{5}-\d{4}$)/g;
    const result = pattern.test(values.zip_code1)
    return result
}

