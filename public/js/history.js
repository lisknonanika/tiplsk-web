const getQueryParam = () => {
    if(window.location.search === "") return {};
    const obj = {};
    const params = window.location.search.split("?")[1].split("&");
    for (param of params) {
        const items = param.split("=");
        obj[items[0]] = Number(items[1]);
    }
    return obj;
}

onload = () => {
    const params = getQueryParam();
    if (!params || !params.limit || params.limit <= 20) {
        document.querySelector(`#select-20`).selected = true;
    } else if (params.limit <= 50) {
        document.querySelector(`#select-50`).selected = true;
    } else {
        document.querySelector(`#select-100`).selected = true;
    }
}

const redraw = async(limit) => {
    document.querySelector('.container').style = "visibility: hidden;";
    location.href = `../history?offset=0&limit=${limit}`;
}