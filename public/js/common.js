const isEmpty = (val) => {
    return val == null || val.length === 0 || JSON.stringify(val) === "{}";
}

const isLiskAddress = (val) => {
    const regex = new RegExp(/^[0-9]{1,}L$/);
    return regex.test(val); 
}

const isAmount = (val, isTip) => {
    let regex;
    if (isTip) regex = new RegExp(/^([1-9][0-9]{0,4}|0)(\.\d{1,5})?$/);
    else regex = new RegExp(/^([1-9][0-9]{0,4}|0)(\.\d{1,8})?$/);
    return regex.test(val); 
}