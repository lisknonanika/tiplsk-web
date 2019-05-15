const copyCommand = () => {
    document.getSelection().selectAllChildren(document.querySelector('#tiplsk-command'));
    document.execCommand("copy");
    alert('Tweet内容をクリップボードにコピーしました。');
}

const tip = async() => {
    document.querySelector('.container').style = "visibility: hidden;";

    // 入力
    const inputResult = await Swal.fire({
        title: '以下を入力してください。',
        type: 'info',
        html: '<div id="field-recipient"><span class="prefix"></span><input type="text" id="text-recipient" placeholder="TwitterID"><span class="suffix"></span></div>' +
              '<div id="field-amount"><input type="text" id="text-amount" placeholder="Amount"><span class="suffix"></span></div>' +
              '<div id="field-note">*最大9,999.99999LSKまで。</div>',
        showCancelButton: true,
        confirmButtonText: 'Tweet内容を表示',
        cancelButtonText: 'Close',
        preConfirm: () => {
            const recipient = document.querySelector('#text-recipient').value;
            const amount = document.querySelector('#text-amount').value;
            if (!recipient || !amount || !isAmount(amount, true)) {
                Swal.showValidationMessage(`入力に誤りがあります。`);
            }
        }
    });
    if (!inputResult || !inputResult.value) {
        document.querySelector('.container').style = "";
        return;
    }

    // 確認
    const recipient = document.querySelector('#text-recipient').value;
    const amount = document.querySelector('#text-amount').value;
    const confirmResult = await Swal.fire({
        title: '以下をツイートしてください。',
        type: 'success',
        html: `<div id="tiplsk-command">` +
              `<a href="https://twitter.com/tiplsk" target="_blank">@tiplsk</a> tip <a href="https://twitter.com/${recipient}" target="_blank">@${recipient}</a> ${amount}` +
              `</div><br>` +
              `<div>` +
              `<a href="https://twitter.com/intent/tweet?text=%40tiplsk%20tip%20%40${recipient}%20${amount}" class="btn btn-primary" data-text="@tiplsk tip @${recipient} ${amount}" target="_blank">Tweet</a>` +
              `<a href="javascript: void 0;" class="btn btn-info" onclick="copyCommand();">Copy</a>` +
              `</div>`,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Close'
    });
    if (!confirmResult || !confirmResult.value) {
        document.querySelector('.container').style = "";
        return;
    }
}

const withdraw = async() => {
    document.querySelector('.container').style = "visibility: hidden;";

    // 入力
    const inputResult = await Swal.fire({
        title: '以下を入力してください。',
        type: 'info',
        html: '<div><input type="text" id="text-address" placeholder="Lisk Address"></div>' +
              '<div id="field-amount"><input type="text" id="text-amount" placeholder="Amount"><span class="suffix"></span></div>' +
              '<div id="field-note">*手数料0.1LSKは含めないで下さい。</div>' +
              '<div id="field-note">*最大9,999.99999999LSKまで。</div>',
        showCancelButton: true,
        confirmButtonText: 'Tweet内容を表示',
        cancelButtonText: 'Close',
        preConfirm: () => {
            const address = document.querySelector('#text-address').value;
            const amount = document.querySelector('#text-amount').value;
            if (!address || !amount || !isLiskAddress(address) || !isAmount(amount, false)) {
                Swal.showValidationMessage(`入力に誤りがあります。`);
            }
        }
    });
    if (!inputResult || !inputResult.value) {
        document.querySelector('.container').style = "";
        return;
    }

    // 確認
    const address = document.querySelector('#text-address').value;
    const amount = document.querySelector('#text-amount').value;
    const confirmResult = await Swal.fire({
        title: '以下をツイートしてください。',
        type: 'success',
        html: `<div id="tiplsk-command">` +
              `<a href="https://twitter.com/tiplsk" target="_blank">@tiplsk</a> withdraw <a href="https://explorer.lisk.io/address/${address}" target="_blank">${address}</a> ${amount}` +
              `</div><br>` +
              `<div>` +
              `<a href="https://twitter.com/intent/tweet?text=%40tiplsk%20withdraw%20${address}%20${amount}" class="btn btn-primary" data-text="@tiplsk withdraw ${address} ${amount}" target="_blank">Tweet</a>` +
              `<a href="javascript: void 0;" class="btn btn-info" onclick="copyCommand();">Copy</a>` +
              `</div>`,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Close'
    });
    if (!confirmResult || !confirmResult.value) {
        document.querySelector('.container').style = "";
        return;
    }
}

const deposit = async() => {
    document.querySelector('.container').style = "visibility: hidden;";

    // 入力
    const inputResult = await Swal.fire({
        title: '入金額を入力してください。',
        type: 'info',
        html: '<div id="field-amount"><input type="text" id="text-amount" placeholder="Amount"><span class="suffix"></span></div>' +
              '<div id="field-note">*手数料0.1LSKは含めないで下さい。</div>',
        showCancelButton: true,
        confirmButtonText: '入金内容を表示',
        cancelButtonText: 'Close',
        preConfirm: () => {
            const amount = document.querySelector('#text-amount').value;
            if (!amount || !isAmount(amount, false)) {
                Swal.showValidationMessage(`入力に誤りがあります。`);
            }
        }
    });
    if (!inputResult || !inputResult.value) {
        document.querySelector('.container').style = "";
        return;
    }

    // 確認
    const key = document.querySelector('#user-id').innerHTML;
    const amount = document.querySelector('#text-amount').value;
    const confirmResult = await Swal.fire({
        title: '以下の内容で入金してください。',
        type: 'success',
        html: `<div class="field-label">Address:</div><div class="field-val"><a href="https://explorer.lisk.io/address/10242065482765502110L" target="_blank">10242065482765502110L</a></div>` +
              `<div class="field-label">Amount:</div><div class="field-val">${amount}LSK</div>` +
              `<div class="field-label">Reference:</div><div class="field-val">${key}</div>`,
        showCancelButton: true,
        confirmButtonText: 'Lisk Hubを開く',
        cancelButtonText: 'Close'
    });
    if (!confirmResult || !confirmResult.value) {
        document.querySelector('.container').style = "";
        return;
    }
    const w = window.open(`lisk://wallet/send?recipient=10242065482765502110L&amount=${amount}&reference=${key}`, '_blank');
    document.querySelector('.container').style = "";
    w.close();
}

const validpw = (pw) => {
    return new RegExp(/(^[0-9a-zA-Z\-_@=+!]{8,}$)/).test(pw);
}

const changepw = async() => {
    document.querySelector('.container').style = "visibility: hidden;";

    // 入力
    const inputResult = await Swal.fire({
        title: '新しいパスワードを入力してください。',
        type: 'info',
        html: '<div id="field-pw"><input type="password" id="text-pw" placeholder="Password"></div>' +
              '<div><button id="btn-pw" class="btn btn-info">パスワードを表示</button></div>' +
              '<div id="field-note">*半角英数字と記号(-_@=+!)が使用出来ます。</div>',
        showCancelButton: true,
        confirmButtonText: 'パスワードを変更',
        cancelButtonText: 'Close',
        onBeforeOpen: () => {
            let isMask = true;
            document.querySelector("#btn-pw").addEventListener("click", () => {
                if (isMask) {
                    document.querySelector("#text-pw").type="text";
                    document.querySelector("#btn-pw").innerHTML = "パスワードを隠す"
                    isMask = false;
                } else {
                    document.querySelector("#text-pw").type="password";
                    document.querySelector("#btn-pw").innerHTML = "パスワードを表示"
                    isMask = true;
                }
            });
        },
        preConfirm: () => {
            const pw = document.querySelector("#text-pw").value;
            if (!pw || !validpw(pw)) {
                Swal.showValidationMessage(`入力に誤りがあります。`);
            }
        }
    });
    if (!inputResult || !inputResult.value) {
        document.querySelector('.container').style = "";
        return;
    }

    // 変更処理
    const pw = document.querySelector("#text-pw").value;
    const params = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({pw: pw})
    }
    const res = await fetch(`./password`, params);
    const json = await res.json();
    
    if (!isEmpty(json) && json.result) {
        await Swal.fire({
            title: 'パスワードを変更しました。',
            type: 'success',
            html: `<div>次回から新しいパスワードでログインしてください。</div>`
        });
        document.querySelector('.container').style = "";
    }  else {
        await Swal.fire({
            title: 'エラーが発生しました。',
            type: 'error',
            text: '何度も発生する場合は管理者にご連絡下さい。'
        });
        document.querySelector('.container').style = "";
    }
}
